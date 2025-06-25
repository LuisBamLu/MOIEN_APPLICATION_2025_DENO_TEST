// -- IMPORTS

import { supabaseService } from './supabase_service.test';

// -- CONSTANTS

export let
    databaseName = 'public';

// -- TYPES

class DatabaseService
{
    // -- OPERATIONS

    getClient(
        )
    {
        return supabaseService.getClient();
    }
}

// -- VARIABLES

export let databaseService
    = new DatabaseService();
