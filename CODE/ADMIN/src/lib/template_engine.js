// -- IMPORTS

import { getLocalizedText } from 'senselogic-gist';

export class TemplateEngine
{
    // -- CONSTRUCTORS

    constructor(
        templateString,
        variableMap,
        languageTag = 'en'
        )
    {
        this.templateString = templateString;
        this.variableMap = variableMap;
        this.languageTag = languageTag;
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
            });

            return templateString.replace(
                /\{\{#if ([^{}]+)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g,
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
}
