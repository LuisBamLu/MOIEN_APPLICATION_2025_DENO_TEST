<script>
    // -- IMPORTS

    import { getRandomTuid } from 'senselogic-gist';

    // -- VARIABLES

  /** @type {{id?: any, size?: number, fillPercent?: number}} */
  let { id = getRandomTuid(), size = 24, fillPercent = 100 } = $props();
</script>

<style lang="stylus">
    svg
    {
        flex-shrink: 0;
    }
</style>

<svg width={ size } height={ size } aria-label="star" viewBox="100 100 120 120" role="img">
    <defs>
      <linearGradient { id }>
        {#if fillPercent !== 100}
          <stop offset="0%" stop-color="#F5CA14"/>
          <stop offset="{ fillPercent }%" stop-color="#F5CA14"/>
          <stop offset="{ fillPercent }%" stop-color="transparent"/>
          <stop offset="100%" stop-color="transparent"/>
        {:else}
          <stop offset="0%" stop-color="#F5CA14"/>
          <stop offset="100%" stop-color="#F5CA14"/>
        {/if}
      </linearGradient>
    </defs>
    <g fill="url(#{ id })" stroke=#F5CA14 stroke-width="2">
      <polygon
        points="165.000, 185.000, 188.511, 197.361, 184.021, 171.180,
      203.042, 152.639, 176.756, 148.820, 165.000, 125.000,
      153.244, 148.820, 126.958, 152.639, 145.979, 171.180,
      141.489, 197.361, 165.000, 185.000"/>
    </g>
  </svg>
