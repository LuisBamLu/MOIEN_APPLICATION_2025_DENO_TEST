// -- VARIABLES

export let filePathPrefix = 'https://ripmolshugpqpadlluex.supabase.co/storage/v1/object/public';
export let filePathSuffix = '.512.jpg';

// -- FUNCTIONS

export function getFilePathType(
    file
    )
{
    const fileType = file.split( '.' ).pop();
    switch ( fileType.toLowerCase() )
    {
        case 'jpg':
        case 'JPG':
            return 'jpg';
        case 'jpeg':
        case 'JPEG':
            return 'jpeg';
        case 'png':
        case 'PNG':
            return 'png';
        case 'svg':
        case 'SVG':
            return 'svg';
        case 'mp4':
        case 'MP4':
            return 'mp4';
        default:
            return 'webp';
    }
}

// ~~

export function getFilePathWithLowerCaseExtension(
    file
    )
{
    const splitFile = file.split( '.' );
    const fileType = splitFile.pop();
    const fileName = splitFile.join('.');

    switch ( fileType.toLowerCase() )
    {
        case 'jpg':
            return `${ fileName }.jpg`;
        case 'jpeg':
            return `${ fileName }.jpeg`;
        case 'png':
            return `${ fileName }.png`;
        case 'svg':
            return `${ fileName }.svg`;
        case 'mp4':
            return `${ fileName }.mp4`;
        case 'zip':
            return `${ fileName }.zip`;
        case 'doc':
            return `${ fileName }.doc`;
        case 'docx':
            return `${ fileName }.docx`;
        case 'pdf':
            return `${ fileName }.pdf`;
    }
}

// ~~

export function generateFilePath(
    filePath,
    fileFormat
    )
{
    if ( filePath )
    {
        var encodedImagePath = filePath.replace(/\//g, '/');
        encodedImagePath = getFilePathWithLowerCaseExtension( encodedImagePath );
        var extension = getFilePathType( filePath );

        if ( extension === 'webp' )
        {
            return filePathPrefix + encodedImagePath + filePathSuffix;
        }
        else
        {
            if ( fileFormat )
            {
                return filePathPrefix + encodedImagePath + '.' + fileFormat + '.' + extension + '.512.' + extension;
            }
            else
            {
                return filePathPrefix + encodedImagePath + '.512.' + extension;
            }
        }
    }
    else
    {
        return '';
    }
}
