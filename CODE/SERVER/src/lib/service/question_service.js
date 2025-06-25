// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class QuestionService
{
    // -- INQUIRIES

    async getQuestionArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'QUESTION' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getQuestionArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'QUESTION' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addQuestion(
        question
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'QUESTION' )
                .insert( question );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async updateQuestionById(
        questionId,
        question
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'QUESTION' )
                .update( question )
                .eq( 'id', questionId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let questionService
    = new QuestionService();
