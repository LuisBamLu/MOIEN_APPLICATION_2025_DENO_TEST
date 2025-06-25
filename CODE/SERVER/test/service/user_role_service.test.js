// -- IMPORTS

import { isArray, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { profileService } from './profile_service';

// -- TYPES

class UserRoleService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedUserRoleArray = null;
        this.cachedUserPermissionArrayByRoleArrayMap = null;
        this.cachedUserRoleTimestamp = 0;
        this.cachedUserPermissionArrayByRoleTimestamp = 0;
    }

    // -- INQUIRIES

    async getUserRoleArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_ROLE' )
                .select()
                .order( 'number', { ascending: true } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getUserRoleById(
        userRoleId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_ROLE' )
                .select()
                .eq( 'id', userRoleId );

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

    async getPermissionSlugArrayFromRoleSlugArray(
        roleSlugArray
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'USER_ROLE' )
            .select( 'permissionSlugArray' )
            .in( 'slug', roleSlugArray );

        if ( error !== null )
        {
            logError( error );
        }

        if ( !isArray( data ) )
        {
            data = [];
        }

        let permissionSlugArray = data.flatMap( ( role ) => role.permissionSlugArray );

        return permissionSlugArray;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedUserRoleArray = null;
        this.cachedUserPermissionArrayByRoleArrayMap = null;
        this.cachedUserRoleTimestamp = 0;
        this.cachedUserPermissionArrayByRoleTimestamp = 0;
    }

    // ~~

    async getCachedUserRoleArray(
        )
    {
        if ( this.cachedUserRoleArray === null
             || Date.now() > this.cachedUserRoleTimestamp + 300000 )
        {
            this.cachedUserRoleArray = await this.getUserRoleArray();
            this.cachedUserRoleTimestamp = Date.now()
        }

        return this.cachedUserRoleArray;
    }

    // ~~

    async getCachedPermissionSlugArrayFromRoleSlugArray(
        roleSlugArray
        )
    {
        if ( this.cachedUserPermissionArrayByRoleArrayMap === null
             || Date.now() > this.cachedUserPermissionArrayByRoleTimestamp + 300000 )
        {
            this.cachedUserPermissionArrayByRoleArrayMap = new Map();
            this.cachedUserPermissionArrayByRoleTimestamp = Date.now();
        }

        let slug = roleSlugArray.join( '-' );

        let hasCachedPermission = this.cachedUserPermissionArrayByRoleArrayMap.has( slug );

        if ( !hasCachedPermission )
        {
            let permissionSlugArray = await this.getPermissionSlugArrayFromRoleSlugArray( roleSlugArray );

            this.cachedUserPermissionArrayByRoleArrayMap.set( slug, permissionSlugArray );
        }

        return this.cachedUserPermissionArrayByRoleArrayMap.get( slug );
    }

    // ~~

    async setUserRoleById(
        userRoleId,
        userRole
        )
    {
        this.clearCache();
        profileService.clearCache();

        let { data, error } = await databaseService.getClient()
            .from( 'USER_ROLE' )
            .update( userRole )
            .eq( 'id', userRoleId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeUserRoleById(
        userRoleId
        )
    {
        this.clearCache();

        let { data, error } = await databaseService.getClient()
           .from( 'USER_ROLE' )
           .delete()
           .eq( 'id', userRoleId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async addUserRole(
        userRole
        )
    {
        this.clearCache();

        let { data, error } = await databaseService.getClient()
           .from( 'USER_ROLE' )
           .insert( userRole );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let userRoleService
    = new UserRoleService();
