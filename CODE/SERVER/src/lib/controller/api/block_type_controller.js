// -- IMPORTS

import { blockTypeService } from '../../service/block_type_service';

// -- FUNCTIONS

export async function getBlockTypeArrayById(
    request,
    reply
    )
{
    return reply.send(
        {
            blockTypeArray : await blockTypeService.getBlockTypeById( request.body.blockTypeId )
        }
        );
}

// ~~

export async function getBlockTypeArray(
    request,
    reply
    )
{
    return reply.send(
        {
            blockTypeArray : await blockTypeService.getBlockTypeArray()
        }
        );
}
