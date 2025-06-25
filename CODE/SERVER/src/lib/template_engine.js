// -- IMPORTS

import { getLocalizedText } from 'senselogic-gist';
import { parseDocument, DomUtils } from 'htmlparser2';
import { selectAll } from 'css-select';
import render from 'dom-serializer';

// -- TYPES

export class TemplateEngine
{
    // -- CONSTRUCTORS

    constructor(
        templateString,
        variableMap = {},
        languageTag = 'en',
        enableInlineCss = false
        )
    {
        this.templateString = templateString;
        this.variableMap = variableMap;
        this.languageTag = languageTag;
        this.enableInlineCss = enableInlineCss;
    }

    // -- OPERATIONS

    render(
        )
    {
        let result = this.templateString;

        result = this.replaceLocalizedText( result );
        result = this.parseConditionals( result );
        result = this.parseLoops( result );
        result = this.renderTemplate( result );
        result = this.inlineStyle( result );

        return result;
    }

    // ~~

    renderTemplate(
        templateString
        )
    {
        return templateString.replace(
            /\{\{([^{}]+)\}\}/g,
            ( match, code ) =>
            {
                try
                {
                    return this.safeEval( code.trim() );
                }
                catch ( error )
                {
                    console.error( `Error evaluating template code: ${ code }`, error );

                    return '';
                }
            }
            );
    }

    // ~~

    parseConditionals(
        templateString
        )
    {
        templateString = templateString.replace(
            /\{\{#if ([^{}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
            ( match, condition, content ) =>
            {
                try
                {
                    return this.safeEval( condition.trim() ) ? content : '';
                }
                catch ( error )
                {
                    console.error( `Error evaluating if condition: ${ condition }`, error );

                    return '';
                }
            }
            );

            return templateString.replace(
                /\{\{#if ([^{}]+)\}\}([\s\S]*?)\{\{:else\}\}([\s\S]*?)\{\{\/if\}\}/g,
                ( match, condition, ifContent, elseContent ) =>
                {
                    try
                    {
                        return this.safeEval( condition.trim() ) ? ifContent : elseContent;
                    }
                    catch ( error )
                    {
                        console.error( `Error evaluating if-else condition: ${ condition }`, error );

                        return '';
                    }
                }
                );
    }

    // ~~

    parseLoops(
        templateString
        )
    {
        return templateString.replace(
            /\{\{#each ([^{}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
            ( match, arrayName, content ) =>
            {
                try
                {
                    const array = this.safeEval( arrayName.trim() );

                    if ( Array.isArray( array ) )
                    {
                        return array.map(
                            ( item ) =>
                            {
                                const loopVariableMap = { ...this.variableMap, item };

                                return new TemplateEngine( content, loopVariableMap ).render();
                            }
                            ).join( '' );
                    }

                    return '';
                }
                catch ( error )
                {
                    console.error( `Error evaluating loop for: ${ arrayName }`, error );

                    return '';
                }
            }
            );
    }

    // ~~

    safeEval(
        code
        )
    {
        const functionBody = `with (this.variableMap) { return ${ code }; }`;

        return new Function( 'variableMap', functionBody )
            .call( this, this.variableMap );
    }

    // ~~

    replaceLocalizedText(
        templateString
        )
    {
        return templateString.replace(
            /__(.*?)__/g,
            ( match, text ) =>
            {
                return getLocalizedText( text, {}, this.languageTag );
            }
            );
    }

    // ~~

    applyInline(
        document,
        cssRuleArray
        )
    {
        for ( let { selector, property } of cssRuleArray )
        {
            let elementArray = selectAll( selector, document );

            for ( let element of elementArray )
            {
                if ( !element.attribs )
                {
                    element.attribs = {};
                }

                let existingStyle = DomUtils.getAttributeValue( element, 'style' ) || '';
                let newStyle = `${ existingStyle } ${ property }`.trim();
                element.attribs.style = newStyle;
            }
        }
    }

    // ~~

    inlineStyle(
        html
        )
    {
        if ( !this.enableInlineCss )
        {
            return html;
        }

        try
        {
            let document = parseDocument( html );
            let styleElementArray = selectAll( 'style', document );
            let cssRuleArray = this.extractCssRuleArray( styleElementArray );

            this.applyInline( document, cssRuleArray );

            let styleElementCount = styleElementArray.length;

            for ( let styleIndex = 0; styleIndex < styleElementCount; styleIndex++ )
            {
                let style = styleElementArray[ styleIndex ];

                DomUtils.removeElement( style );
            }

            return render( document )
        }
        catch
        {
            return html;
        }
    }

    // ~~

    extractCssRuleArray(
        styleElementArray
        )
    {
        let cssRuleArray = [];
        let ruleRegexPattern = /([^{]+)\s*{\s*([^}]+)\s*}/g;

        for ( let styleElement of styleElementArray )
        {
            let style = DomUtils.textContent( styleElement );
            let match;

            while( ( match = ruleRegexPattern.exec( style ) ) !== null )
            {
                let selectorArray = match[ 1 ].split( ',' ).map( ( selector ) => selector.trim() );
                let property = match[ 2 ].trim();

                for ( let selector of selectorArray )
                {
                    cssRuleArray.push( { selector, property } );
                }
            }
        }

        return cssRuleArray;
    }
}
