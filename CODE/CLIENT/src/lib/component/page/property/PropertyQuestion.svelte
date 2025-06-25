<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import PropertyQuestionCard from '$component/page/property/PropertyQuestionCard.svelte';
    import PropertyQuestionModal from './PropertyQuestionModal.svelte';

    // -- VARIABLES

    export let questionArray = [];
    export let propertyId;
    export let host;

    let isPropertyQuestionModalOpen = false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    .property-question-container
    {
        border-top: 1px solid lightGrayBorderColor;
        padding: 1.5rem 0;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .property-question-list
    {
        overflow-x: auto;
        max-width: 40rem;

        display: flex;
        flex-direction: row;
        gap: 1.5rem;
    }

    .property-question-button
    {
        display: flex;
        justify-content: center;
    }

    .question-button
    {
        width: 100%;
        max-width: 22rem;
        border-radius: 1rem;
        padding: 1rem;

        background-color: blueColor;
    }
</style>

<section class="property-question-container">
    <div class="font-size-110 font-weight-700 color-gray-100">
        { getLocalizedTextBySlug( 'questions-label', $languageTagStore ) }
    </div>
    {#if questionArray.length > 0 }
        <div class="property-question-list">
            {#each questionArray as question }
                <PropertyQuestionCard
                    question={ question }
                    host={ host }
                />
            {/each}
        </div>
    {:else}
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'questions-not-found-label', $languageTagStore ) }
        </div>
    {/if}
    <div class="property-question-button">
        <button
            class="question-button font-weight-700"
            disabled={ !$profileSignedInStore || $profileSignedInStore.userId == host.userId }
            on:click={ () => { isPropertyQuestionModalOpen = true } }
        >
            { getLocalizedTextBySlug( 'ask-question-label', $languageTagStore ) }
        </button>
    </div>
    {#if isPropertyQuestionModalOpen == true }
        <PropertyQuestionModal
            bind:questionArray={ questionArray }
            bind:isOpen={ isPropertyQuestionModalOpen }
            propertyId={ propertyId }
        />
    {/if}
</section>
