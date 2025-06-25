// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { featureService } from '../../service/feature_service';

// -- FUNCTIONS

export async function setFeature(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    if ( !request.profileLogged )
    {
        return reply.status( 401 ).send( { error: 'unauthorized error' } );
    }

    let body = JSON.parse( request.body );

    for ( let feature of body.featureArray )
    {
        if ( !feature.id )
        {
            feature.id = getRandomTuid();
        }

        if ( !feature.userId )
        {
            feature.userId = request.profileLogged.userId;
        }

        if ( feature[ 'FEATURE_TYPE' ] )
        {
            delete feature[ 'FEATURE_TYPE' ]
        }
    }

    let featureArray = await featureService.upsertFeatureArray( body.featureArray );
    return reply.status( 200 ).send( { featureArray } );
}
