// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { handleUploadFiles } from '../../utils/fileUtils';
import { storageService } from '../../service/storage_service';

// -- TYPES

class TaskSemaphore
{
    // -- CONSTRUCTORS

    constructor(
        maximumConcurrentTaskCount = 3
        )
    {
        this.maximumConcurrentTaskCount = maximumConcurrentTaskCount;
        this.concurrentTaskCount = 0;
        this.taskArray = [];
    }

    // -- OPERATIONS

    async enqueue(
        )
    {
        if ( this.concurrentTaskCount < this.maximumConcurrentTaskCount )
        {
            this.concurrentTaskCount++;

            return Promise.resolve();
        }
        else
        {
            return new Promise( resolve => this.taskArray.push( resolve ) );
        }
    }

    // ~~

    async dequeue(
        )
    {
        this.concurrentTaskCount--;

        if ( this.taskArray.length > 0 )
        {
            this.concurrentTaskCount++;
            let resolve = this.taskArray.shift();
            resolve();
        }
    }
}

// -- VARIABLES

let taskSemaphore = new TaskSemaphore();

// -- FUNCTIONS

export async function addFile(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = request.body;
    let file = body.file;
    let imageSizeArray = getJsonObject( body.imageSizeArray?.value ) ?? [ 1920, 640, 360 ];

    if ( !request.profileLogged )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let fileDirectory = 'user/' + request.profileLogged.userId;

    await taskSemaphore.enqueue();
    let filePathArray
        = await handleUploadFiles(
            [ file ],
            fileDirectory,
            [],
            imageSizeArray
            );
    taskSemaphore.dequeue();

    if ( filePathArray.error )
    {
        return reply.status( 200 ).send( { error: filePathArray.error } );
    }

    return reply.status( 200 ).send( { filePath: filePathArray[ 0 ] } );
}

// ~~

export async function removeFile(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = getJsonObject( request.body );
    let filePath = body.filePath;
    await storageService.deleteFiles( [ filePath ] );

    return reply.status( 200 ).send( { message: 'File deleted' } );
}
