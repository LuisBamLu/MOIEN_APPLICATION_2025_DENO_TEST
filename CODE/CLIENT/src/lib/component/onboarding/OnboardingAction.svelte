<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalButton from '../modal/ModalButton.svelte';

    // -- VARIABLES

    export let goToNextStep;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .onboarding-action
    {
        z-index: 9999;

        width: 100%;
        padding: 1rem 1rem 2rem;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;

        background-color: grayColor900;

        +media( desktop )
        {
            border-top: 1px solid grayColor800;
            padding: 1rem 1.5rem;
        }
    }
</style>

<div class="onboarding-action">
    <ModalButton
        variant="light"
        text={ getLocalizedTextBySlug( 'onboarding-skip-label' ) }
        on:click={ goToNextStep }
    />
    <ModalButton
        variant="contained"
        text={ getLocalizedTextBySlug( 'onboarding-next-label' ) }
        on:click={ goToNextStep }
    />
</div>
