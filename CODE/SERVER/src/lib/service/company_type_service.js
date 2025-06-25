// -- IMPORTS

import { supabaseService } from './supabase_service';

// -- TYPES

export class CompanyTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedCompanyTypeArray = null;
        this.cachedCompanyTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getCompanyTypeArray(
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'COMPANY_TYPE' )
                .select();

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCompanyTypeById(
        id
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'COMPANY_TYPE' )
                .select()
                .eq( 'id', id );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCachedCompanyTypeArray(
        )
    {
        if ( this.cachedCompanyTypeArray === null
             || Date.now() > this.cachedCompanyTypeTimestamp + 300000 )
        {
            this.cachedCompanyTypeArray = await this.getCompanyTypeArray();
            this.cachedCompanyTypeTimestamp = Date.now()
        }

        return this.cachedCompanyTypeArray;
    }

    // -- OPERRATIONS

    async addCompanyType(
        companyType
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'COMPANY_TYPE' )
                .insert( companyType );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setCompanyType(
        companyType,
        id
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'COMPANY_TYPE' )
                .update( companyType )
                .eq( 'id', id );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeCompanyType(
        id
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'COMPANY_TYPE' )
                .delete()
                .eq( 'id', id );

        if ( error )
        {
            logError( error );
        }

        return data;
    }
}

export let companyTypeService = new CompanyTypeService();
