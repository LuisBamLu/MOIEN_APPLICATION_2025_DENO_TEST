<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import Alert from '$component/element/Alert.svelte';
    import PersonalDetailInput from '$component/page/account/PersonalDetailInput.svelte';
    import PhoneNumberInputs from '$component/page/account/PhoneNumberInputs.svelte';
    import AccountSupportingDocuments from './AccountSupportingDocuments.svelte';
    import { genderArrayStore, genderByIdMapStore } from '$store/genderStore';
    import LabelledSelect from '$component/element/LabelledSelect.svelte';
    import LabelledInput from '$component/element/LabelledInput.svelte';
    import Loading from '$component/element/Loading.svelte';
    import { onMount } from 'svelte';
    import AddressSection from './AddressSection.svelte';
    import PersonalInformationSection from './PersonalInformationSection.svelte';

    // -- VARIABLES

    let isLoading = true;

    // -- STATEMENTS

    $: profile = $profileSignedInStore

    onMount(
        async () =>
        {
            isLoading = false;
        }
    )
</script>

<style lang='stylus'>
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    :global( .personal-detail-button )
    {
        margin: 1.5rem 0 2rem;
        width: 100%;
        border: 2px solid greenColor;
        border-radius: 0.75rem;
        padding: 1rem 0;
    }
</style>

{#if isLoading}
    <Loading />
{:else}
<div class="personal-detail-group">
    <PersonalInformationSection profile={ profile }/>
</div>
<div class="personal-detail-group">
    <AddressSection profile={ profile }/>
    {#if $profileSignedInStore.governmentIdValidationStatusId === 'accepted' }
        <div class="margin-top-150 margin-bottom-150">
            <Alert
                type="success"
                text={ getLocalizedTextBySlug( 'personal-information-proof-of-identity-verified', $languageTagStore ) }
            />
        </div>
    <!-- {:else if $profileSignedInStore.governmentId }
        <div class="margin-top-150 margin-bottom-150">
            <Alert
                type="info"
                text={ getLocalizedTextBySlug( 'personal-information-proof-of-identity-pending', $languageTagStore ) }
            />
        </div> -->
    {:else}
        {#if $profileSignedInStore.governmentIdValidationStatusId === 'declined' }
            <div class="margin-top-150 margin-bottom-150">
                <Alert
                    type="error"
                    text={ getLocalizedTextBySlug( 'personal-information-proof-of-identity-declined', $languageTagStore ) }
                />
            </div>
        {:else}
            <div class="margin-top-150 margin-bottom-150">
                <Alert
                    type="warning"
                    text={ getLocalizedTextBySlug( 'personal-information-proof-of-identity-warning', $languageTagStore ) }
                />
            </div>
        {/if}
        <AccountSupportingDocuments/>
    {/if}
</div>
{/if}
