// -- IMPORTS

import { AppError } from '../../../app_error';
import { emailTemplateService } from '../../../service/email_template_service';

// -- FUNCTIONS

async function getEmailTemplateById(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let id = request.params.id;

        return reply.send(
            {
                emailTemplate : await emailTemplateService.getEmailTemplateById( id )
            }
            );
    }
    catch ( error )
    {
        throw new AppError( error.message );
    }
}

// ~~

async function getEmailTemplate(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        return reply.send(
            {
                emailTemplateArray : await emailTemplateService.getCachedEmailTemplateArray()
            }
            );
    }
    catch ( error )
    {
        throw new AppError( error.message );
    }
}

// ~~

async function updateEmailTemplate(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let body = JSON.parse( request.body );
        let templateEmail = body.template;
        let templateEmailId = request.params.id;

        return reply.send(
            {
                emailTemplate : await emailTemplateService.setTemplateById(
                    templateEmail,
                    templateEmailId
                    )
            }
            );
    }
    catch ( error )
    {
        throw new AppError( error.message );
    }
}

export
{
    getEmailTemplateById,
    getEmailTemplate,
    updateEmailTemplate
}
