// -- IMPORTS

import { languageService } from '../../service/language_service';
import { textService } from '../../service/text_service';
import { getCacheData, setCacheData, startCacheCheckInterval } from '../../utils/cache';

// -- CONSTANTS

const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
const fiveMinutesInMilliseconds = 1000 * 60 * 5;

// -- VARIABLES

let cache =
    {
        data: {},
        timestamp: null
    }

// -- STATEMENTS

startCacheCheckInterval( cache, oneDayInMilliseconds, fiveMinutesInMilliseconds );

// -- FUNCTIONS

export async function getClientAppData(
    request,
    reply
    )
{
    let cachedData = getCacheData( cache, oneDayInMilliseconds );

    if ( cachedData )
    {
        return reply
            .status( 200 )
            .send( cachedData );
    }

    let [ textArray, languageArray ]
        = await Promise.all(
            [
                textService.getCachedTextArrayOptimized(),
                languageService.getCachedLanguageArray()
            ]
            );
    let languageTagArray = languageArray.map( language => language.code );

    let responseData =
        {
            textArray,
            languageArray,
            languageTagArray
        };

    setCacheData( cache, responseData );

    return reply.status( 200 ).send( responseData );
}
