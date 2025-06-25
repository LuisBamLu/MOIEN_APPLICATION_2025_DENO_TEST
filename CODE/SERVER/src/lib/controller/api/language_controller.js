// -- IMPORTS

import { languageService } from '../../service/language_service';

// -- FUNCTIONS

export async function getLanguage(
    request,
    reply
    )
{
    let languageArray = await languageService.getCachedLanguageArray();
    let languageTagArray = languageArray.map( language => language.code );

    return (
        {
            languageArray,
            languageTagArray
        }
        );
}
