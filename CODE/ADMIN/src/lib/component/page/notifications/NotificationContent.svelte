<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { typeArrayStore, mediumArrayStore } from '$store/notificationStore';
    import Input from '$component/element/Input.svelte';
    import Select from '$component/element/Select.svelte';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{notification?: any}} */
    let { notification = $bindable({
            notificationMediumArray : [],
            notificationType : ''
        }) } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- ELEMENTS

    fieldset
    {
        display: flex;
        flex-direction: column;
    }

    fieldset legend
    {
        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 700;
    }

    input[type="checkbox"]
    {
        display: none;
    }

    input[type="checkbox"]:checked ~ .cbx
    {
        border: 1px solid greenColor500;

        background: greenColor500;

        color: whiteColor;
    }

    input[type="checkbox"]:checked ~ .cbx:after
    {
        content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjI4ODYgMi42MzQ3N0w2LjIzNDEyIDkuMzY0NzdMMi43MTI4OSA1Ljk5OTc3IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiLz4KPC9zdmc+Cg==");
    }

    // -- CLASSES

    .cbx-container
    {
        padding: 0.25rem 0;

        display: inline-flex;
        gap: 0.75rem;
        align-items: center;

        line-height: 1.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: grayColor500;
    }

    .notification-modal-content
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .cbx
    {
        height: 1rem;
        width: 1rem;
        border: 1px solid grayColor600;
        border-radius: 0.875rem;
        padding: 0.625rem;

        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        justify-content: center;
        align-items: center;

        background: grayColor800;

        cursor: pointer;
    }

    .is-selected
    {
        font-weight: 700;
        color: grayColor;
    }
</style>

<div class="notification-modal-content">
    <div class="font-weight-700 font-size-90 color-gray-100">
        { getLocalizedTextBySlug( 'title-label' ) }
    </div>
    <Input
        placeholder={ getLocalizedTextBySlug( 'title-helper', $languageTagStore ) }
        bind:value={ notification.title }
        required
        fullWidth
    />
    <div class="font-weight-700 font-size-90 color-gray-100">
        { getLocalizedTextBySlug( 'text-message-label', $languageTagStore ) }
    </div>
    <Input
        placeholder={ getLocalizedTextBySlug( 'text-message-helper', $languageTagStore ) }
        bind:value={ notification.message }
        multiline
        rows={ 4 }
        required
        fullWidth
    />
    <fieldset>
        <legend>{ getLocalizedTextBySlug( 'channel-label', $languageTagStore ) }</legend>

        {#each $mediumArrayStore as notificationMedium }
            <div class="cbx-container" class:is-selected={ notification.notificationMediumArray && notification.notificationMediumArray.includes( notificationMedium.id ) }>
                <input
                    value={ notificationMedium.id }
                    bind:group={ notification.notificationMediumArray }
                    type="checkbox"
                    name="notificationMedium"
                    id={ notificationMedium.id }
                />
                <label class="cbx" for={ notificationMedium.id }></label>
                { notificationMedium.name }
            </div>
        {/each}
    </fieldset>
    <div class="font-weight-700 font-size-90 color-gray-100">
        { getLocalizedTextBySlug( 'day-label', $languageTagStore ) }
    </div>
    <Input
        bind:value={ notification.date }
        type="datetime-local"
        shrink
        fullWidth
        allowPast={ false }
    />
    <div class="font-weight-700 font-size-90 color-gray-100">
        { getLocalizedTextBySlug( 'action-label', $languageTagStore ) }
    </div>
    <Select
        bind:value={ notification.notificationType }
        required
        fullWidth
    >
        {#each $typeArrayStore as notificationType }
            <option value={ notificationType.id }>
                { notificationType.name }
            </option>
        {/each}
    </Select>
</div>
