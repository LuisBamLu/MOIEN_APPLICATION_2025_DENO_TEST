<script>
    // -- VARIABLES

    export let title = '';
    export let onClose = () => {};
    export let hasPreviousSteps = false;
    export let previousStep = () => {};
    export let isCloseDisabled = false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .modal-header
    {
        position: relative;

        border-bottom: 1px solid grayColor700;
        padding: 1.25rem 0px;

        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        align-items: center;
        align-self: stretch;

        background: grayColor900;
    }

    .modal-header-title
    {
        width: 100%;

        text-align: center;
    }

    .modal-header-back-button
    {
        position: absolute;
        top: 1.28rem;
        left: 1.5rem;

        cursor: pointer;
        transition: all 200ms ease-in-out;
    }

    .modal-header-back-button:hover
    {
        background: blueColor300;
    }

    .modal-header-back-button:active
    {
        transform: scale( 0.9 );
    }

    .modal-header-close-button
    {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;

        cursor: pointer;
        transition: all 200ms ease-in-out;
    }

    .modal-header-close-button:hover
    {
        background: redColor300;
    }

    .modal-header-close-button:active
    {
        transform: scale( 0.9 );
    }
</style>

<header class="modal-header">
    {#if hasPreviousSteps }
        <button on:click={ previousStep } class="green-left-caret-icon size-150 modal-header-back-button"/>
    {/if}
    <span class="font-size-100 font-weight-700 color-gray-100 modal-header-title">{ title }</span>
    <button disabled={ isCloseDisabled } on:click={ onClose } class="gray-close-icon size-90 modal-header-close-button"/>
</header>
