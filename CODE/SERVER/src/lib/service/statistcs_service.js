// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- CONSTANTS

const daysInYear = 365;
const daysInMonth = 30;
const daysInWeek = 7;

// -- FUNCTIONS

function getPastDay(
    days
    )
{
    return new Date( Date.now() - days * 24 * 60 * 60 * 1000 ).toISOString();
}

// ~~

function getResultByOperation(
    x,
    y,
    operation
    )
{
    switch ( operation )
    {
        case 'gt':
            return x > y;
        case 'gte':
            return x >= y;
        case 'lt':
            return x < y;
        case 'lte':
            return x <= y;
        default:
            return false;
    }
}

// ~~

function getResponseByPastDays(
    data,
    key,
    operation
    )
{
    let byYear = data.filter(
        item => getResultByOperation( item[ key ], getPastDay( daysInYear ), operation )
        );
    let byMonth = data.filter(
        item => getResultByOperation( item[ key ], getPastDay( daysInMonth ), operation )
        );
    let byWeek = data.filter(
        item => getResultByOperation( item[ key ], getPastDay( daysInWeek ), operation )
        );
    let byDay = data.filter(
        item => getResultByOperation( item[ key ], getPastDay( 1 ), operation )
        );

    return { byYear, byMonth, byWeek, byDay };
}

// -- TYPES

class StatisticsService
{
    // -- INQUIRIES

    async getCurrentBookings(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()

        data = data.map(
            booking =>
            {
                booking.arrival = new Date( booking.arrivalDate );
                booking.departure = new Date( booking.departureDate );
                return booking;
            }
            );

        data = data.filter(
            booking => booking.arrival.getTime() <= Date.now() && booking.departure.getTime() > Date.now()
            );

        if ( error !== null )
        {
            logError( error );
        }

        let response =
        {
            shortTerm: data.filter( booking => booking.dayCount <= 90 ),
            longTerm: data.filter( booking => booking.dayCount > 90 )
        }

        return response;
    }

    // ~~

    async getTurnover(
        )
    {
        // TODO
    }

    // ~~

    async getTotalUsers(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .select()

        if ( error !== null )
        {
            logError( error );
        }

        let response = getResponseByPastDays( data, 'creationTimestamp', 'gt' );

        return response;
    }

    // ~~

    async getNewUsers(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .select()

        if ( error !== null )
        {
            logError( error );
        }

        let response = getResponseByPastDays( data, 'creationTimestamp', 'gt' );

        return response;
    }

    // ~~

    async getNewAds(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY' )
                .select()

        if ( error !== null )
        {
            logError( error );
        }

        let response = getResponseByPastDays( data, 'creationTimestamp', 'gt' );

        return response;
    }

    // ~~

    async getNewAdsAccess(
        )
    {
        // TODO
    }

    // ~~

    async getNewReservations(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()

        if ( error !== null )
        {
            logError( error );
        }

        let response =
        {
            shortTerm: data.filter( booking => booking.dayCount <= 90 ),
            longTerm: data.filter( booking => booking.dayCount > 90 )
        }

        response.shortTerm = getResponseByPastDays( response.shortTerm, 'creationTimestamp', 'gt' );
        response.longTerm = getResponseByPastDays( response.longTerm, 'creationTimestamp', 'gt' );

        return response;
    }
}

// -- VARIABLES

export let statisticsService = new StatisticsService();
