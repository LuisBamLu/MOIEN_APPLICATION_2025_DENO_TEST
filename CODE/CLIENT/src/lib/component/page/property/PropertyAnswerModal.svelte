<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { slide } from 'svelte/transition';
    import { fetchData } from '$src/lib/base';

    // -- VARIABLES

    export let isOpen;
    export let question;
    let modal;
    let answer = '';

    // -- FUNCTIONS

    async function handleSubmit(
        )
    {
        if ( answer === '' )
        {
            alert( 'Please fill in all fields' );
            return;
        }

        let profile = question.profile;
        delete question.profile;
        question.answer = answer;

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
        isOpen = false;
    }

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
                    document.addEventListener('click', handleClickOutside);
                },
                500
                );

            return () => { document.removeEventListener( 'click', handleClickOutside ) };
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    .property-answer-modal
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

    .answer-modal
    {
        min-width: 18rem;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        background-color: whiteColor;
    }

    .answer-modal-head
    {
        min-width: 18rem;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        background-color: whiteColor;
    }

    .answer-modal-body
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .answer-form-vertical
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .answer-form-input
    {
        border: 1px solid grayColor700;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;

        background-color: grayColor900;
    }

    .answer-button
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
    class="property-answer-modal"
    transition:slide
>
    <div
        class="answer-modal"
        bind:this={ modal }
    >
        <div class="answer-modal-head">
            <div class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'answer-question-title-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedText( question.text, $languageTagStore ) }
            </div>

        </div>
        <div class="answer-modal-body">
            <form
                class="answer-form-vertical"
                on:submit|preventDefault={ handleSubmit }
            >
                <textarea
                    class="answer-form-input color-gray-100"
                    rows="5"
                    maxlength="255"
                    bind:value={ answer }
                />
                <button
                    class="answer-button"
                    type="submit"
                >
                    <div class="font-size-100 font-weight-700 color-white">
                        { getLocalizedTextBySlug( 'ask-answer-button-label', $languageTagStore ) }
                    </div>
                </button>
            </form>
        </div>
    </div>
</div>
