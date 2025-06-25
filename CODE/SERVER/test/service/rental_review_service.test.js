// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'propertyId',
        'rating',
        'cleanlinessRating',
        'communicationRating',
        'checkInRating',
        'accuracyRating',
        'locationRating',
        'valueRating',
        'text',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class RentalReviewService
{
    // -- INQUIRIES

    async getRentalReviewArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'RENTAL_REVIEW' )
            .select();
        let countQuery = databaseService.getClient()
            .from( 'RENTAL_REVIEW' )
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
                rentalReviewArray: data,
                rentalReviewCount: count
            }
            );
    }

    // ~~

    async getRentalReviewById(
        rentalReviewId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_REVIEW' )
                .select()
                .eq( 'id', rentalReviewId );

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

    async getRentalReviewArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_REVIEW' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalReviewArrayByPropertyIdArray(
        propertyIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_REVIEW' )
                .select()
                .in( 'propertyId', propertyIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addRentalReview(
        rentalReview
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_REVIEW' )
                .insert( rentalReview );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setRentalReviewById(
        rentalReview,
        rentalReviewId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_REVIEW' )
                .update( rentalReview )
                .eq( 'id', rentalReviewId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeRentalReviewById(
        rentalReviewId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_REVIEW' )
                .delete()
                .eq( 'id', rentalReviewId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalReviewService
    = new RentalReviewService();
