// -- IMPORTS

import Emitter from './emitter';

// -- VARIABLES

export let toastEmitter = new Emitter();

// -- FUNCTIONS

export function toast(
    args
    )
{
    toastEmitter.emit(
        'toast',
        {
            id: crypto.randomUUID(),
            icon: true,
            timestamp: new Date().getTime(),
            ...args,
        }
        );
}

// ~~

toast.success = function (
    message
    )
{
    toast(
        {
            variant : 'success',
            text : message
        }
        );
}

// ~~

toast.error = function (
    message
    )
{
    toast(
        {
            variant : 'error',
            text : message
        }
        );
}

// ~~

toast.warning = function (
    message
    )
{
    toast(
        {
            variant : 'warning',
            text : message
        }
        );
}

//~~

toast.info = function (
    message
    )
{
    toast(
        {
            variant : 'info',
            text : message
        }
        );
}
