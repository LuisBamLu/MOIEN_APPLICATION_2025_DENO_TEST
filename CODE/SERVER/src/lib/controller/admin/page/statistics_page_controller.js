// -- IMPORTS

import { analyticsService } from '../../../service/analytics_service';
import { statisticsService } from '../../../service/statistcs_service';

// -- CONSTANTS

const monthsInYear = 12;
const halfDaysInMonth = 15;
const daysInWeek = 7;
const hoursInDay = 24;
const rangeArray =
[
    monthsInYear,
    halfDaysInMonth,
    daysInWeek,
    hoursInDay,
]
const rangeKeyArray =
[
    'byYear',
    'byMonth',
    'byWeek',
    'byDay'
];

// -- FUNCTIONS

function createArrayOfTimeRangeArray(
    )
{
    let result =
    [
        [ new Date ( Date.now() ) ],
        [ new Date ( Date.now() ) ],
        [ new Date ( Date.now() ) ],
        [ new Date ( Date.now() ) ]
    ];

    for ( let range = 0; range < rangeArray.length; range++ )
    {
        for ( let part = 1; part <= rangeArray[ range ]; part++ )
        {
            if ( range === 0 )
            {
                result[ range ].push( new Date( Date.now() -  part * 30 * 24 * 60 * 60 * 1000 ) );
            }
            else if ( range === 1 )
            {
                result[ range ].push( new Date( Date.now() -  part * 2 * 24 * 60 * 60 * 1000 ) );
            }
            else if ( range === 2 )
            {
                result[ range ].push( new Date( Date.now() -  part * 24 * 60 * 60 * 1000 ) );
            }
            else
            {
                result[ range ].push( new Date( Date.now() -  part * 60 * 60 * 1000 ) );
            }
        }
    }
    return result;
}

// ~~

function processViews(
    dataKey
    )
{
    for ( let view of Object.keys( dataKey ) )
    {
        dataKey[ view ] = dataKey[ view ].length
    }
}

// ~~

function processDataArray(
    dataKey
    )
{
    dataKey[ 'data' ] = Object.values( dataKey ).map( view => view ?? 0 );
}

// ~~

function processNewReservations(
    data,
    key
    )
{
    let reservationData = data[ key ];

    for ( let rentalMode of [ 'shortTerm', 'longTerm' ] )
    {
        processViews( reservationData[ rentalMode ] );
        processDataArray( reservationData[ rentalMode ] );
    }

    let dataArray = [ [], [], [], [] ];

    for ( let rentalMode of Object.keys(reservationData ) )
    {
        dataArray[ 0 ].push( reservationData[ rentalMode ].byYear );
        dataArray[ 1 ].push( reservationData[ rentalMode ].byMonth );
        dataArray[ 2 ].push( reservationData[ rentalMode ].byWeek );
        dataArray[ 3 ].push( reservationData[ rentalMode ].byDay );
    }

    reservationData[ 'data' ] = dataArray;
}

// ~~

function getNumberOfPart(
    data,
    key,
    range,
    part,
    timeRangeArray
    )
{
    let result = data.filter(
        item =>
        {
            let itemDate = new Date( item[ key ] );
            let startDate = timeRangeArray[ range ][ part ];
            let endDate = timeRangeArray[ range ][ part + 1 ];
            return itemDate <= startDate && itemDate > endDate;
        }
        );

    return result.length ?? 0;
}

// ~~

function divideByParts(
    data,
    parts,
    timeRangeArray
    )
{
    let result = Array( parts ).fill( 0 );

    for ( let i = 0; i < parts; i++ )
    {
        result[ i ] = getNumberOfPart( data, 'creationTimestamp', rangeArray.indexOf( parts ), i, timeRangeArray );
    }

    return result;
}

// ~~

function getAllParts(
    data,
    timeRangeArray,
    sum = false
    )
{
    let result = [];

    for ( let i = 0; i < rangeArray.length; i++ )
    {
        result.push(
            divideByParts( data[ rangeKeyArray[ i ] ], rangeArray[ i ], timeRangeArray )
            );
    }

    data[ 'data' ] =
    [
        result[ 0 ].reverse(),
        result[ 1 ].reverse(),
        result[ 2 ].reverse(),
        result[ 3 ].reverse()
    ];

    if ( sum )
    {
        data[ 'data' ] = data[ 'data' ].map(
            ( result ) =>
            {
                return result.reduce(
                    ( accumalator, current, index ) =>
                    {
                        if (index === 0)
                        {
                            accumalator.push( current );
                        }
                        else
                        {
                            accumalator.push( current + accumalator[ index - 1 ] );
                        }

                        return accumalator;
                    },
                    []
                    );
            }
            );
    }

    return data;
}

// ~~

function processStatisticsData(
    data,
    timeRangeArray
    )
{
    for ( let key of Object.keys( data ) )
    {
        if ( key === 'newReservations' )
        {
            processNewReservations( data, key );
        }
        else if ( key === 'currentBookings' )
        {
            processViews( data[ key ] );
            processDataArray( data[ key ] );
        }
        else if ( key === 'totalUsers' )
        {
            data[ key ] = getAllParts( data[ key ], timeRangeArray, true );
        }
        else if ( key === 'turnover' )
        {
            data[ key ] = getAllParts( data[ key ], timeRangeArray, true );
        }
        else if ( data[ key ] !== undefined  )
        {
            data[ key ] = getAllParts( data[ key ], timeRangeArray );
        }
    }

    return data;
}

// -- FUNCTIONS

async function getStaticsPage(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    try
    {
        let timeRangeArray = createArrayOfTimeRangeArray();

        let [ currentBookings, adView, turnoverAdView, totalUsers, newUsers, newAds, numberOfViews, newReservations ] =
            await Promise.all(
                [
                    statisticsService.getCurrentBookings(),
                    analyticsService.getPropertyViewReport(),
                    analyticsService.getPropertyPurchaseReport(),
                    statisticsService.getTotalUsers(),
                    statisticsService.getNewUsers(),
                    statisticsService.getNewAds(),
                    statisticsService.getNewAdsAccess(),
                    statisticsService.getNewReservations()
                ]
            );

        let response = processStatisticsData(
            {
                currentBookings,
                totalUsers,
                newUsers,
                newAds,
                numberOfViews,
                newReservations
            },
            timeRangeArray
            );

        return reply.status( 200 ).send(
            {
                ...response,
                adView,
                turnoverAdView
            }
            );
    }
    catch ( error )
    {
        return reply
            .status( 500 )
            .send( error );
    }
}

export
{
    getStaticsPage
}
