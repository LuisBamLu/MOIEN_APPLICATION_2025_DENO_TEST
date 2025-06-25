// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';
import * as defaultContent from './templates/default_content';

// -- FUNCTIONS

/**
 * Gets information about all templates.
 *
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 * @param { string } [ createdBy ] - The email address of the user who created the template.
 * @param { string } [ sinceDateCreated ] - Restrict the response to templates created after the set date.
 * @param { string } [ beforeDateCreated ] - Restrict the response to templates created before the set date.
 * @param { string } [ type ] - The type of template.
 * @param { string } [ category ] - The category for the template.
 * @param { string } [ folderId ] - The unique identifier for the folder.
 * @param { string } [ sortField ] - The field to sort the results by.
 * @param { string } [ sortDir ] - The direction to sort the results. [ 'ASC', 'DESC' ]
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getTemplateArray(
    fields,
    excludeFields,
    count,
    offset,
    createdBy,
    sinceDateCreated,
    beforeDateCreated,
    type,
    category,
    folderId,
    sortField,
    sortDir
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( createdBy !== undefined ) options.createdBy = createdBy;
        if ( sinceDateCreated !== undefined ) options.sinceDateCreated = sinceDateCreated;
        if ( beforeDateCreated !== undefined ) options.beforeDateCreated = beforeDateCreated;
        if ( type !== undefined ) options.type = type;
        if ( category !== undefined ) options.category = category;
        if ( folderId !== undefined ) options.folderId = folderId;
        if ( sortField !== undefined ) options.sortField = sortField;
        if ( sortDir !== undefined ) options.sortDir = sortDir;

        let response =
            await mailchimp.templates.list(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting template array: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 * Adds a new template.
 *
 * @param { string } name - The name of the template.
 * @param { string } html - The HTML code for the template.
 * @param { string } [ folderId ] - The unique identifier for the folder.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addTemplate(
    name,
    html,
    folderId
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;
        if ( html !== undefined ) body.html = html;
        if ( folderId !== undefined ) body.folderId = folderId;

        let response =
            await mailchimp.templates.create(
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding template: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 * Gets information about a specific template.
 *
 * @param { string } templateId - The unique identifier for the template.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getTemplate(
    templateId,
    fields,
    excludeFields
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;

        let response =
            await mailchimp.templates.getTemplate(
                templateId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting template: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 * Updates a template
 *
 * @param { string } templateId - The unique identifier for the template.
 * @param { string } name - The name of the template.
 * @param { string } html - The HTML code for the template.
 * @param { string } [ folderId ] - The unique identifier for the folder.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateTemplate(
    templateId,
    name,
    html,
    folderId
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;
        if ( html !== undefined ) body.html = html;
        if ( folderId !== undefined ) body.folderId = folderId;

        let response =
            await mailchimp.templates.updateTemplate(
                templateId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating template: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 * Deletes a template.
 *
 * @param { string } templateId - The unique identifier for the template.
 *
 * @returns {}
 */
export async function deleteTemplate(
    templateId
    )
{
    try
    {
        let response =
            await mailchimp.templates.deleteTemplate(
                templateId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting template: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// -- STATEMENTS

export { defaultContent };
