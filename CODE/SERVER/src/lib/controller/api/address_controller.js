// -- IMPORTS
import { validateAddressData } from "../../validators/address_validator";

// -- FUNCTIONS

export async function validateAddress(
    request,
    reply
    )
{
    let addressData = request.body;

    let errors = await validateAddressData( addressData );

    if ( errors.length > 0 )
    {
        return reply.send( { errors: errors } );
    }

    return reply.status(200).send({ message: "Address is valid" });
}
