// -- IMPORTS

import { getLocalDateTime, getDateTimeSuffix, getFileExtension, getValidFileName, getFileLabel, isArray, getUnaccentedText, addFileExtensionPrefix } from 'senselogic-gist';
import { storageService } from '../service/storage_service.js';
import sharp from 'sharp';

// -- VARIABLES

let globalDirectory = '/global/image/'

// -- FUNCTIONS

async function processFile(
    file,
    folderPath,
    fileFolder,
    fileBufferByPathMap,
    finalFilePathArray,
    imageSizeArray
    )
{
    let fileUploaded = true;
    let localDateTime = getLocalDateTime();
    let timestamp = getDateTimeSuffix( localDateTime, '', '' );
    let contentType = file.mimetype;
    let fileExtension = getFileExtension( file.filename );
    let fileName = getValidFileName( getUnaccentedText( getFileLabel( file.filename ) ) ).replaceAll( '.', '' );
    let defaultPath = folderPath + fileName + '_' + timestamp + fileExtension;

    let buffer = await file.toBuffer();
    let isImage = true;

    try
    {
        await sharp( buffer ).metadata();
    }
    catch ( error )
    {
        isImage = false;
    }

    if ( isImage )
    {
        let imageBufferBySizeMap = await getFileBufferBySizeMap( buffer, imageSizeArray );
        fileFolder = '/image/';
        defaultPath = folderPath + fileFolder + fileName + '_' + timestamp;
        let imagePathBySizeMap = {};

        for ( let imageSize of imageSizeArray )
        {
            imagePathBySizeMap[ imageSize ] = defaultPath + '.' + imageSize + '.avif';
        }

        fileBufferByPathMap[ defaultPath + fileExtension.toLowerCase() ] = buffer;
        finalFilePathArray.push( '/global/' + defaultPath + fileExtension.toLowerCase() );

        for ( let imageSize of imageSizeArray )
        {
            fileBufferByPathMap[ imagePathBySizeMap[ imageSize ] ] = imageBufferBySizeMap[ imageSize ];
        }
    }
    else
    {
        let filePath = folderPath + fileName + '_' + timestamp + fileExtension.toLowerCase();
        fileBufferByPathMap[ filePath ] = buffer;
        finalFilePathArray.push( '/global/' +  filePath );
    }
}

// ~~

export async function handleUploadFiles(
    fileArray,
    folderPath,
    deletedFileArray = [],
    imageSizeArray = [ 1920, 640, 360 ]
    )
{
    if ( !isArray( fileArray ) )
    {
        throw new Error( 'Invalid files' );
    }

    let finalFilePathArray = [];
    let fileFolder = '/document/';
    let fileBufferByPathMap = {};
    let uploadPromiseArray = [];

    for ( let file of fileArray )
    {
        if ( file.size != 0 )
        {
            await processFile(
                file,
                folderPath,
                fileFolder,
                fileBufferByPathMap,
                finalFilePathArray,
                imageSizeArray
                );
        }
    }

    let resultArray = await storageService.batchUploadFile( fileBufferByPathMap );

    if ( resultArray.error )
    {
        await storageService.deleteFiles( finalFilePathArray );

        return  { error: resultArray.error };
    }

    storageService.deleteFiles( deletedFileArray );
    await Promise.all( uploadPromiseArray );

    return finalFilePathArray;
}

// ~~

export async function createLimitedImage(
    inputBuffer,
    maximumPixelCount,
    imageHasAlpha = false
    )
{
    let image = sharp( inputBuffer );
    let metadata = await image.metadata();
    let oldWidth = metadata.width;
    let oldHeight = metadata.height;

    if ( oldWidth > 0 && oldHeight > 0 )
    {
        let newWidth = oldWidth;
        let newHeight = oldHeight;
        let oldPixelCount = oldWidth * oldHeight;

        if ( oldPixelCount > maximumPixelCount )
        {
            let newSizeRatio = Math.sqrt( maximumPixelCount / oldPixelCount );
            newWidth = Math.floor( oldWidth * newSizeRatio );
            newHeight = Math.floor( oldHeight * newSizeRatio );
        }

        if ( newWidth < 1 )
        {
            newWidth = 1;
        }

        if ( newHeight < 1 )
        {
            newHeight = 1;
        }

        let newImage = image.resize( newWidth, newHeight );

        if ( imageHasAlpha )
        {
            newImage = newImage.ensureAlpha();
        }

        let isLossless = metadata.format === 'png';
        let quality = 55;

        if ( maximumPixelCount === 73080 )
        {
            quality = 30;
        }

        newImage = newImage.avif( { quality, lossless: isLossless } );

        let outputBuffer = await newImage.toBuffer();

        return outputBuffer;
    }
    else
    {
        let newImage = sharp(
            {
                create:
                {
                    width: 1,
                    height: 1,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                }
            }
            );

        let outputBuffer = await newImage.toBuffer();

        return outputBuffer;
    }
}

// ~~

export async function getFileBufferBySizeMap(
    buffer,
    imageSizeArray
    )
{
    let fileBufferBySizeMap = {};

    for ( let imageSize of imageSizeArray )
    {
        fileBufferBySizeMap[ imageSize ]
            = await createLimitedImage(
                buffer,
                imageSize * imageSize * ( 9/16 ),
                false
                )
    }

    return fileBufferBySizeMap;
}

// ~~

export function getStorageFilePath(
    filePath
    )
{
    if ( filePath )
    {
        if ( filePath.startsWith( '/global/' ) || filePath.startsWith( '/upload/' ) )
        {
            return process.env.SECRET_MOIEN_STORAGE_URL + filePath;
        }
        else
        {
            return '' + filePath;
        }
    }
}

// ~~

export function getStorageImagePath(
    imagePath,
    imageWidth
    )
{
    if ( !isNaN( imageWidth )
         && imagePath )
    {
        let lastDotIndex = imagePath.lastIndexOf( '.' );
        imagePath = imagePath.substring( 0, lastDotIndex ) + '.avif';
        imagePath = addFileExtensionPrefix( imagePath, `.${ imageWidth }` );
    }

    return getStorageFilePath( imagePath );
}
