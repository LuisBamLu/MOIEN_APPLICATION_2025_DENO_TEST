// -- IMPORTS

import { documentService } from '../../../service/document_service';
import { profileService } from '../../../service/profile_service';
import { languageService } from '../../../service/language_service';
import { countryService } from '../../../service/country_service';
import { validationStatusService } from '../../../service/validation_status_service';
import { getJsonObject, isArray } from 'senselogic-gist';
import { documentTypeService } from '../../../service/document_type_service';
import { hasUserPermission, isNullOrUndefined } from '../../../base';
import { AppError } from '../../../utils/app_error';

// -- FUNCTIONS

async function getDocumentManagerData(
    request,
    reply
)
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-message-error', 401 );
    }

    let hasListDocumentPermission = await hasUserPermission( 'list-document', profile.roleSlugArray );

    if ( !hasListDocumentPermission )
    {
        throw new AppError( 'unauthorized-message-error', 403 );
    }

    let documentMap =
        {
            documentArray: [],
            hasMorePage: false
        };

    let { documentIdArray, page, limit } = getJsonObject( request.body );
    let isDocumentIdArrayValid = isArray( documentIdArray ) && documentIdArray.length > 0;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;

    let { documentArray, countDocumentArray } =
        await documentService.getDocumentArray(
            isDocumentIdArrayValid || [],
            page,
            limit,
            filterArray
            );

    documentMap.documentArray = documentArray;
    let pageCount = Math.ceil( countDocumentArray / limit );
    documentMap.hasMorePage = page < pageCount;
    let userArray = await profileService.getProfileArrayByUserIdArray(
        documentMap.documentArray.map( document => document.userId )
        );
    let [ languageArray, countryArray, validationStatusArray, documentTypeArray ] =
        await Promise.all(
            [
                languageService.getCachedLanguageArray(),
                countryService.getCachedCountryArray(),
                validationStatusService.getCachedValidationStatusArray(),
                documentTypeService.getCachedDocumentTypeArray()
            ]
            );

    let optionMap =
    {
        languageArray,
        countryArray,
        validationStatusArray,
        documentTypeArray
    };

    return reply.send(
        {
            ...documentMap,
            userArray,
            optionMap
        }
        );
}

export
{
    getDocumentManagerData
}
