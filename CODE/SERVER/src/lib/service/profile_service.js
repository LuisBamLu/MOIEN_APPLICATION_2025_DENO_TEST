// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery, getPaginationIndexMap, isValidUuid } from '../base';

// -- CONSTANTS

const tenMinutesInMilliseconds = 1000 * 60 * 10;
const filterableColumnNameArray =
    [
        'id',
        'userId',
        'roleSlugArray',
        'statusId',
        'genderId',
        'firstName',
        'lastName',
        'aboutDescription',
        'email',
        'phonePrefix',
        'phoneNumber',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class ProfileService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedProfileByUserIdMap = {};
        this.cachedProfileByUserIdMapTimestamp = 0;
    }

    // -- INQUIRIES

    async getProfileArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSimplifiedProfileArray(
        searchTerm = ''
    )
    {
        let query = databaseService.getClient()
            .from( 'PROFILE' )
            .select( 'id, firstName, lastName, email, userId' );

        if ( searchTerm.trim() !== '' )
        {
            const cleanedSearchTerm = searchTerm.replace( /\s+/g, '' );

            if ( isValidUuid( cleanedSearchTerm ) )
            {
                query =
                    query
                    .or( `userId.eq.${ cleanedSearchTerm }` );
            }
            else
            {
                query =
                    query
                    .or( `firstName.ilike.%${ cleanedSearchTerm }%,`
                        + `lastName.ilike.%${ cleanedSearchTerm }%,`
                        + `email.ilike.%${ cleanedSearchTerm }%` );
            }
        }

        let { data, error } = await query;

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getAssignees(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .select( 'id, firstName, lastName, email, imagePath, roleSlugArray, userId' );

        if ( error !== null )
        {
            console.log( error );
        }

        return data;
    }

    // ~~

    async getRoleSlugArrayByUserId(
        userId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PROFILE' )
            .select( 'roleSlugArray' )
            .eq( 'userId', userId )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getProfileArrayWithPagination(
        page = 1,
        limit = 10,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'PROFILE' )
            .select( '*' );
        let countQuery = databaseService.getClient()
            .from( 'PROFILE' )
            .select( 'id', { count : 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );
        query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] = await Promise.all( [ query, countQuery ] );

        if ( error !== null )
        {
            logError( error );

            return (
                {
                    profileArray : [],
                    totalCount : 0
                }
                );
        }

        return (
            {
                profileArray : data,
                totalCount : count
            }
            );
    }

    // ~~

    async getProfileArrayByUserIdArray(
        userIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .select()
                .in( 'userId', userIdArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getProfileById(
        profileId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .select()
                .eq( 'id', profileId );

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

    async getProfileByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .select()
                .eq( 'userId', userId );

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

    async getProfileByPhonePrefixAndPhoneNumber(
        phonePrefix,
        phoneNumber
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .select()
                .eq( 'phoneNumber', phoneNumber )
                .eq( 'phonePrefix', phonePrefix );

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

    async getProfileByEmail(
        email
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .select()
                .eq( 'email', email );

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

    // -- OPERATIONS

    async addProfile(
        profile
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .insert( profile )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        let _profile = data[ 0 ];
        this.cachedProfileByUserIdMap[ _profile.userId ] = _profile;

        return data;
    }

    // ~~

    async verifyProfileEmail(
        email,
        userId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'PROFILE' )
                .update(
                    {
                        userId: userId,
                        emailValidationStatusId: 'verified'
                    }
                    )
                .eq( 'email', email )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        let _profile = data[ 0 ];
        this.cachedProfileByUserIdMap[ userId ] = _profile;

        return data;
    }

    // ~~

    async setProfileById(
        profile,
        profileId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .update( profile )
                .eq( 'id', profileId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        let _profile = data[ 0 ];
        this.cachedProfileByUserIdMap[ _profile.userId ] = _profile;

        return data[ 0 ];
    }

    // ~~

    async setProfileByUserId(
        profile,
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .update( { ...profile } )
                .eq( 'userId', userId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        let _profile = data[ 0 ];
        this.cachedProfileByUserIdMap[ userId ] = _profile;

        return data[ 0 ];
    }

    // ~~

    async setProfileGovermentIdByUserId(
        governmentId,
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .update( { governmentId } )
                .eq( 'userId', userId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        let _profile = data[ 0 ];
        this.cachedProfileByUserIdMap[ userId ] = _profile;

        return data[ 0 ];
    }

    // ~~

    async setProfileGovernmentIdValidationStatusIdByUserId(
        governmentIdValidationStatusId,
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .update( { governmentIdValidationStatusId } )
                .eq( 'userId', userId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        let _profile = data[ 0 ];
        this.cachedProfileByUserIdMap[ userId ] = _profile;

        return data[ 0 ];
    }

    // ~~

    async removeProfileById(
        profileId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROFILE' )
                .delete()
                .eq( 'id', profileId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCachedProfileByUserId(
        userId
        )
    {
        if ( !this.cachedProfileByUserIdMap[ userId ] )
        {
            let profile = await this.getProfileByUserId( userId );
            this.cachedProfileByUserIdMap[ userId ] = profile;
        }

        return this.cachedProfileByUserIdMap[ userId ];
    }

    // ~~

    clearCache(
        )
    {
        this.cachedProfileByUserIdMap = {};
        this.cachedProfileByUserIdMapTimestamp = 0;
    }
}

// -- VARIABLES

export let profileService
    = new ProfileService();
