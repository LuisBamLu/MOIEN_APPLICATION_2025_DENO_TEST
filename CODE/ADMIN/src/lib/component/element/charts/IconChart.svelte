<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{data?: any, dashboard?: boolean}} */
    let { data = [ 5, 4, 4, 5, 4, 3, 5, 3 ], dashboard = false } = $props();
    let colors = [ '#F0384A', '#FECACF', '#FED584', '#ADD3FF', '#A6F4C5' ];
    let smileSvgIconArray =
    $state([
        `<svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M33.8389 4.04283C33.8389 6.09548 32.1749 7.75948 30.1222 7.75948C28.0696 7.75948 26.4056 6.09548 26.4056 4.04283C26.4056 1.99018 28.0696 0.326172 30.1222 0.326172C32.1749 0.326172 33.8389 1.99018 33.8389 4.04283ZM8.46644 4.09001C8.46644 6.14266 6.80243 7.80667 4.74978 7.80667C2.69713 7.80667 1.03313 6.14266 1.03313 4.09001C1.03313 2.03736 2.69713 0.373356 4.74978 0.373356C6.80243 0.373356 8.46644 2.03736 8.46644 4.09001ZM34.0866 33.0781V33.0789H27.3959V33.0774C27.3959 27.33 22.9031 22.6707 17.3609 22.6707C11.8188 22.6707 7.32597 27.33 7.32597 33.0774V33.0789H0.636719V33.0781C0.636719 23.6359 8.12473 15.9815 17.3617 15.9815C26.5986 15.9815 34.0866 23.6359 34.0866 33.0781Z" fill="#7A1A23"/>
        </svg>`,
        `<svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M35.8957 4.67549C35.8957 6.87476 34.1128 8.65762 31.9135 8.65762C29.7143 8.65762 27.9314 6.87476 27.9314 4.67549C27.9314 2.47622 29.7143 0.693359 31.9135 0.693359C34.1128 0.693359 35.8957 2.47622 35.8957 4.67549ZM8.71133 4.72582C8.71133 6.92509 6.92847 8.70795 4.7292 8.70795C2.52993 8.70795 0.74707 6.92509 0.74707 4.72582C0.74707 2.52655 2.52993 0.743689 4.7292 0.743689C6.92847 0.743689 8.71133 2.52655 8.71133 4.72582ZM18.7856 25.5441C23.1647 25.6194 27.234 26.9256 30.6691 29.1274L26.5499 33.1075C24.2058 31.8482 21.5345 31.114 18.6907 31.0652C15.6278 31.0125 12.7377 31.7612 10.2202 33.118L6.27173 29.0315C9.89021 26.7524 14.1907 25.4651 18.7856 25.5441Z" fill="#B31827"/>
        </svg>`,
        `<svg width="33" height="30" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M32.4511 4.04283C32.4511 6.09548 30.7871 7.75948 28.7344 7.75948C26.6818 7.75948 25.0178 6.09548 25.0178 4.04283C25.0178 1.99018 26.6818 0.326172 28.7344 0.326172C30.7871 0.326172 32.4511 1.99018 32.4511 4.04283ZM7.97042 4.09001C7.97042 6.14266 6.30642 7.80667 4.25376 7.80667C2.20111 7.80667 0.537109 6.14266 0.537109 4.09001C0.537109 2.03736 2.20111 0.373356 4.25376 0.373356C6.30642 0.373356 7.97042 2.03736 7.97042 4.09001ZM4.40306 29.9609L28.8834 29.9609L28.8834 23.5187L4.40306 23.5187L4.40306 29.9609Z" fill="#B84E08"/>
        </svg>`,
        `<svg width="36" height="34" viewBox="0 0 36 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M35.5089 4.67549C35.5089 6.87476 33.7261 8.65762 31.5268 8.65762C29.3275 8.65762 27.5447 6.87476 27.5447 4.67549C27.5447 2.47622 29.3275 0.693359 31.5268 0.693359C33.7261 0.693359 35.5089 2.47622 35.5089 4.67549ZM8.32461 4.72582C8.32461 6.92509 6.54175 8.70795 4.34248 8.70795C2.14321 8.70795 0.360352 6.92509 0.360352 4.72582C0.360352 2.52655 2.14321 0.743689 4.34248 0.743689C6.54175 0.743689 8.32461 2.52655 8.32461 4.72582ZM17.8257 33.2594C13.4466 33.2594 9.35617 32.0236 5.88405 29.8819L9.93442 25.8315C12.2994 27.0497 14.9822 27.7375 17.8257 27.7375C20.8885 27.7375 23.765 26.9395 26.2585 25.5401L30.2766 29.5583C26.6981 31.8987 22.4208 33.2594 17.8257 33.2594Z" fill="#010D3C"/>
        </svg>`,
        `<svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M34.0647 4.04576C34.0647 6.09841 32.4007 7.76241 30.348 7.76241C28.2954 7.76241 26.6314 6.09841 26.6314 4.04576C26.6314 1.9931 28.2954 0.329102 30.348 0.329102C32.4007 0.329102 34.0647 1.9931 34.0647 4.04576ZM8.6922 4.09294C8.6922 6.14559 7.0282 7.8096 4.97555 7.8096C2.9229 7.8096 1.25889 6.14559 1.25889 4.09294C1.25889 2.04029 2.9229 0.376286 4.97555 0.376286C7.0282 0.376286 8.6922 2.04029 8.6922 4.09294ZM0.862305 15.9886V15.9884H7.55277C7.55401 21.7347 12.0463 26.3926 17.5877 26.3926C23.1291 26.3926 27.6215 21.7347 27.6227 15.9884H34.3122V15.9886C34.3122 25.4308 26.8242 33.0853 17.5873 33.0853C8.35032 33.0853 0.862305 25.4308 0.862305 15.9886Z" fill="#00584A"/>
        </svg>`
    ]);

    // -- FUNCTIONS

    function getAverage( array )
    {
        return array.reduce( ( sum, value ) => sum + value, 0 ) / array.length;
    }
