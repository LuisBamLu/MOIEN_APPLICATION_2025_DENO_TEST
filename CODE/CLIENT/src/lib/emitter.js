// -- STATEMENTS

export default class Emitter
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.eventListenerArray = new Map();
    }

    // -- OPERATIONS

    on(
        eventName,
        listener
        )
    {
        if ( !this.eventListenerArray.has(  ) )
        {
            this.eventListenerArray.set( eventName, [] );
        }

        this.eventListenerArray
            .get( eventName )
            .push( listener );
    }

    // ~~

    off(
        eventName,
        listener
        )
    {
        if ( this.eventListenerArray.has( eventName ) )
        {
            let eventListenerArray = this.eventListenerArray.get( eventName );
            let eventListenerIndex = eventListenerArray.indexOf( listener );
            let eventListenerExists = eventListenerIndex !== -1;

            if ( eventListenerExists )
            {
                eventListenerArray.splice( eventListenerIndex, 1 );
            }
        }
    }

    // ~~

    emit(
        eventName,
        ...args
        )
    {
        if ( this.eventListenerArray.has( eventName ) )
        {
            let eventListenerArray = this.eventListenerArray.get( eventName );

            for ( let eventListener of eventListenerArray )
            {
                eventListener( ...args );
            }
        }
    }
}
