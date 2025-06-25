// -- IMPORTS

import { contactService } from "../../service/contact_service";

// -- FUNCTIONS

export async function sendContactUsEmail(
    request,
    reply
    )
{
    return (
        reply.send(
            await contactService.sendContactEmail( request.profileLogged, request.body, reply )
        )
    )
}
