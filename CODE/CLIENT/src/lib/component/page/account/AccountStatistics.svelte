<script>
    // -- IMPORTS

    import { fetchData, getFormattedPrice, getPercentage } from '$src/lib/base';
    import { onMount } from 'svelte';
    import { getFormattedNumberText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';

    // -- VARIABLES

    let analiticMap =
        {
            'account-statistics-evaluation-label': 4.3,
            'account-statistics-commentaires-label': 40,
            'account-statistics-response-rate-label': 4.3,
            'account-statistics-consultations-label': 105,
            'account-statistics-current-month-revenues-label': '400 €',
            'account-statistics-annual-income-label': '20 500 € ',
            'account-statistics-reservations-label': 6,
            'account-statistics-upcoming-label': 12,
        };
    let isLoading = true;
    let month;
    let capitalizedMonth;

    // -- STATEMENTS

    onMount(
        async ( ) =>
        {
            let pageData
                = await fetchData(
                    '/api/page/statistics',
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                    );

            let formatter = new Intl.NumberFormat( $languageTagStore, { maximumFractionDigits: 2 } );

            analiticMap[ 'account-statistics-evaluation-label' ] = formatter.format( pageData.averageRating );
            analiticMap[ 'account-statistics-commentaires-label' ] = pageData.userReviewCount;
            analiticMap[ 'account-statistics-response-rate-label' ] = getPercentage( pageData.responseRate );
            analiticMap[ 'account-statistics-consultations-label' ] = pageData.visitCount;
            analiticMap[ 'account-statistics-reservations-label' ] = pageData.pastRentalBookingCount;
            analiticMap[ 'account-statistics-upcoming-label' ] = pageData.upcomingRentalBookingCount;
            analiticMap[ 'account-statistics-annual-income-label' ]
                = getFormattedPrice( pageData.currentYearTotalEarning, $languageTagStore );
            analiticMap[ 'account-statistics-current-month-revenues-label' ]
                = getFormattedPrice( pageData.currentMonthTotalEarning, $languageTagStore );

            isLoading = false;
        }
        )

    $: month = new Date().toLocaleDateString( $languageTagStore, { month: 'long' } );
    $: capitalizedMonth = month.charAt( 0 ).toUpperCase() + month.slice( 1 );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl'

    // -- CLASSES

    .account-finance-statistics-container
    {
        padding: 2rem 0;

        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        +media( tablet )
        {
            grid-template-columns: 1fr 1fr 1fr;
        }

        +media( desktop )
        {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
        }
    }

    .account-finance-statistics-box
    {
        border: 2px solid grayColor800;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex: 1 1 10rem;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        background: grayColor950;

        +media( desktop )
        {
            height: 7.5rem;
        }
    }
</style>

{#if isLoading }
    <Loading />
{:else}
    <div class="account-finance-statistics-container">
        {#each Object.entries( analiticMap ) as [ analiticName, analiticValue ] }
            <div class="account-finance-statistics-box">
                <span class="font-size-75 font-weight-500 color-gray-300">
                    {#if analiticName === 'account-statistics-current-month-revenues-label' }
                        { capitalizedMonth }
                        { getLocalizedTextBySlug( 'revenue-label', $languageTagStore ) }
                    {:else}
                        { getLocalizedTextBySlug( analiticName, $languageTagStore ) }
                    {/if}
                </span>
                <span class="font-size-125 font-weight-600 color-blue">{ analiticValue }</span>
            </div>
        {/each}
    </div>
{/if}
