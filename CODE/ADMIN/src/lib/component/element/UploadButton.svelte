<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import * as d3 from 'd3';

    // -- CONSTANTS

    const newProfileInterface =
        {
            firstName : '',
            lastName : '',
            email : '',
            phonePrefix : '',
            phoneNumber : '',
            roleId : ''
        };

    // -- VARIABLES

    let uploadedFile = $state(null);

    // -- FUNCTIONS

    function readUploadedFile(
        inputFile
        )
    {
        let temporaryFileReader = new FileReader();
        let newProfileArray = [];
        let type = inputFile.type;

        return new Promise(
            ( resolve, reject ) =>
            {
                temporaryFileReader.onerror = ( event ) =>
                {
                    reject( event );
                };

                temporaryFileReader.onload = ( event ) =>
                {
                    let text = event.target.result;
                    let fileData;

                    try
                    {
                        fileData = type === 'application/json'
                        ? ( JSON.parse( String( text ) ) ).profileArray
                        : d3.csvParse( text );
                    }
                    catch ( error )
                    {
                        alert( 'Invalid file data' );
                        return false;
                    }

                    for ( let i = 0; i < fileData.length; i++ )
                    {
                        newProfileArray.push( fileData[ i ] );
                    }
                    resolve( newProfileArray );
                };

                temporaryFileReader.readAsText( inputFile );
            }
            );
    }

    // ~~

    function isNewProfileValid(
        profile
        )
    {
        for ( let key in newProfileInterface )
        {
            if ( !profile[ key ] )
            {
                return false;
            }
        }
        return true;
    }

    // ~~

    async function processFile(
        file
        )
    {
        try
        {
            if ( file && ( file.type === 'application/json' || file.type === 'text/csv' ) )
            {
                let newProfileArray = await readUploadedFile( file );

                let validated = newProfileArray.every( isNewProfileValid );

                if ( !validated )
                {
                    alert( 'Invalid profile data' );
                    return false;
                }

                return newProfileArray;
            }
            else
            {
                alert( 'Invalid file type' );
                return false;
            }
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    // -- STATEMENTS

    run(() => {
        (
            async () =>
            {
                if ( uploadedFile )
                {
                    let newProfileArray = await processFile( uploadedFile[ 0 ] );

                    if ( newProfileArray )
                    {
                        let response = await fetchData(
                            '/api/profile/add-many',
                            {
                                method: 'POST',
                                headers:
                                {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(
                                    {
                                        type: 'uploadNewProfiles',
                                        profileArray: newProfileArray
                                    }
                                    ),
                            }
                            );
                    }
                }
            }
            )();
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    span
    {
        font-size: 1.5vw;
        font-weight: 600;
        @media( max-width: 1200px )
        {
            font-size: 3vw;
        }

        @media( max-width: 750px )
        {
            font-size: 5vw;
        }
    }

    label
    {
        border: 1px solid blueColor300;
        border-radius: 12px;
        padding: 0.75vw 1.25vw;

        display: flex;
        flex-direction: row
        gap: 1vw;
        justify-content: center;
        align-items: center;

        background-color: blueColor300;

        font-weight: 700;
        color: white;

        cursor: pointer;
        &:hover
        {
            border: 1px solid blueColor500;

            background-color: blueColor500;
        }
    }
</style>

<input
    type="file"
        bind:files={ uploadedFile }
        id="upload-users"
        accept=".json, .csv"
        hidden
    />
<label for="upload-users">
    <div class="upload-icon size-150"></div>
    { getLocalizedTextBySlug( 'upload-text-label', $languageTagStore ) }
</label>
