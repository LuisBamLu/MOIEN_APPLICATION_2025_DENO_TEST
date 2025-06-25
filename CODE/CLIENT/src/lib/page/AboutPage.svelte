<script>
    // -- IMPORTS

    import BlogFeaturedArticle from '$component/page/blog/BlogFeaturedArticle.svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import DiscoverMoien from '$component/page/blog/DiscoverMoien.svelte';
    import BlogFooter from '$component/layout/BlogFooter.svelte';
    import Seo from '../component/element/Seo.svelte';
    import DivBackground from '../component/element/DivBackground.svelte';

    // -- CONSTANTS

    const aboutUsText =
    [
        `
            About Us
                ¨fr:À propos de nous
                ¨de:Über uns
        `,
        `
            Moïen means 'Hello' 'Bonjour', 'Guten Morgen', 'Olá' in Luxembourgish. It's the first word you say when you enter a place. So it's only natural that we chose this name to define our company.
                ¨fr:Moïen signifie « Hello », « Bonjour », « Guten Morgen », « Olá » en luxembourgeois. C'est le premier mot que l'on prononce en entrant dans un lieu. C'est donc tout naturellement que nous avons choisi ce nom pour définir notre entreprise.
                ¨de:Moïen bedeutet „Hello“, „Bonjour“, „Guten Morgen“, „Olá“ auf Luxemburgisch. Es ist das erste Wort, das man sagt, wenn man einen Ort betritt. Es ist also nur natürlich, dass wir diesen Namen gewählt haben, um unser Unternehmen zu definieren.
        `,
        `
            Moïen is a next-gen platform in rental real estate
                ¨fr:Moïen est une plateforme de nouvelle génération dans le domaine de l'immobilier locatif.
                ¨de:Moïen ist eine Plattform der nächsten Generation für Mietimmobilien.
        `,
        `
            Our ambition is to redefine the boundaries of the property rental market. Today, seasonal rentals and long-term rentals stand in stark contrast. Tomorrow, with Moïen, we aim to shake things up by offering innovative services that will turn established solutions on their head!
                ¨fr:Notre ambition est de redéfinir les frontières du marché de la location immobilière. Aujourd'hui, location saisonnière et location longue durée s'opposent. Demain, avec Moïen, nous voulons bousculer les choses en proposant des services innovants qui bousculent les solutions établies!
                ¨de:Unser Ziel ist es, die Grenzen des Vermietungsmarktes neu zu definieren. Heute stehen Saisonvermietung und Langzeitvermietung in krassem Gegensatz zueinander. In Zukunft wollen wir mit Moïen die Dinge aufmischen und innovative Dienstleistungen anbieten, die die etablierten Lösungen auf den Kopf stellen!
        `,
        `
            What can we offer you:
                ¨fr:Que pouvons-nous vous offrir:
                ¨de:Was können wir Ihnen bieten:
        `,
        `
            Our app offers short-term rentals at attractive prices, as well as fully digitalized long-term rentals, ensuring a seamless and user-friendly experience for all users.
                ¨fr:Notre application propose des locations de courte durée à des prix attractifs, ainsi que des locations de longue durée entièrement digitalisées, garantissant une expérience fluide et conviviale pour tous les utilisateurs.
                ¨de:Unsere App bietet sowohl Kurzzeitvermietungen zu attraktiven Preisen als auch vollständig digitalisierte Langzeitvermietungen, die eine nahtlose und benutzerfreundliche Erfahrung für alle Nutzer gewährleisten.
        `,
        `
            Last but not least, we'll soon be offering an innovative subletting service where tenants and owners share a common interest, making rental management more flexible and collaborative!
                ¨fr:Enfin, nous proposerons bientôt un service de sous-location innovant où locataires et propriétaires partagent un intérêt commun, rendant la gestion locative plus flexible et collaborative!
                ¨de:Nicht zuletzt werden wir bald einen innovativen Untervermietungsservice anbieten, bei dem Mieter und Eigentümer ein gemeinsames Interesse teilen, was die Mietverwaltung flexibler und kooperativer macht!
        `,
        `
            Stay tuned for more updates on how Moïen is transforming the rental landscape with cutting-edge technology and customer-focused solutions!
                ¨fr:Restez à l'écoute pour d'autres mises à jour sur la façon dont Moïen transforme le paysage de la location avec une technologie de pointe et des solutions axées sur le client!
                ¨de:Bleiben Sie dran und erfahren Sie mehr darüber, wie Moïen die Vermietungslandschaft mit modernster Technologie und kundenorientierten Lösungen umgestaltet!
        `
    ]

    // -- VARIABLES

    let aboutUsHeroData =
        {
            title: getLocalizedText( aboutUsText[ 0 ], $languageTagStore ),
            teaser: getLocalizedText( aboutUsText[ 1 ], $languageTagStore ),
            imagePath: '/global/onboarding/onboarding_property_type.avif'
        }

    let ctaHeroSectionData =
        {
            description: getLocalizedText( aboutUsText[ 7 ], $languageTagStore ),
            imagePath: '/image/about/france_housing.avif'
        }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- ELEMENTS

    .about-page
    {
        margin-top: 3rem;
        width: 100%;
        padding: 0 10vw;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            padding: 0 18%;
        }
    }

    .about-page-hero-section
    {
        padding: 1.5rem 1.2rem 3rem;

        +media( desktop )
        {
            padding: 0 0 4rem;
        }
    }

    .about-page-hero
    {
        width: 100%;
        border-radius: 0.5rem;
        padding: 2rem 2rem 2rem 3rem;

        display: flex;
        flex-direction: column-reverse;
        gap: 2.5rem;
        align-items: center;

        background-color: white;

        +media( desktop )
        {
            flex-direction: row-reverse;
        }
    }

    .about-page-hero-text
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        h1
        {
            font-size: 2rem;
            font-weight: 700;
            color: blueColor100;
        }

        p
        {
            font-size: 1rem;
            font-weight: 400;
            color: grayColor500;
        }
    }

    .divider
    {
        margin: 5rem 0;
        height: 1px;
        width: 100%;

        background-color: grayColor700;
    }

    .about-page-story
    {
        width: 100%;
        padding: 1.5rem 1.2rem 3rem;

        display: flex;
        flex-direction: column-reverse;
        gap: 3rem;

        +media( desktop )
        {
            padding: 0rem 0 6rem;

            flex-direction: row-reverse;
        }
    }

    .about-page-products
    {
        width: 100%;
        padding: 1.5rem 1.2rem 3rem;

        display: flex;
        flex-direction: column-reverse;
        gap: 3rem;

        +media( desktop )
        {
            padding: 2rem 0 6rem;

            flex-direction: row;
        }
    }

    .about-page-call-to-action-section
    {
        padding: 1.5rem 1.2rem 3rem;

        +media( desktop )
        {
            padding: 2rem 0 6rem;
        }
    }

    .about-page-call-to-action
    {
        width: 100%;
        border-radius: 0.5rem;
        padding: 2rem 2rem 2rem 3rem;

        display: flex;
        flex-direction: column-reverse;
        gap: 2.5rem;
        align-items: center;

        background-color: white;
        h3
        {
            width: 100%;

            font-size: 2rem;
            font-weight: 700;
            color: blueColor100;
        }

        +media( desktop )
        {
            flex-direction: row-reverse;
        }
    }

    .about-page-image
    {
        overflow: hidden;
        width: 96%;
        aspect-ratio: 1;
        border-radius: 0.5rem;

        object-fit: cover;

        +media( desktop )
        {
            max-width: 40%;
        }
    }

    .about-page-text
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        h2
        {
            font-size: 2rem;
            font-weight: 700;
            color: blueColor100;
        }

        p
        {
            font-size: 1.2rem;
            font-weight: 400;
            color: grayColor100;
        }
    }
