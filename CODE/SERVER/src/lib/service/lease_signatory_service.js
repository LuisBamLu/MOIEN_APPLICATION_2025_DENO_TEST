// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'contractId',
        'genderId',
        'firstName',
        'lastName',
        'birthDate',
        'addressLine1',
        'addressLine2',
        'cityCode',
        'cityName',
        'countryCode',
        'monthlyIncome',
        'employmentStatus',
        'hasDeposit',
        'depositAmount',
        'hasGuarantor',
        'isMandated',
        'companyName',
        'companyTypeId',
        'companyRegistrationNumber',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class LeaseSignatoryService
{
    // -- INQUIRIES

    async getLeaseSignatoryArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = supabaseService.getClient()
            .from( 'LEASE_SIGNATORY' )
            .select();
        let countQuery = supabaseService.getClient()
            .from( 'LEASE_SIGNATORY' )
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
                leaseSignatoryArray: data,
                totalCount: count
            }
            );
    }

    // ~~

    async getLeaseSignatoryArrayByContractId(
        contractId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .select()
                .eq( 'contractId', contractId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLeaseSignatoryArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .select()
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLeaseSignatoryArrayByUserIdAndContractId(
        userId,
        contractId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .select()
                .eq( 'userId', userId )
                .eq( 'contractId', contractId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLeaseSignatoryById(
        id
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .select()
                .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addLeaseSignatory(
        leaseSignatory
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .insert( leaseSignatory )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async setLeaseSignatoryById(
        leaseSignatory,
        leaseSignatoryId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .update( leaseSignatory )
                .eq( 'id', leaseSignatoryId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async upsertLeaseSignatoryArray(
        leaseSignatoryArray
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .upsert( leaseSignatoryArray )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeLeaseSignatoryById(
        leaseSignatoryId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .delete()
                .eq( 'id', leaseSignatoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeLeaseSignatoryByIdArray(
        leaseSignatoryIdArray
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .delete()
                .in( 'id', leaseSignatoryIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeLeaseSignatoryByContractId(
        contractId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_SIGNATORY' )
                .delete()
                .eq( 'contractId', contractId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

export let leaseSignatoryService = new LeaseSignatoryService();
