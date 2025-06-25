// -- IMPORTS

import { databaseService } from './database_service';
import { logError } from'senselogic-gist';

// -- TYPES

class UserPermissionService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedUserPermissionArray = null;
        this.cachedUserPermissionTimestamp = 0;
    }
    // -- INQUIRIES

    async getUserPermissionArray(
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'USER_PERMISSION' )
            .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getUserPermissionSlugArray(
        permissionSlugArray
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'USER_PERMISSION' )
            .select( 'slug' )
            .in( 'slug', permissionSlugArray );

        if ( error !== null )
        {
            logError( data );
        }

        return data;
    }

    // ~~

    async getUserPermissionBySlug(
        permissionSlug
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'USER_PERMISSION' )
            .select( 'slug' )
            .eq( 'slug', permissionSlug )
            .single();

        if ( error !== null )
        {
            logError( data );
        }

        return data;
    }

    // -- OPERATIONS

    async getCachedUserPermissionArray(
        )
    {
        if ( this.cachedUserPermissionArray === null
             || Date.now() > this.cachedUserPermissionArray + 300000 )
        {
            this.cachedUserPermissionArray = await this.getUserPermissionArray();
            this.cachedUserPermissionTimestamp = Date.now()
        }

        return this.cachedUserPermissionArray;
    }
}

// ~~

export let userPermissionService =
    new UserPermissionService();
