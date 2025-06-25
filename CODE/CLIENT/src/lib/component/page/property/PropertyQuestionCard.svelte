<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import { fetchData } from '$src/lib/base';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import PropertyAnswerModal from '$component/page/property/PropertyAnswerModal.svelte';
    import PropertyQuestionModal from './PropertyQuestionModal.svelte';
    import ProfileImage from '../../layout/ProfileImage.svelte';

    // -- VARIABLES

    export let question;
    export let host;

    let isPropertyQuestionModalOpen = false;
    let isPropertyAnswerModalOpen = false;
    let loading = true;

    // -- STATEMENTS

     onMount(
        async () =>
        {
            let data = await fetchData(
                '/api/profile/get-by-id',
                {
                    method : 'POST',
                    headers : { 'Content-Type' : 'application/json' },
                    body : JSON.stringify(
                        {
                            type: 'searchByUserId',
                            userId: question.userId
                        }
                        )
                }
                );
            question.profile = data.profile;
            loading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    .question-card
    {
        overflow-y: auto;
        max-height: 16rem;
        min-width: 18rem;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        background-color: whiteColor;
    }

    .question-card-details
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .question-card-profile
    {
        display: flex;
        gap: 1rem;
    }

    .question-card-profile-name
    {
        display: flex;
        align-items: center;

        font-size: 1rem;
        font-weight: bold;
        color: grayColor;
    }

    .question-card-profile-edit-button
    {
        border-radius: 2rem;
        padding: 0.75rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: greenColor300;
    }

    .question-card-content
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .question-card-content-title
    {
        font-size: 1.2rem;
        font-weight: bold;
        color: blueColor;
    }

    .question-card-content-description
    {
        font-size: 1rem;
        color: grayColor;
    }

    .question-card-content-answer-button
    {
        border: 1px solid greenColor;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: greenColor;
    }

    .question-card-content-answer
    {
        font-size: 1rem;
        color: grayColor;
    }
</style>

{#if !loading }
    <article class="question-card">
        <div class="question-card-details">
            <div class="question-card-profile">
                <ProfileImage profile={ question.profile } size="medium" />
                <div class="question-card-profile-name">
                    { question.profile.firstName }
                    { question.profile.lastName }
                </div>
            </div>
            {#if $profileSignedInStore && question.answer === '' }
                {#if $profileSignedInStore.userId === question.profile.userId }
                    <button
                        class="question-card-profile-edit-button"
                        on:click={ () => isPropertyQuestionModalOpen = true }
                    >
                        <div class="white-pencil-icon size-100"/>
                    </button>
                {/if}
            {/if}
        </div>
        <div class="question-card-content">
            <div class="question-card-content-title">
                { getLocalizedText( question.title, $languageTagStore ) }
            </div>
            <div class="question-card-content-description">
                { getLocalizedText( question.text, $languageTagStore ) }
            </div>
            {#if $profileSignedInStore }
                {#if question.answer === '' && $profileSignedInStore.userId === host.userId }
                    <button
                        class="question-card-content-answer-button"
                        on:click={ () => isPropertyAnswerModalOpen = true }
                    >
                        { getLocalizedTextBySlug( 'answer-question-button', $languageTagStore ) }
                    </button>
                {:else}
                    <div class="question-card-content-answer">
                        { getLocalizedText( question.answer, $languageTagStore ) }
                    </div>
                {/if}
            {/if}
        </div>
        {#if isPropertyAnswerModalOpen }
            <PropertyAnswerModal
                bind:question={ question }
                bind:isOpen={ isPropertyAnswerModalOpen }
            />
        {/if}
        {#if isPropertyQuestionModalOpen }
            <PropertyQuestionModal
                bind:question={ question }
                bind:isOpen={ isPropertyQuestionModalOpen }
            />
        {/if}
    </article>
{/if}
