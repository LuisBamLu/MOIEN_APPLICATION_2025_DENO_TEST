import mailchimp from '@mailchimp/mailchimp_marketing';

/**
 * Get all verified domains from Mailchimp.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 * @returns { Object[] } response.domains - The list of domains.
 * @returns { string } response.domains[].domain - The domain name.
 * @returns { boolean } response.domains[].verified - Whether the domain is verified.
 * @returns { boolean } response.domains[].authenticated - Whether the domain is authenticated.
 * @returns { string } response.domains[].verification_email - The verification email.
 * @returns { string } response.domains[].verification_sent - The date and time when the verification email was sent.
 * @returns { number } response.total_items - The total number of items.
 */
export async function getVerifiedDomains(
    )
{
    try
    {
        let response = await mailchimp.verifiedDomains.getVerifiedDomainsAll();

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 * Add a verified domain to Mailchimp.
 *
 * @param { string } domain - The e-mail address at the domain you want to verify.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 * @returns { string } response.domain - The domain name.
 * @returns { boolean } response.verified - Whether the domain is verified.
 * @returns { boolean } response.authenticated - Whether the domain is authenticated.
 * @returns { string } response.verification_email - The verification email.
 * @returns { string } response.verification_sent - The date and time when the verification email was sent.
 */
export async function addVerifiedDomain(
    domain
    )
{
    try
    {
        let response =
            await mailchimp.verifiedDomains.createVerifiedDomain(
                {
                    verification_email: domain
                }
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding verified domain: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 * Get information for a specific domain from Mailchimp.
 *
 * @param { string } domain - The domain name.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 * @returns { string } response.domain - The domain name.
 * @returns { boolean } response.verified - Whether the domain is verified.
 * @returns { boolean } response.authenticated - Whether the domain is authenticated.
 * @returns { string } response.verification_email - The verification email.
 * @returns { string } response.verification_sent - The date and time when the verification email was sent.
 */
export async function getDomain(
    domain
    )
{
    try
    {
        let response =
            await mailchimp.verifiedDomains.getDomain( domain );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting domain info: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 *
 * Revokes a verified domain from Mailchimp.
 *
 * @param { string } domain - The domain name.
 *
 * @returns {} - The response from the Mailchimp API.
 */
export async function revokeVerifiedDomain(
    domain
    )
{
    try
    {
        let response =
            await mailchimp.verifiedDomains.deleteDomain( domain );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error revoking verified domain: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 *
 * @param { string } domain - The domain name.
 * @param { string } code - The code that was sent to the email address provided when adding a new domain to verify.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 * @returns { string } response.domain - The domain name.
 * @returns { boolean } response.verified - Whether the domain is verified.
 * @returns { boolean } response.authenticated - Whether the domain is authenticated.
 * @returns { string } response.verification_email - The verification email.
 * @returns { string } response.verification_sent - The date and time when the verification email was sent.
 */
export async function verifyDomain(
    domain,
    code
    )
{
    try
    {
        let response =
            await mailchimp.verifiedDomains.submitDomainVerification(
                domain,
                {
                    code: code
                }
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error verifying domain: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}
