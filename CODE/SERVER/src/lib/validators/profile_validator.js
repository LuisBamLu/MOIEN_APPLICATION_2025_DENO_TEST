// -- IMPORTS

import { countryService } from "../service/country_service";

// -- FUNCTIONS

export async function validateDashboardProfileData(
    data
    )
{
    let errors = [];

    if ( data.firstName )
    {
        if ( typeof data.firstName !== 'string' )
        {
            errors.push( 'first-name-not-a-string' );
        }
        else if ( !data.firstName.trim() )
        {
            errors.push( 'first-name-empty' );
        }
        else if ( data.firstName.length > 50 )
        {
            errors.push( 'first-name-too-long' );
        }
        else if ( !/^[a-zA-Z]+$/.test( data.firstName ) )
        {
            errors.push( 'first-name-invalid-format' );
        }
    }

    if ( data.lastName )
    {
        if ( typeof data.lastName !== 'string' )
        {
            errors.push( 'last-name-not-a-string' );
        }
        else if ( !data.lastName.trim() )
        {
            errors.push( 'last-name-empty' );
        }
        else if ( data.lastName.length > 50 )
        {
            errors.push( 'last-name-too-long' );
        }
        else if ( !/^[a-zA-Z]+$/.test( data.lastName ) )
        {
            errors.push( 'last-name-invalid-format' );
        }
    }

    if ( data.genderId )
    {
        if ( typeof data.genderId !== 'string' )
        {
            errors.push( 'gender-not-a-string' );
        }
        else if ( !['male', 'female', 'non-binary', 'other'].includes( data.genderId ) )
        {
            errors.push( 'gender-invalid-option' );
        }
    }

    if ( data.birthDate )
    {
        if ( typeof data.birthDate !== 'string' )
        {
            errors.push( 'birthdate-not-a-string' );
        }
        else
        {
            let birthDate = new Date( data.birthDate );
            let today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            let monthDiff = today.getMonth() - birthDate.getMonth();

            if ( monthDiff < 0 || ( monthDiff === 0 && today.getDate() < birthDate.getDate() ) )
            {
                age--;
            }

            if ( age < 13 )
            {
                errors.push( 'birthdate-too-young' );
            }

            if ( age > 130 )
            {
                errors.push( 'birthdate-invalid' );
            }
        }
    }

    if ( data.aboutDescription )
    {
        if ( typeof data.aboutDescription !== 'string' )
        {
            errors.push( 'about-not-a-string' );
        }
        else if ( data.aboutDescription.length > 500 )
        {
            errors.push( 'about-too-long' );
        }
    }

    if ( data.phonePrefix || data.phoneNumber )
    {
        let countryArray = await countryService.getCachedCountryArray();
        let isValidPrefix = countryArray.some( country => country.phonePrefix === data.phonePrefix );

        if ( !isValidPrefix )
        {
            errors.push( 'phone-prefix-invalid' );
        }

        if ( typeof data.phoneNumber !== 'string' )
        {
            errors.push( 'phone-not-a-string' );
        }
        else if ( !data.phoneNumber.trim() )
        {
            errors.push( 'phone-empty' );
        }
        else if ( !/^\d+$/.test( data.phoneNumber ) )
        {
            errors.push( 'phone-invalid-format' );
        }
        else if ( data.phoneNumber.length < 7 || data.phoneNumber.length > 20 )
        {
            errors.push( 'phone-invalid-format' );
        }
    }

    return errors;
}
