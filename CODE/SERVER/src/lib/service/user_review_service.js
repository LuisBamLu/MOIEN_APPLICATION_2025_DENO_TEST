// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'ratedUserProfileId',
        'rating',
        'text',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class UserReviewService
{
    // -- INQUIRIES

    async getUserReviewArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'USER_REVIEW' )
            .select();
        let countQuery = databaseService.getClient()
            .from( 'USER_REVIEW' )
            .select( 'id', { count: 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );
        query = query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] = await Promise.all( [ query, countQuery ] );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                userReviewArray: data,
                userReviewCount: count
            }
            );
    }

    // ~~

    async getUserReviewArrayByRatedUserIdArray(
        ratedUserIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_REVIEW' )
                .select()
                .in( 'ratedUserProfileId', ratedUserIdArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getUserReviewById(
        userReviewId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_REVIEW' )
                .select()
                .eq( 'id', userReviewId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getUserReviewArrayByRatedUserProfileId(
        ratedUserProfileId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_REVIEW' )
                .select()
                .eq( 'ratedUserProfileId', ratedUserProfileId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addUserReview(
        userReview
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_REVIEW' )
                .insert( userReview );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setUserReviewById(
        userReview,
        userReviewId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_REVIEW' )
                .update( userReview )
                .eq( 'id', userReviewId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeUserReviewById(
        userReviewId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_REVIEW' )
                .delete()
                .eq( 'id', userReviewId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let userReviewService
    = new UserReviewService();
