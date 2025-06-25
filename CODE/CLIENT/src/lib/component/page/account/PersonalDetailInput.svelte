<script>
    // -- IMPORTS

    import { fetchData, hostUrl } from '$lib/base';
    import { profileSignedInStore } from '$store/profileStore';
    import AccountInput from '$component/page/account/AccountInput.svelte';
    import Error from '$component/element/Error.svelte';
    import { toast } from '$lib/toast';
    import { getJsonText } from 'senselogic-gist';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let label;
    export let initialValue;
    export let validationVariant = 'none'
    export let editable = false;
    export let helper = null;
    export let addressInfo = null;
    export let cityName = null;
    export let countryName = null;
    export let postalCode = null;

    let birthDate
    let formattedBirthDate
    let isEditing = false;
    let error = null;
    let isSubmitting = false;

    // -- FUNCTIONS

    function loadBirthDateData(
        )
    {
        if ( validationVariant === 'birth-date' )
        {
            birthDate = new Date( initialValue );
            formattedBirthDate = birthDate.toLocaleDateString( 'default', { timeZone: 'UTC' } );
        }
    }

    function getCamelCasedString(
        string
        )
    {
        return string.replace( /-./g, x => x[ 1 ].toUpperCase() );
    }

    // ~~

    async function inputValidation(
        validationVariant
        )
    {
        if ( validationVariant === 'address' )
        {
            return await validateAddress();
        }

        if ( validationVariant === 'birth-date' )
        {
            loadBirthDateData();

            return validateBirthDate( birthDate );
        }

        return true;
    }

    // ~~

    async function validateAddress(
        )
    {
        isSubmitting = true;

        let response
            = await fetchData(
                '/api/validate-address',
                {
                    method: 'POST',
                    body:
                        JSON.stringify(
                            {
                                addressInfo: addressInfo,
                                cityName: cityName,
                                countryName: countryName,
                                postalCode: postalCode
                            }
                            ),
                    headers: { 'Content-Type': 'application/json' }
                }
                );

        if ( response.errors )
        {
            isSubmitting = false;
            toast.error( 'account-transfer-to-account-modal-error-label' )

            return false;
        }
        else
        {
            return true;
        }
    }

    // ~~

    function validateBirthDate(
        birthDate
        )
    {
        let currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        let month = currentDate.getMonth() - birthDate.getMonth();

        if ( month < 0
             || ( month === 0 && currentDate.getDate() < birthDate.getDate() ) )
        {
            age--;
        }

        if ( isNaN( birthDate.getTime() ) )
        {
            toast.error( 'invalid-date-label' );

            return false;
        }
        else if (birthDate > currentDate)
        {
            toast.error( 'birth-date-in-future-label' );

            return false;
        }
        else if ( age < 13 )
        {
            toast.error( 'underage-label' );

            return false;
        }

        return true;
    }

    // ~~

    async function handleSubmit(
        event
        )
    {
        event.preventDefault();
        error = null;
        let formData = new FormData( event.target );
        let profileData = {};
        let isInputValid = await inputValidation( validationVariant );

        if ( !isInputValid )
        {
            isSubmitting = false;
            isEditing = true;

            return;
        }

        for ( let [ key, value ] of formData )
        {
            let camelCasedKey = getCamelCasedString( key );
            profileData[ camelCasedKey ] = value;
        }

        isSubmitting = true;

        let result
            = await fetch(
                hostUrl + '/api/update-profile/' + $profileSignedInStore.id,
                {
                    method: 'POST',
                    body: getJsonText( profileData ),
                    credentials: 'include'
                }
                );

        let data = await result.json();

        // if ( !result.ok )
        // {
        //     if ( data.error === 'validation-error' && data.validationErrors )
        //     {
        //         for ( let field in data.validationErrors)
        //         {
        //             console.error( data.validationErrors[ field ] );
        //         }
        //     }
        //     else
        //     {
        //         console.error('Error:', data.error );
        //     }
        // }

        isSubmitting = false;

        if ( data.message )
        {
            toast.informative( data.message );
        }

        if ( data.profile )
        {
            profileSignedInStore.set( data.profile )
            isEditing = false;
            toast.success( 'update-profile-update-successful' );
        }
        else if ( data.error )
        {
            isEditing = true;
            toast.error( 'account-transfer-to-account-modal-error-label' );
        }

        return false;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            loadBirthDateData();
        }
        );

    // ~~

    $:
    {
        if ( initialValue )
        {
            loadBirthDateData();
        }
    }
</script>

{#key error }
    <Error error={ error } />
{/key}
<AccountInput
    label={ label }
    initialValue={ validationVariant === 'birth-date' ? formattedBirthDate : initialValue }
    helper={ helper }
    handleSubmit={ handleSubmit }
    isSubmitting={ isSubmitting }
    bind:editable={ editable }
    bind:isEditing={ isEditing }
>
    <slot />
</AccountInput>
