// -- IMPORTS

import { visitStatusService } from '../../../service/visit_status_service';

// -- FUNCTIONS

async function getVisitStatus(
    request,
    reply
    )
{
    let visitStatusArray = await visitStatusService.getCachedVisitStatusArray();

    return reply.status( 200 ).send( { visitStatusArray } );
}

// ~~

async function addVisitStatus(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let visitStatus = await visitStatusService.addVisitStatus( body.visitStatus );

    return reply.status( 200 ).send( { visitStatus } );
}

// ~~

async function setVisitStatus(
    request,
    reply
    )
{
    let visitStatusId = request.params.id;
    let body = JSON.parse( request.body );
    let visitStatus = await visitStatusService.setVisitStatusById( body.visitStatus, visitStatusId );

    return reply.status( 200 ).send( { visitStatus } );
}

// ~~

async function deleteVisitStatus(
    request,
    reply
    )
{
    let visitStatusId = request.params.id;
    await visitStatusService.removeVisitStatusById( visitStatusId );

    return reply.status( 200 ).send( { message: 'rental booking status removed successfully' } );
}

export
{
    getVisitStatus,
    addVisitStatus,
    setVisitStatus,
    deleteVisitStatus
}
