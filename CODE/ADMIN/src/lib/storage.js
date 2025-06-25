// -- IMPORTS

import { addFileExtensionPrefix, getFileLabel, getFileName } from 'senselogic-gist';
import { storageUrl } from './base';

// -- FUNCTIONS

export function getStorageFilePath(
    filePath
    )
{
    if ( filePath )
    {
        if ( filePath.startsWith( '/global/' ) || filePath.startsWith( '/upload/' ) )
        {
            return storageUrl + filePath;
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
        // imagePath = imagePath + '.' + imageWidth + '.avif';
    }

    return getStorageFilePath( imagePath );
}
