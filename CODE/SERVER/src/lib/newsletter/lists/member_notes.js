// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get recent notes for a specific list member
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string } [ sortField ] - The field to sort the results by.
 * @param { string } [ sortDir ] - The direction to sort the results.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of items to return.
 * @param { number } [ offset ] - The number of items to skip before starting to collect the result set.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getMemberNoteArray(
    listId,
    subscriberHash,
    sortField,
    sortDir,
    fields,
    excludeFields,
    count,
    offset
    )
{
    try
    {
        let options = {};

        if ( sortField ) options.sortField = sortField;
        if ( sortDir ) options.sortDir = sortDir;
        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( count ) options.count = count;
        if ( offset ) options.offset = offset;

        let response =
            await mailchimp.lists.getListMemberNotes(
                listId,
                subscriberHash,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting member notes: ' + response[ 'detail' ] );
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
 * Add a new note for a specific subscriber.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string } [ note ] - The content of the note.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addMemberNote(
    listId,
    subscriberHash,
    note
    )
{
    try
    {
        let options = {};

        if ( note )
        {
            note = note.length >= 1000
                ? note.substring( 0, 1000 )
                : note;

            options.note = note
        }

        let response =
            await mailchimp.lists.createListMemberNote(
                listId,
                subscriberHash,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error(
                '' + response[ 'detail' ]
                );
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
 * Get a specific note for a specific list member.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string } noteId - The unique identifier for the note.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getMemberNote(
    listId,
    subscriberHash,
    noteId,
    fields,
    excludeFields
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;

        let response =
            await mailchimp.lists.getListMemberNote(
                listId,
                subscriberHash,
                noteId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting member note: ' + response[ 'detail' ] );
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
 * Update a specific note for a specific list member.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string } noteId - The unique identifier for the note.
 * @param { string } [ note ] - The content of the note.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function UpdateMemberNote(
    listId,
    subscriberHash,
    noteId,
    note
    )
{
    try
    {
        let options = {};

        if ( note )
        {
            note = note.length >= 1000
                ? note.substring( 0, 1000 )
                : note;

            options.note = note
        }

        let response =
            await mailchimp.lists.updateListMemberNote(
                listId,
                subscriberHash,
                noteId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating member note: ' + response[ 'detail' ] );
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
 * Delete a specific note for a specific list member.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string } noteId - The unique identifier for the note.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function deleteMemberNote(
    listId,
    subscriberHash,
    noteId
    )
{
    try
    {
        let response =
            await mailchimp.lists.deleteListMemberNote(
                listId,
                subscriberHash,
                noteId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting member note: ' + response[ 'detail' ] );
        }
        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}
