// -- IMPORTS

import { TemplateEngine } from '../fileUtils/template_engine';

// -- TYPES

export class NotificationStrategy
{
    // -- OPERATIONS

    send(
        template,
        variableMap
        )
    {
        throw new Error( 'This method should be overridden by subclasses' );
    }

    // ~~

    async schedule(
        template,
        variableMap,
        sendAtTimestamp
        )
    {
        throw new Error( 'This method should be overridden by subclasses' );
    }

    // ~~

    fillTemplate(
        template,
        variableMap = {},
        enableInlineCss = false
        )
    {
        let languageTag =
            variableMap.profile
            ? variableMap.profile.languageTag
            : variableMap.betaUser.languageCode;

        let templateEngine = new TemplateEngine(
            template,
            variableMap,
            languageTag,
            enableInlineCss
            );

        return templateEngine.render();
    }
}
