// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service.test';
import path from 'node:path';

// -- TYPES

export class StorageService
{
    // -- INQUIRIES

    async getBucketArray(
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .storage
                .listBuckets();

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getImageArray(
        page = 1,
        limit_value  = 1000
        )
    {
        let { data : imageArray, error } =
            await supabaseService.getClient()
                .rpc( 'get_paginated_images', { page, limit_value  } );
        let { data : imageArrayCount } =
            await supabaseService.getClient()
                .rpc( 'count_images' );

        if ( error !== null )
        {
            logError( error );

            return (
                {
                    imageArray: [],
                    imageArrayCount: 0
                }
                );
        }

        return (
            {
                imageArray,
                imageArrayCount
            }
            );
    }

    // ~~

    async updateFile(
        path,
        file,
        contentType
        )
    {
        let { data, error } = await supabaseService.getClient()
            .storage
            .from( 'upload' )
            .update(
                path,
                file,
                {
                    upsert : true,
                    contentType
                }
                );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getObjectArrayByFolderPath(
        folderPath
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .storage
                .from( 'upload' )
                .list( folderPath );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    getFilePath(
        filePath
        )
    {
        if ( filePath.startsWith( '/upload/' ) )
        {
            return process.env.SECRET_MOIEN_STORAGE_URL + filePath;
        }
        else
        {
            return filePath;
        }
    }

    // ~~

    getImagePath(
        imagePath,
        imageWidth
        )
    {
        if ( !isNaN( imageWidth ) )
        {
            if ( imagePath.endsWith( '.jpg' ) )
            {
                imagePath += '.' + imageWidth + '.jpg';
            }
            else if ( imagePath.endsWith( '.png' ) )
            {
                imagePath += '.' + imageWidth + '.png';
            }
        }

        return this.getFilePath( imagePath );
    }

    // -- OPERATIONS

    async uploadFile(
        path,
        file,
        contentType
        )
    {
        const { data, error } = await supabaseService.getClient()
            .storage
            .from( 'upload' )
            .upload(
                file,
                path,
                {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: contentType
                }
                );

        if ( error )
        {
            throw error;
        }

        return data;
    }

    // ~~

    async uploadFiles(
        filePathArray,
        fileBufferArray,
        )
    {
        const startTime = Date.now();

        try
        {
            const uploadPromiseArray
                = Object.keys( filePathArray )
                    .map(
                        key =>
                        {
                            return supabaseService.uploadFile(
                                fileBufferArray[ key ],
                                filePathArray[ key ],
                                true
                                );
                        }
                        );
            const resultArray = await Promise.all( uploadPromiseArray );
            const errorArray = resultArray.filter( Boolean ).filter( result => result.error );

            if ( errorArray.length )
            {
                throw new Error( `File upload error : ${ errorArray.map( e => e.error.message ).join( ', ' ) }` );
            }

            const endTime = Date.now();
            const duration = endTime - startTime;

            console.log( `Upload completed in ${ duration } ms` );

            return resultArray.map( result => result );
        }
        catch ( error )
        {
            throw new Error( `File upload error : ${ error.message }` );
        }
    }

    // ~~

    async batchUploadFile(
        fileBufferByPathMap
        )
    {
        let startTime = Date.now();
        let uploadPromiseArray = [];

        for ( let [ filePath, fileBuffer ] of Object.entries( fileBufferByPathMap ) )
        {
            uploadPromiseArray.push(
                supabaseService.uploadFile( fileBuffer, filePath, true )
                );
        }

        let resultArray = await Promise.all( uploadPromiseArray )

        if ( resultArray.includes( null ) )
        {
            console.log( 'Upload failed' );

            return { error: 'Image upload failed' };
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log( `Upload completed in ${ duration } ms` );

        return resultArray;
    }

    // ~~

    async deleteFile(
        path,
        isGlobal = false
        )
    {
        let deleteFileResponse;

        if ( Array.isArray( path ) )
        {
            deleteFileResponse = await supabaseService.deleteFile( path, isGlobal );
        }
        else
        {
            deleteFileResponse = await supabaseService.deleteFile( [ path ], isGlobal );
        }

        return deleteFileResponse;
    }

    // ~~

    async deleteFiles(
        filePathArray
        )
    {
        try
        {
            if ( !Array.isArray( filePathArray ) )
            {
                if ( filePathArray.length > 0 )
                {
                    filePathArray = filePathArray[ 0 ].split( ',' );
                }
            }

            if ( filePathArray
                && filePathArray.length > 0 )
            {
                for ( let filePath of filePathArray )
                {
                    if ( filePath )
                    {
                        filePath = `${ filePath }`;

                        let fileExtension = path.extname( filePath ).toLowerCase();

                        if ( fileExtension === '.png'
                             || fileExtension === '.jpg'
                             || fileExtension === '.jpeg'
                             || fileExtension === '.gif'
                             || fileExtension === '.avif' )
                        {
                            if ( filePath )
                            {
                                try
                                {
                                    filePath = filePath.replace( '/global/', '' )
                                    let lastDotCharacterIndex = filePath.lastIndexOf( '.' );
                                    let resizedDefaultFilePath = filePath.substring( 0, lastDotCharacterIndex );
                                    let resizedFileExtension = '.avif';

                                    let responseArray = await Promise.all(
                                        [
                                            this.deleteFile( filePath ),
                                            this.deleteFile( resizedDefaultFilePath + '.360' + resizedFileExtension, true ),
                                            this.deleteFile( resizedDefaultFilePath + '.512' + resizedFileExtension, true ),
                                            this.deleteFile( resizedDefaultFilePath + '.640' + resizedFileExtension, true ),
                                            this.deleteFile( resizedDefaultFilePath + '.1080' + resizedFileExtension, true ),
                                            this.deleteFile( resizedDefaultFilePath + '.1280' + resizedFileExtension, true ),
                                            this.deleteFile( resizedDefaultFilePath + '.1920' + resizedFileExtension, true ),
                                            this.deleteFile( resizedDefaultFilePath + '.3840' + resizedFileExtension, true )
                                        ]
                                        );

                                        for ( let data of responseArray )
                                        {
                                            console.log( 'File deleted successfully', data );
                                        }
                                }
                                catch ( error )
                                {
                                    console.error( 'Error in file deletion', error );
                                }
                            }
                        }
                        else
                        {
                            await this.deleteFile( filePath )
                                .then( data => console.log( 'File deleted successfully', data ) )
                                .catch( error => console.error('Error in file deletion', error ) );
                        }
                    }
                }
            }
        }
        catch ( error )
        {
            console.error( `Error deleting files: ${ error }` );
        }
    }
}

// -- VARIABLES

export let storageService = new StorageService();
