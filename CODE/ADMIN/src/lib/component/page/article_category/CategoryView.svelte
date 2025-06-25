<script>
    // -- IMPORTS

    import { toast } from '$lib/toast';
    import { articleCategoryArrayStore } from '$store/articleCategoryArrayStore';
    import { fetchData } from '$lib/base';
    import { get } from 'svelte/store';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { getStorageImagePath } from '$lib/storage';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { urlParamsStore } from '$store/urlParamsStore';
    import Button from '$component/element/Button.svelte';
    import Input from '$component/element/Input.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import Select from '$component/element/Select.svelte';

    // -- VARIABLES

    /** @type {{category: any, isSubmitting?: boolean}} */
    let { category = $bindable(), isSubmitting = $bindable(false) } = $props();
    let createdAt = $state(formatTimestampToISO( category.creationTimestamp ));
    let updateAt = $state(formatTimestampToISO( category.updateTimestamp ));

    // -- FUNCTIONS

    async function handleSave(
        )
    {
        isSubmitting = true;

        try
        {
            let updatedCategory =
                {
                    ...category,
                    creationTimestamp : new Date( createdAt  ).toISOString(),
                    updateTimestamp : new Date( updateAt  ).toISOString()
                };

            await fetchData(
                '/api/blog/article-categories/set-by-id',
                {
                    method : 'POST',
                    credentials : 'include',
                    body : JSON.stringify(
                        {
                            type : 'updateArticleCategoryById',
                            category : updatedCategory
                        }
                        ),
                }
                );

            articleCategoryArrayStore.update(
                ( articleCategory ) =>
                {
                    return articleCategory.id === category.id ? updatedCategory : articleCategory
                }
                );

            toast(
                {
                    text : 'category updated successfully',
                    variant : 'success'
                }
                );
        }
        catch ( error )
        {
            toast(
                {
                    text : 'Something went wrong',
                    variant : 'error'
                }
                );
        }
        finally
        {
            isSubmitting = false;
        }
    }

    // ~~

    function handleUpdateLocalizedInput(
        event
        )
    {
        category[ event.detail.name ] = event.detail.text;
    }

    // ~~

    function formatTimestampToISO(
        timestamp
        )
    {
        let date = new Date( timestamp );
        let isoString = date.toISOString();
        let formattedString = isoString.slice( 0, 16 );

        return formattedString;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    fieldset
    {
        border: 1px solid grayColor700;
        border-radius: 4px;
        padding: 1rem;

        display: grid;
        grid-template-columns: 1fr;
        row-gap: 0.5rem;
        column-gap: 1rem;
    }

    fieldset legend
    {
        color: grayColor500;
    }

    // -- CLASSES

    .category-accordion
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .accordion-actions
    {
        z-index: 100;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;

        border-top: 1px solid grayColor700;
        padding: 1rem;

        display: flex;
        justify-content: flex-end;
        align-items: center;

        background: grayColor950;
    }
</style>

<div class="category-accordion">
    <fieldset>
        <legend>{ getLocalizedText( 'Category¨fr:Catégorie¨de:Kategorie', $languageTagStore ) }</legend>

        <Input fullWidth label="ID" name="id" bind:value={ category.id }/>
        <InputLocalizedForm
            name="name"
            label="Name"
            itemsString={ category.name }
            languageArray={ $languageArrayStore }
            on:update={ handleUpdateLocalizedInput }
        />
        <Input fullWidth label="Number" name="number" bind:value={ category.number }/>
        <Input fullWidth type="datetime-local" label="Created at" name="creationTimestamp" bind:value={ createdAt }/>
        <Input fullWidth type="datetime-local" label="Updated at" name="updateTimestamp" bind:value={ updateAt }/>
    </fieldset>
</div>

<div class="accordion-actions">
    <Button loading={ isSubmitting } on:click={ handleSave }>
        Save
    </Button>
</div>
