// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'propertyId',
        'startingDate',
        'endingDate',
        'lessorUserProfileId',
        'lessorNoticePeriod',
        'tenantUserProfileId',
        'tenantNoticePeriod',
        'status',
        'adultCount',
        'childrenCount',
        'infantCount',
        'hasPet',
        'hasBankGuarantee',
        'requiresRepaint',
        'monthlyRent',
        'monthlyFee',
        'yearlyTax',
        'agencyFee',
        'guaranteeAmount',
        'currencyCode',
        'description',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class LeaseContractService
{
    // -- INQUIRIES

    async getLeaseContractArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = supabaseService.getClient()
            .from( 'LEASE_CONTRACT' )
            .select();
        let countQuery = supabaseService.getClient()
            .from( 'LEASE_CONTRACT' )
            .select( 'id', { count: 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );
        query = query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] = await Promise.all( [ query, countQuery ] );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                leaseContractArray : data,
                leaseContractCount : count
            }
            );
    }

    // ~~

    async getLeaseContractById(
        leaseContractId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .select()
                .eq( 'id', leaseContractId );

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async getContractArrayByContractIdArray(
        contractIdArray
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .select( 'id, currencyCode' )
                .in( 'id', contractIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLeaseContractArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .select()
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLeaseContractArrayByLessorUserProfileId(
        lessorUserProfileId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .select()
                .eq( 'lessorUserProfileId', lessorUserProfileId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLeaseContractArrayByLessorUserProfileIdAndTenantUserProfileId(
        lessorUserProfileId,
        tenantUserProfileId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .select()
                .eq( 'lessorUserProfileId', lessorUserProfileId )
                .eq( 'tenantUserProfileId', tenantUserProfileId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLeaseContractArrayByTenantUserProfileId(
        tenantUserProfileId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .select()
                .eq( 'tenantUserProfileId', tenantUserProfileId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLeaseContractArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addLeaseContract(
        leaseContract
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .insert( leaseContract )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async setLeaseContractById(
        leaseContract,
        leaseContractId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .update( leaseContract )
                .eq( 'id', leaseContractId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async removeLeaseContractById(
        leaseContractId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_CONTRACT' )
                .delete()
                .eq( 'id', leaseContractId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

export let leaseContractService
    = new LeaseContractService();
