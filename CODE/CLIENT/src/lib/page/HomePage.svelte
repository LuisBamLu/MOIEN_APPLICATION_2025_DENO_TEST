<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Home from '$component/page/home/Home.svelte';
    import Seo from '../component/element/Seo.svelte';
    import { platform  } from '../base';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( platform !== 'web' )
            {
                navigate( '/search' );
            }
        }
        );
</script>

<Seo
    title={ getLocalizedTextBySlug( 'home-page-head-title', $languageTagStore ) }
    metaTitle="Moïen - Rent, sublet, live and travel!"
    metaDescription="Discover a new rental experience and simplify your procedures with Moïen."
    url="https://moien.com/"
    path=""
/>
<Home/>
