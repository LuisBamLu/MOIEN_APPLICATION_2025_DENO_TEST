<script>
    import { fly } from 'svelte/transition';

    // -- IMPORTS

    import ProfileImage from '../../layout/ProfileImage.svelte';
    import { cubicOut } from 'svelte/easing';

    // -- VARIABLES

    export let profile;
    export let text;
    export let propertyName;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .mini-card
    {
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;

        background-color: whiteColor;

        transition: all 400ms ease-in-out;
        &:hover
        {
            border-color: greenColor800;

            background-color: greenColor950;
        }
    }

    .mini-card-container
    {
        width: 100%;
        padding: 0.5rem;

        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            padding: 1rem;
        }
    }

    .mini-card-text-container
    {
        width: 70%;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .mini-card-text-container > div
    {
        overflow: hidden;
        max-width: clamp(  20ch, 55dvw, 40ch );

        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>

<button
    class="mini-card"
    in:fly={ { x: 350, delay: 350, duration: 500, easing: cubicOut } }
    out:fly={ { x: 350, delay: 350, duration: 500, easing: cubicOut } }
    on:click
>
    <div class="mini-card-container">
        <ProfileImage profile={ profile } size="extra-large" />
        <div class="mini-card-text-container">
            <div class="font-size-90 font-weight-700 color-gray-300">
                { propertyName }
            </div>
            <div class="font-size-90 font-weight-700 color-gray-100">
                { profile.firstName }
            </div>
            <div class="font-size-75 font-weight-500 color-gray-300">
                { text }
            </div>
        </div>
    </div>
</button>
