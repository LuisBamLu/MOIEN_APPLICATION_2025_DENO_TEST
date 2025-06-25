<script>
    // -- IMPORTS

    import ModalButton from '$component/modal/ModalButton.svelte';

    // -- VARIABLES

    export let text = '';
    export let onClick = () => {};
</script>

<ModalButton
    text={ text }
    variant="light"
    fullWidth={ false }
    on:click={ onClick }
/>
<slot/>
