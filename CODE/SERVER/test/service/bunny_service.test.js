// -- IMPORTS

import fs from 'fs';
import { Readable } from 'stream';

// -- TYPES

class BunnyService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.baseUrl = process.env.MOIEN_BUNNY_STORAGE_URL;
        this.storageZoneName = process.env.MOIEN_BUNNY_STORAGE_ZONE_NAME;
        this.apiKey = process.env.MOIEN_BUNNY_STORAGE_API_KEY;
    }

    // -- INQUIRIES

    getFileUrl(
        filePath
        )
    {
        return 'https://' + this.baseUrl + '/' + this.storageZoneName + '/' + filePath;
    }

    // ~~

    async uploadFile(
        filename,
        storageFilePath,
        localFile,
        isBuffer = false
        )
    {
        try
        {
            let readStream;

            if ( isBuffer )
            {
                readStream = Readable.from( localFile )
            }
            else
            {
                readStream = fs.createReadStream( storageFilePath );
            }

            let response =
                await fetch(
                    this.getFileUrl( filename ),
                    {
                        method : 'PUT',
                        headers :
                            {
                                'AccessKey' : this.apiKey,
                                'Content-Type' : 'application/octet-stream'
                            },

                        body : readStream,
                        duplex: 'half'
                    }
                    );

            if ( !response.ok )
            {
                throw new Error( 'Failed to upload file: ' + response.statusText );
            }

            console.log( 'File uploaded successfully.' );
            let data = await response.json();

            return data;
        }
        catch ( error )
        {
            console.error( 'Error uploading file to Bunny CDN:', error );

            return { 'Error uploading file to Bunny CDN': error};
        }
    }

    // ~~

    async removeFile(
        storageFilePath
        )
    {
        try
        {
            let response =
                await fetch(
                    this.getFileUrl( storageFilePath ),
                    {
                        method : 'DELETE',
                        headers :
                            {
                                'AccessKey' : this.apiKey
                            }
                    }
                    );

            if ( !response.ok )
            {
                throw new Error( 'Failed to remove file: ' + response.statusText );
            }

            let data = await response.json();

            return data;
        }
        catch ( error )
        {
            console.error( 'Error removing file from Bunny CDN:', error );

            return null;
        }
    }
}

// -- VARIABLES

export let bunnyService
    = new BunnyService();