</style>

<Seo
    title={ getLocalizedTextBySlug( 'about-page-head-title', $languageTagStore ) }
    metaTitle="Moïen - Rent, sublet, live and travel!"
    metaDescription="Discover a new rental experience and simplify your procedures with Moïen."
    url="https://moien.com/"
    path=""
/>

<article class="about-page">
    <BlogFeaturedArticle
        article={ aboutUsHeroData }
        --article-info-container-justify={ 'center' }
    />

    <div class="divider"/>

    <section class="about-page-story">
        <div class="about-page-image">
            <DivBackground
                isGlobal
                imagePath={ '/global/about/lisboa' }
                lowRes={ 360 }
                highRes={ 960 }
            />
        </div>
        <!-- <img class="about-page-image" src="/image/about/lisboa.avif" alt=""> -->
        <div class="about-page-text">
            <h2>{ getLocalizedText( aboutUsText[ 2 ], $languageTagStore ) }</h2>
            <p>{ getLocalizedText( aboutUsText[ 3 ], $languageTagStore ) }</p>
        </div>
    </section>
    <section class="about-page-products">
        <div class="about-page-image">
            <DivBackground
                isGlobal
                imagePath={ '/global/about/external_house' }
                lowRes={ 360 }
                highRes={ 960 }
            />
        </div>
        <!-- <img class="about-page-image" src="/image/about/external_house.avif" alt=""> -->
        <div class="about-page-text">
            <h2>{ getLocalizedText( aboutUsText[ 4 ], $languageTagStore ) }</h2>
            <p>{ getLocalizedText( aboutUsText[ 5 ], $languageTagStore ) }</p>
            <p>{ getLocalizedText( aboutUsText[ 6 ], $languageTagStore ) }</p>
        </div>
    </section>

    <BlogFeaturedArticle
        article={ ctaHeroSectionData }
        --article-info-container-justify={ 'center' }
    />

    <DiscoverMoien --blog-discover-width="100%" />
    <BlogFooter />
</article>
