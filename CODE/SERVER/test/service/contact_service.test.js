// -- IMPORTS

import { NotificationFactory } from '../notification/notification_factory';

// -- TYPES

class ContactService
{
    // -- CONTRUCTORS

    constructor(
        )
    {
        this.emailStrategy = NotificationFactory.createStrategy( 'email' );
    }

    // -- OPERATIONS

    async sendContactEmail(
        profileLogged,
        body,
        reply
        )
    {
        let profile = {}

        try
        {
            let user = body.name.value;
            let email = body.email.value;
            let message = body.message.value;
            let languageTag = body.languageTag.value;

            if( !profileLogged || !profileLogged.languageTag )
            {
                profile.languageTag = languageTag;
            }
            else
            {
                profile = profileLogged;
            }

            let template =
                {
                    subject: `New Contact submission from {{name}}`,
                    content: `<h3>Contact form submission from {{name}}</h3>`
                        + `<p><strong>Name:</strong> {{name}}</p>`
                        + `<p><strong>Email:</strong> {{email}}</p>`
                        + `<p><strong>Message:</strong> {{message}}</p>`,
                    recipient: 'contact@moien.com'
                };

            let userTemplate =
                {
                    subject: `Thank you for contacting us, {{name}}`,
                    content: `<h3>Thank you for contacting us</h3>`
                        + `<p><strong>Your contact form:</strong></p>`
                        + `<p><strong>Name:</strong> {{name}}</p>`
                        + `<p><strong>Email:</strong> {{email}}</p>`
                        + `<p><strong>Message:</strong> {{message}}</p>`,
                    recipient: email
                };

            let variableMap =
                {
                    name: user,
                    email,
                    message,
                    profile
                };

            let
                [
                    userResult,
                    adminResult
                ] = await Promise.all(
                    [
                        this.emailStrategy.send(
                            userTemplate,
                            variableMap
                            ),
                        this.emailStrategy.send(
                            template,
                            variableMap
                            )
                    ]
                    );

            return (
                {
                    success: true,
                    userResult,
                    adminResult
                }
                );
        }
        catch ( error )
        {
            console.log(error);

            return (
                {
                    success: false,
                    error
                }
                );
        }
    }
}

// -- VARIABLES

export let contactService =
    new ContactService();
