// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the array of signup forms from a list.
 *
 * @param { string } listId - The unique identifier for the list.
 *
 * @returns { Promise<Object> } - Mailchimp response
 */
export async function getListSignupFormArray(
    listId,
    )
{
    try
    {
        let response =
            await mailchimp.lists.getListSignupForms(
                listId,
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting sign up form array:' + response[ 'detail' ] );
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
 * Customize a list's default signup form.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { Object } [ header ] - The header for the signup form.
 * @param { Object[] } [ contents ] - The contents of the signup form.
 * @param { string } [ contents.section ] - The section of the signup form.
 * @param { string } [ contents.value ] - The value of the signup form.
 * @param { Object[] } [ styles ] - The styles for the signup form.
 * @param { string } [ styles.selector ] - The selector for the signup form.
 * @param { Object[] } [ styles.options ] - The options for the signup form.
 * @param { string } [ styles.options.property ] - The property for the signup form.
 * @param { string } [ styles.options.value ] - The value for the signup form.
 *
 * @returns { Promise<Object> } - Mailchimp response
 */
export async function updateListSignupForm(
    listId,
    header,
    contents,
    styles
    )
{
    try
    {
        let body = {};

        if ( header !== undefined ) body.header = header;
        if ( contents !== undefined ) body.contents = contents;
        if ( styles !== undefined ) body.styles = styles;

        let response =
            await mailchimp.lists.updateListSignupForm(
                listId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating sign up form:' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}
