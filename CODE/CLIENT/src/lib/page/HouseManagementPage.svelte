<script>
    // -- IMPORTS

    import { onMount } from "svelte";
    import Loading from "$component/element/Loading.svelte";
    import HouseManagementTermSelection from '$component/page/house-management/HouseManagementTermSelection.svelte'
    import HouseManagementOptions from '$component/page/house-management/HouseManagementOptions.svelte'
    import HouseManagementStatistics from '$component/page/house-management/HouseManagementStatistics.svelte'
    import { fetchData } from "../base";

    // -- VARIABLES

    export let propertyId;
    let isLoading = true;
    let selectedTerm = null;
    let propertyData = null;

    // -- FUNCTIONS

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let data = await fetchData(
                    `/api/page/property/${ propertyId }`,
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                )
                propertyData = data;
            }
            catch ( error )
            {
                console.error( 'Error fetching property data:', error );
            }
            finally
            {
                isLoading = false;
            }
        }
    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .house-management
    {
        display flex
        flex-direction column
        align-items center
        justify-content center
        height 100vh
        width 100vw

        +media( desktop )
        {
            padding 0 10vw
        }
    }
</style>

{#if isLoading }
    <Loading />
{:else}
    <div class="house-management">
        <HouseManagementTermSelection bind:selectedTerm />
        <HouseManagementOptions bind:selectedTerm />
        <HouseManagementStatistics bind:selectedTerm { propertyData } />
    </div>
{/if}
