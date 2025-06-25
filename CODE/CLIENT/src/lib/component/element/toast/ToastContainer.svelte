<script>
    // -- IMPORTS

    import { toastEmitter } from '$lib/toast';
    import ToastMessage from './ToastMessage.svelte';

    // -- VARIABLES

    let messageArray = [];

    // -- FUNCTIONS

    function onReceiveToastMessage(
        toastInformation
        )
    {
        messageArray = messageArray.concat( toastInformation );
    }

    // ~~

    function handleRemoveToastMessageByToastId(
        toastId
        )
    {
        messageArray = []
    }

    // STATEMENTS

    toastEmitter.on( 'toast', onReceiveToastMessage );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .toast-container
    {
        z-index: 9999;
        position: fixed;
        top: 6rem;
        left: 50%;
        transform: translateX( -50% );

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

<div class="toast-container">
    {#each messageArray as message }
        <ToastMessage message={ message } onRemove={ handleRemoveToastMessageByToastId }/>
    {/each}
</div>
