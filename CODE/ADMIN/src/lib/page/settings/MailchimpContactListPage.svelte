<script>
    // -- IMPORTS

    import
        {
            handleCreateMailchimpContact,
            isMailchimpContactModalOpen,
            isSubmitting,
            loadMailchimpContactArray,
            mailchimpContactArrayStore,
            selectedMailchimpContactStore,
            toggleMailchimpContactModal,
            isFormModified as isMailchimpContactFormModified,
            handleChange,
            hasMoreContactPage,
            isContactLoading,
            handleEditMailchimpContact,
            handleDeleteMailchimpContact
        } from '$store/mailchimpContactStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import Status from '$component/element/Status.svelte';
    import { onDestroy } from 'svelte';
    import Input from '$component/element/Input.svelte';
    import { countryArrayStore } from '$store/countryArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import Select from '$component/element/Select.svelte';
    import { formatPercentage, getFormattedBirthday, isNullOrUndefined } from '$lib/base';

    // -- CONTANTS

    const titleSlugMap =
        {
            editTitle: 'edit-mailchimp-contact-label',
            addTitle: 'add-mailchimp-contact-label'
        };

    // -- VARIABLES

    let errorMap = {};
    let filterParameterByKeyMap =
        {
            email:
                {
                    type: 'text',
                    name: 'E-mail',
                    value: ''
                },
            firstName:
                {
                    type: 'text',
                    name: 'First Name',
                    value: ''
                },
            lastName:
                {
                    type: 'text',
                    name: 'Last Name',
                    value: ''
                },
            addressLine1:
                {
                    type: 'text',
                    name: 'Address',
                    value: ''
                },
            phoneNumber:
                {
                    type: 'text',
                    name: 'Phone Number',
                    value: ''
                },
            birthday:
                {
                    type: 'text',
                    name: 'Birthday',
                    value: ''
                },
            tagArray:
                {
                    type: 'tag',
                    name: 'Tags',
                    value: ''
                },
            formattedStatus:
                {
                    type: 'element',
                    name: 'Email Marketing',
                    value: ''
                },
            formattedSource:
                {
                    type: 'text',
                    name: 'Source',
                    value: ''
                },
            memberRating:
                {
                    type: 'rating',
                    name: 'Rating',
                    value: ''
                },
            timestampOpt:
                {
                    type: 'date',
                    name: 'Contact Date Added',
                    value: ''
                },
            lastChanged:
                {
                    type: 'date',
                    name: 'Last Changed',
                    value: ''
                },
        };

    // -- FUNCTIONS

    function arrayProcessing(
        )
    {
    }

    // ~~

    async function handleNearBottom(
        )
    {
        if ( $hasMoreContactPage && !$isContactLoading )
        {
            await loadMailchimpContactArray( 10, $mailchimpContactArrayStore.length );
            arrayProcessing();
        }
    }

    // -- STATEMENTS

    onDestroy(
        () =>
        {
            isMailchimpContactModalOpen.set( false );
            selectedMailchimpContactStore.set( {} );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .perfomance-container
    {
        margin-top: 1.5rem;
        width: 100%;
    }

    .perfomance-content
    {
        width: 100%;
        border: 1px solid grayColor800;
        border-radius: 1rem;
        padding: 1.25rem 2rem;

        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: 50% 50%;
        gap: 1rem;

        background: whiteColor;
    }

    .perfomance-content-text
    {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: flex-start;
        align-items: center;

        text-align: center;
    }

    .input-row
    {
        width: 100%;
    }
</style>

<AdminPage
    pageTitle="admin-menu-mailchimp-contact-manager-label"
    selectedObject={ selectedMailchimpContactStore }
    objectArrayStore={ mailchimpContactArrayStore }
    isObjectModalOpen={ isMailchimpContactModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadMailchimpContactArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreateMailchimpContact( arrayProcessing ) }
    handleEditObject={ () => handleEditMailchimpContact( arrayProcessing ) }
    handleDeleteObject={ () => handleDeleteMailchimpContact( arrayProcessing ) }
    toggleObjectModal={ toggleMailchimpContactModal }
    showButton={ hasUserPermission( 'add-mailchimp-contact' ) }
    isFormModified={ $isMailchimpContactFormModified }
    search={ false }
    isSubmitting={ $isSubmitting }
    handleNearBottom={ handleNearBottom }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Perfomance</span>
            <div class="perfomance-container">
                <div class="perfomance-content">
                    <div class="perfomance-content-text">
                        <p class="font-size-200">{ formatPercentage( $selectedMailchimpContactStore[ 'campaignMetricsStatMap' ][ 'averageOpenRate' ] ) }</p>
                        <p class="font-size-75">{ getLocalizedTextBySlug( 'mailchimp-email-open-rate-label', $languageTagStore ) }</p>
                    </div>

                    <div class="perfomance-content-text">
                        <p class="font-size-200">{ formatPercentage( $selectedMailchimpContactStore[ 'campaignMetricsStatMap' ][ 'averageClickRate' ] ) }</p>
                        <p class="font-size-75">{ getLocalizedTextBySlug( 'mailchimp-email-click-rate-label', $languageTagStore ) }</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">E-mail address</span>
            <Input
                type="email"
                bind:value={ $selectedMailchimpContactStore[ 'email' ] }
                fullWidth={ true }
                name="email"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">First name</span>
            <Input
                type="text"
                bind:value={ $selectedMailchimpContactStore[ 'firstName' ] }
                fullWidth={ true }
                name="firstName"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Last name</span>
            <Input
                type="text"
                bind:value={ $selectedMailchimpContactStore[ 'lastName' ] }
                fullWidth={ true }
                name="lastName"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Address line 1</span>
            <Input
                type="text"
                bind:value={ $selectedMailchimpContactStore[ 'addressLine1' ] }
                fullWidth={ true }
                name="addressLine1"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Address line 2</span>
            <Input
                type="text"
                bind:value={ $selectedMailchimpContactStore[ 'addressLine2' ] }
                fullWidth={ true }
                name="addressLine2"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">City</span>
            <Input
                type="text"
                bind:value={ $selectedMailchimpContactStore[ 'city' ] }
                fullWidth={ true }
                name="city"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">State</span>
            <Input
                type="text"
                bind:value={ $selectedMailchimpContactStore[ 'state' ] }
                fullWidth={ true }
                name="state"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Zip code</span>
            <Input
                type="text"
                bind:value={ $selectedMailchimpContactStore[ 'zipCode' ] }
                fullWidth={ true }
                name="zipCode"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Country</span>
            <Select fullWidth={ true } name="countryCode" bind:value={ $selectedMailchimpContactStore[ 'countryCode' ] }>
                {#each $countryArrayStore as country }
                    <option value={ country.code }>{ getLocalizedText( country?.name || '', $languageTagStore ) }</option>
                {/each}
            </Select>
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Phone number</span>
            <Input
                type="text"
                bind:value={ $selectedMailchimpContactStore[ 'phoneNumber' ] }
                fullWidth={ true }
                name="phoneNumber"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Birthday</span>
            <Input
                type="text"
                value={ $selectedMailchimpContactStore[ 'birthday' ] }
                on:change={ ( event ) => $selectedMailchimpContactStore[ 'birthday' ] = getFormattedBirthday( event.detail ) }
                placeholder="MM/DD"
                fullWidth={ true }
                name="birthday"
                max={ 5 }
                error={ !!errorMap[ 'birthday' ] }
                helperText={ errorMap[ 'birthday' ] || '' }
            />
        </div>
    </form>
</AdminPage>
