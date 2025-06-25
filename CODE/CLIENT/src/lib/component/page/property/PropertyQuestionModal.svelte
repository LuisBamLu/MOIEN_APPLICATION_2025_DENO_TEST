<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { getLocalizedTextBySlug, getRandomTuid } from 'senselogic-gist';
    import { slide } from 'svelte/transition';
    import { fetchData } from '$src/lib/base';

    // -- VARIABLES

    export let isOpen;
    export let propertyId = '';
    export let questionArray = [];
    export let question =
        {
            id: getRandomTuid(),
            propertyId: propertyId,
            userId: $profileSignedInStore.userId,
            title: '',
            text: '',
            answer: '',
        };
    let modal;

    // -- FUNCTIONS

    async function handleSubmit(
        )
    {
        if ( question.title === '' || question.text === '' )
        {
            alert( 'Please fill in all fields' );
            return;
        }

        if ( propertyId === '' )
        {
            let profile = question.profile;
            delete question.profile;

            await fetchData(
                '/api/property/question/set',
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            type: 'updateQuestion',
                            question: question
                        }
                        ),
                    headers: { 'Content-Type': 'application/json' }
                }
                );

            question.profile = profile;
        }
        else
        {
            await fetchData(
                '/api/property/question/add',
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            type: 'addQuestion',
                            question: question
                        }
                        ),
                    headers: { 'Content-Type': 'application/json' }
                }
                );

            questionArray.push( question );
        }

        isOpen = false;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            const handleClickOutside =
                ( event ) =>
                {
                    if ( modal && !modal.contains( event.target ) )
                    {
                        isOpen = false;
                    }
                };

            setTimeout(
                () =>
                {
                    document.addEventListener( 'click', handleClickOutside );
                },
                500
                );

            return () => document.removeEventListener( 'click', handleClickOutside );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    .property-question-modal
    {
        z-index: 1000;
        position: fixed;
        top: 4rem;
        bottom: 0;
        left: 0;
        right: 0;

        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: rgba( 0, 0, 0, 0.5 );
    }

    .question-modal
    {
        min-width: 18rem;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        background-color: whiteColor;
    }

    .question-modal-head
    {
        min-width: 18rem;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        background-color: whiteColor;
    }

    .question-modal-body
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .question-form-vertical
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .question-form-input
    {
        border: 1px solid grayColor700;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;

        background-color: grayColor900;
    }

    .question-button
    {
        border: 1px solid greenColor;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: greenColor;
    }
</style>

<div
    class="property-question-modal"
    transition:slide
>
    <div
        class="question-modal"
        bind:this={ modal }
    >
        <div class="question-modal-head">
            <div class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'ask-question-title-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedTextBySlug( 'ask-question-helper', $languageTagStore ) }
            </div>
        </div>
        <div class="question-modal-body">
            <form
                class="question-form-vertical"
                on:submit|preventDefault={ handleSubmit }
            >
                <input
                    class="question-form-input"
                    type="text"
                    bind:value={ question.title }
                    placeholder="Name your question"
                />
                <textarea
                    class="question-form-input color-gray-100"
                    rows="5"
                    maxlength="255"
                    bind:value={ question.text }
                    placeholder="Ask your question"
                />
                <button
                    class="question-button"
                    type="submit"
                >
                    <div class="font-size-100 font-weight-700 color-white">
                        { getLocalizedTextBySlug( 'ask-question-button-label', $languageTagStore ) }
                    </div>
                </button>
            </form>
        </div>
    </div>
</div>
