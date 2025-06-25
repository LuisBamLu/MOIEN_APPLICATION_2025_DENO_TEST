<script>
    // -- VARIABLES

  /** @type {{disabled?: boolean, id?: string, name?: string, text?: string, value?: any, group?: any}} */
  let {
    disabled = false,
    id = '',
    name = '',
    text = '',
    value = null,
    group = $bindable(null)
  } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .checkbox-wrapper input[type="checkbox"]
    {
        display: none;

        visibility: hidden;
    }

    .checkbox-wrapper .cbx
    {
        margin: auto;
        -webkit-user-select: none;
        display: flex;
        gap: 0.5rem;

        user-select: none;
        cursor: pointer;
    }

    .checkbox-wrapper .cbx span
    {
        transform: translate3d(0, 0, 0);

        display: inline-block;
        align-items: center;

        line-height: 2rem;
        font-size: 1.25rem;
        vertical-align: middle;
        color: lightGreyColor;
    }

    .checkbox-wrapper .cbx span:last-child
    {
        margin-left: 0.5rem;
    }

    .checkbox-wrapper .cbx span:first-child
    {
        position: relative;
        transform: scale( 1 );

        margin-top: 0.25rem;
        height: 1.5rem;
        width: 1.5rem;
        border: 2px solid grayColor600;

        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;

        vertical-align: middle;

        transition: all 0.2s ease;
    }

    .checkbox-wrapper .cbx span:first-child svg
    {
        position: absolute;
        fill: none;
        stroke: darkGreyColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 1rem;
        stroke-dashoffset: 1rem;
        transform: translate3d( 0, 0, 0 );

        transition: all 0.3s ease;
        transition-delay: 0.1s;
    }

    .checkbox-wrapper .cbx span:first-child:before
    {
        transform: scale( 0 );

        height: 100%;
        width: 100%;
        border-radius: 50%;

        display: block;

        content: "";
        opacity: 1;
        background: lightGoldColor;
    }

    .checkbox-wrapper .cbx:hover span:first-child
    {
        border-color: lightGoldColor;
    }

    .checkbox-wrapper .inp-cbx:checked + .cbx span:first-child
    {
        border-color: lightGoldColor;

        background: lightGoldColor;

        animation: wave 0.4s ease;
    }

    .checkbox-wrapper .inp-cbx:checked + .cbx span:first-child svg
    {
        stroke-dashoffset: 0;
    }

    .checkbox-wrapper .inp-cbx:checked + .cbx span:first-child:before
    {
        transform: scale( 3.5 );

        opacity: 0;

        transition: all 0.6s ease;
    }

    // -- MIXINS

    @keyframes wave
    {
        50%
        {
            transform: scale( 0.9 );
        }
    }
</style>

<div class="checkbox-wrapper">
  <input
    type="checkbox"
    class="inp-cbx"
    bind:group
    value={ value }
    { disabled }
    { id }
    { name }
  />
  <label for={ id } class="cbx">
    <span>
      <svg viewBox="0 0 12 10" height="12px" width="1rem">
        <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg
      >
    </span>
    <span>{ text }</span>
  </label>
</div>
