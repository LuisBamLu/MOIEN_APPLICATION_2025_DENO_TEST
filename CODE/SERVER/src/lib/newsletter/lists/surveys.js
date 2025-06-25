// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get all surveys for a list.
 *
 * @param { string } listId - The unique identifier for the list.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListSurveyArray(
    listId
    )
{
    try
    {
        let response =
            await mailchimp.lists.getAllSurveysForList(
                listId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error returning list surveys:' + response[ 'detail' ] );
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
 * Get a specific survey for a list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } surveyId - The unique identifier for the survey.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListSurvey(
    listId,
    surveyId
    )
{
    try
    {
        let response =
            await mailchimp.lists.getSurvey(
                listId,
                surveyId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error returning list survey:' + response[ 'detail' ] );
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
 * Publish a survey that is in draft, unpublished, or has been previously published and edited.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } surveyId - The unique identifier for the survey.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addListSurvey(
    listId,
    surveyId
    )
{
    try
    {
        let response =
            await mailchimp.lists.publishSurvey(
                listId,
                surveyId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding list survey:' + response[ 'detail' ] );
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
 * Unpublish a survey that has been published.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } surveyId - The unique identifier for the survey.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function removeListSurvey(
    listId,
    surveyId
    )
{
    try
    {
        let response =
            await mailchimp.lists.unpublishSurvey(
                listId,
                surveyId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error removing list survey:' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}
