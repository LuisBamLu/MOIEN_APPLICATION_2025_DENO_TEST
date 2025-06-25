// -- IMPORTS

import { addFileExtensionPrefix } from 'senselogic-gist';

// import { PUBLIC_MOIEN_STORAGE_URL } from '$env/static/public';

// -- FUNCTIONS

export function getStorageFilePath(
    filePath
    )
{
    if ( filePath )
    {
        if ( filePath.startsWith( '/global/' ) || filePath.startsWith( '/upload/' ) )
        {
            return 'https://cjspwqqhdpkjmqycwxys.supabase.co/storage/v1/object/public' + filePath;
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
    imageWidth,
    defaultImagePath = '/image/icon/moien_happy.svg'
    )
{
    let isImagePathNotString = typeof imagePath !== 'string';

    if ( isImagePathNotString )
    {
        return defaultImagePath;
    }

    if ( !isNaN( imageWidth )
         && imagePath )
    {
        let lastDotIndex = imagePath.lastIndexOf( '.' );
        imagePath = imagePath.substring( 0, lastDotIndex ) + '.avif';
        imagePath = addFileExtensionPrefix( imagePath, `.${ imageWidth }` );
        // imagePath = imagePath + '.' + imageWidth + '.avif';
    }

    return getStorageFilePath( imagePath );
}
