<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import SubTermItem from './SubTermItem.svelte';

    // -- VARIABLES

    export let term =
    {
        number: 0,
        title: '',
        content:
        [
            '',
            ''
        ]
    };
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- STYLES

    .card
    {
        margin: 1rem;
        border: 1px solid greenColor600;
        border-radius: 5px;
        padding: 1rem;
        + media(desktop)
        {
            width: 70%;
        }
    }

    .card h3
    {
        margin: 1rem 1rem;

        font-size: 1.3rem;
        font-weight: bold;
        color: greenColor600;
    }

    .card-body
    {
        width: 100%;
    }
</style>

<div class="card">
    <h3>{ term.number }. { getLocalizedText( term.title, $languageTagStore ) }</h3>
    <div class="card-body">
        {#each term.content as text, index }
            <SubTermItem
                number={ term.number }
                index={ index }
                text={ getLocalizedText( text, $languageTagStore ) }
            />
        {/each}
    </div>
</div>