</script>

<style lang="stylus">
    // -- STYLES

    .icon-chart
    {
        aspect-ratio: 2 / 1;
        border-radius: 0.5rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;

        background-color: grayColor900;
    }

    .icon-chart-moien-icon
    {
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .icon-score
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
    }

    .icon-container
    {
        position: relative;

        overflow: hidden;
        height: 5vw;
        width: 5vw;
        border-radius: 50%;

        display: flex;
        justify-content: flex-start;
        align-items: center;

        background-color: #CFCFCF;

        @media ( max-width: 1000px )
        {
            height: 8vw;
            width: 8vw;
        }

        &.dash
        {
            height: 3vw;
            width: 3vw;
        }
    }

    .icon-color
    {
        height: 100%;
        width: 100%;
    }

    .icon-image
    {
        z-index: 2;
        position: absolute;

        width: auto;
        padding: 1.3vw;

        display: flex;
        justify-content: center;

        @media ( max-width: 1000px )
        {
            padding: 2.1vw;
        }

        &.dash
        {
            padding: 1vw;
        }
    }
</style>

<div class="icon-chart">
    <div class="icon-chart-moien-icon" title={ `${ getLocalizedText( `Average¨fr:Moyenne¨de:Durchschnitt`, $languageTagStore ) }: ${ getAverage( data ).toFixed( 2 ) }` }>
        {#each colors as color, index }
            <div class="icon-score">
                <div class="icon-container" class:dash={ dashboard }>
                    <div class="icon-color" style={ `background-color: ${ getAverage( data ) >= index ? color : 'transparent' }; width: ${ ( getAverage( data ) - index ) * 100 }%;` }></div>
                    <div class="icon-image" class:dash={ dashboard } contenteditable="true" bind:innerHTML={ smileSvgIconArray[ index ] }></div>
                </div>
                <div class="font-weight-700">{ index + 1 }</div>
            </div>
        {/each}
    </div>
</div>
