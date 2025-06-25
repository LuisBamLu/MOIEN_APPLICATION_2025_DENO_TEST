<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { cityArrayStore } from '$store/cityArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import CitySelectModal from '$component/page/ad/CitySelectModal.svelte';

    // -- VARIABLES

    export let cityName = '';
    export let cityId = '';
    export let city = {};
    let isEditing = false;
</script>

<Accordion
    label={ getLocalizedTextBySlug( 'personal-information-city', $languageTagStore ) }
    value={ cityName }
    bind:isEditing={ isEditing }
>
    <CitySelectModal
        cityArray={ $cityArrayStore }
        bind:isEditingCity={ isEditing }
        bind:selectedCityName={ cityName }
        bind:selectedCityId={ cityId }
        bind:selectedCity={ city }
    />
</Accordion>
