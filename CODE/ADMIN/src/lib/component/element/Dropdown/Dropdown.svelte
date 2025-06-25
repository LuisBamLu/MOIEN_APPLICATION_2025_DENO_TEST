<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { clickOutside } from '$lib/base';
    import { hasUserPermission } from '$store/profileStore';
    import { onMount } from 'svelte';

    // -- VARIABLES

    let isOpen = $state(false);
    /** @type {{actionArray?: any, label?: string}} */
    let { actionArray = [], label = '' } = $props();
    let dropdownElement = $state();
    let dropdownPosition =
        $state({
            top : 'auto',
            right : 'auto',
            bottom : 'auto',
            left : 'auto',
        });

    // -- FUNCTIONS

    function adjustDropdownPosition(
        )
    {
        let rect = dropdownElement.getBoundingClientRect();
        let viewWidth = Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
        let viewHeight = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );

        dropdownPosition = { top: 'auto', bottom: 'auto', left: 'auto', right: 'auto' };

        if ( rect.bottom > viewHeight )
        {
            dropdownPosition.bottom = '100%';
        }
        else
        {
            dropdownPosition.top = '100%';
        }

        if ( rect.right > viewWidth )
        {
            dropdownPosition.right = '0';
            dropdownPosition.left = 'auto';
        }
        else if ( rect.left < 0 )
        {
            dropdownPosition.left = '0';
            dropdownPosition.right = 'auto';
        }
        else
        {
            dropdownPosition.right = '0';
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            adjustDropdownPosition();
        }
        );

    // ~~

    run(() => {
        if ( isOpen )
        {
            adjustDropdownPosition();
        }
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .popup
    {
        display: inline-block;
        text-rendering: optimizeLegibility;
        position: relative;
    }

    .popup input
    {
        display: none;
    }

    .burger
    {
        position: relative;

        overflow: hidden;
        outline: 0.125em solid transparent;
        height: 1.5em;
        width: 1.5em;
        border: none;
        border: 1px solid whiteColor;
        border-radius: 0.65em;
        padding: 0.375rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        cursor: pointer;
        transition: all 0.1s ease-in-out;
        outline-offset: 0;
    }

    .burger span
    {
        position: absolute;

        height: 0.125em;
        width: 0.125em;
        border-radius: 0.1875em;

        background: whiteColor;

        transition: 0.3s;
    }

    .burger span:nth-child(1)
    {
        top: 0.9em;
    }

    .burger span:nth-child(2)
    {
        bottom: 0.9em;
    }

    .burger span:nth-child(3)
    {
        top: 50%;
        transform: translateY(-50%);
    }

    .popup-window
    {
        position: absolute;
        // top: calc( 2.125em + 0.125em + 0.125em );
        // left: 0;
        // right: unset;
        transform: scale( 0.8 );

        border: 0.0625em solid #ccc;
        border-radius: 0.5em;
        padding: 0.25em 0.625rem;

        visibility: hidden;
        opacity: 0;
        background: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: blueColor100;

        transition: all 0.1s ease-in-out;
    }

    .popup-window legend
    {
        margin: 0;

        font-size: 1em;
        font-weight: 600;
        color: blueColor100;
    }

    .popup-window ul
    {
        margin: 0;
        padding: 0;

        list-style-type: none;
    }

    .popup-window ul button
    {
        outline: none;
        width: 100%;
        border: none;
        border-radius: 0.75em;
        padding: 0.375em;

        display: flex;
        align-items: center;
        column-gap: 0.875em;

        background: none;
        background: var( --action-background-color, whiteColor );

        font-size: 12px;
        white-space: nowrap;
        color: var( --action-text-color, blueColor100 );

        cursor: pointer;
    }

    .popup-window ul button span
    {
        font-weight: 700;
    }

    .popup-window hr
    {
        margin: 0.3125em 0;
        border: none;
        border-bottom: 0.0625em solid #ccc;
    }

    .popup-window ul button:hover,
    .popup-window ul button:focus-visible
    {
        color: blueColor500;
    }

    .burger:hover
    {
        border-color: blueColor500;
    }

    .burger:active
    {
        transform: scale(0.95);
    }

    .burger:focus:not( :hover )
    {
        outline-color: rgba(0, 0, 0, 0.15);
        outline-offset: 0.125em;
    }

    .popup input:checked ~ nav
    {
        transform: scale(1);

        visibility: visible;
        opacity: 1;
    }

    .icon
    {
        flex-shrink: 0;
    }
</style>

<svelte:window onresize={adjustDropdownPosition}/>

<label class="popup">
    <input type="checkbox" bind:checked={ isOpen }/>
    <div role="button" class="burger" tabindex="0">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <nav
        bind:this={ dropdownElement }
        class="popup-window"
        onclickOutside={() => isOpen = false}
        use:clickOutside
        style={`top: ${ dropdownPosition.top };
            bottom: ${ dropdownPosition.bottom };
            left: ${ dropdownPosition.left };
            right: ${ dropdownPosition.right }`
            }
    >
        {#if label}
            <legend>{ label }</legend>
        {/if}
        <ul>
            {#each actionArray as action }
                {#if hasUserPermission( action.permissionSlug ) }
                    <li>
                        <button style="--action-background-color: { action.backgroundColor }; --action-text-color: { action.textColor };" onclick={() => action.onClick( action )}>
                            <div class="{ action.iconColor ? action.iconColor + '-' : '' }{ action.icon }-icon icon size-90"></div>
                            <span>{ action.actionText }</span>
                        </button>
                    </li>

                    {#if action.breakline }
                        <hr/>
                    {/if}
                {/if}
            {/each}
        </ul>
    </nav>
</label>
