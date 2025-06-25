// -- IMPORTS

import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';
import { rentalCostService } from '../../../service/rental_cost_service';
import { rentalCostTypeService } from '../../../service/rental_cost_type_service';
import { rentalCostFrequencyService } from '../../../service/rental_cost_frequency_service';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { currencyService } from '../../../service/currency_service';
import { getJsonObject, getRandomTuid } from 'senselogic-gist';
import { AppError } from '../../../app_error';

// -- FUNCTIONS

async function getRentalCostData(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { page = 1, limit = 15 } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;

    let { rentalCostArray, totalCount } = await rentalCostService.getRentalCostArray(
        page,
        limit,
        filterArray
        );

    let [ userIdArray, propertyIdArray ] =
        [ 'userId', 'propertyId' ].map( key => getUniqueValues( rentalCostArray, key ) );

    let [
        profileArray,
        propertyArray,
        rentalCostTypeArray,
        rentalCostFrequencyArray,
        currencyArray
        ] =
        await Promise.all(
            [
                profileService.getProfileArrayByUserIdArray( userIdArray ),
                propertyService.getPropertyArrayByIdArray( propertyIdArray ),
                rentalCostTypeService.getRentalCostTypeArray(),
                rentalCostFrequencyService.getRentalCostFrequencyArray(),
                currencyService.getCachedCurrencyArray()
            ]
            );

    let { hasMorePage } = getHasMorePage( totalCount, page, limit );

    return reply.status( 200 ).send(
        {
            rentalCostArray,
            profileArray,
            propertyArray,
            rentalCostTypeArray,
            rentalCostFrequencyArray,
            currencyArray,
            getHasMorePage
        }
        );
}

// ~~

async function getRentalCost(
    request,
    reply
    )
{
    let rentalCostId = request.params.id;
    let rentalCost = await rentalCostService.getRentalCostById( rentalCostId );
    let [
            property,
            guestProfile,
        ] = await Promise.all(
            [
                propertyService.getPropertyById( rentalCost.propertyId ),
                profileService.getProfileByUserId( rentalCost.userId ),
            ]
            );

    let hostProfile = await profileService.getProfileByUserId( property.userId );

    return reply
        .status( 200 )
        .send(
            {
                rentalCost,
                property,
                guestProfile,
                hostProfile
            }
            );
}

// ~~

async function setRentalCostById(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = getJsonObject( request.body );
    let { rentalCostId } = request.params;
    let { rentalCost } = body;

    if ( !body || !rentalCostId || !rentalCost )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetRentalCostPermission = await hasUserPermission( 'set-rental-cost', profile.roleSlugArray );

    if ( !hasSetRentalCostPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await rentalCostService.setRentalCostById(
        {
            propertyId: rentalCost.propertyId,
            typeId: rentalCost.typeId,
            frequencyId: rentalCost.frequencyId,
            name: rentalCost.name,
            amount: rentalCost.amount,
            currencyCode: rentalCost.currencyCode,
            userId: rentalCost.userId
        },
        rentalCostId
        );

    return reply.send( { message: 'rental-cost-updated-message' } );
}

// ~~

async function addRentalCost(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = getJsonObject( request.body );
    let { rentalCost } = body;

    if ( !body || !rentalCost )
    {
        throw new AppError( 'bad-request' );
    }

    if ( rentalCost.userId === undefined || rentalCost.userId === null )
    {
        throw new AppError( 'user-id-is-required' );
    }

    if ( rentalCost.propertyId === undefined || rentalCost.propertyId === null )
        {
            throw new AppError( 'property-id-is-required' );
        }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddRentalCostPermission = await hasUserPermission( 'add-rental-cost', profile.roleSlugArray );

    if ( !hasAddRentalCostPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let newRentalCost = await rentalCostService.addRentalCost(
        {
            id: getRandomTuid(),
            propertyId: rentalCost.propertyId,
            typeId: rentalCost.typeId,
            frequencyId: rentalCost.frequencyId,
            name: rentalCost.name,
            amount: rentalCost.amount,
            currencyCode: rentalCost.currencyCode,
            userId: rentalCost.userId
        }
        );

    return reply.send( { message: 'rental-cost-created-message', rentalCost: newRentalCost } );
}

// ~~

export {
    getRentalCostData,
    getRentalCost,
    setRentalCostById,
    addRentalCost
    };
