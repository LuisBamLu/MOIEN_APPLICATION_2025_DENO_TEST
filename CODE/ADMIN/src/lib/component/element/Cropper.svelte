<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { writable } from 'svelte/store';
    import 'cropperjs/dist/cropper.css';
    import { onMount, onDestroy } from 'svelte';
    import Cropper from 'cropperjs';

    // -- CONSTANTS

    const effectArray =
        [
            {
                name: 'Normal',
                filter: 'none',
                overlays: [
                        {
                            backgroundColor: 'unset',
                            mixBlendMode: 'unset'
                        }
                    ]
            },
            {
                name: 'Clarendon',
                filter: 'contrast(1.2) saturate(1.35)',
                overlays:
                    [
                        {
                            backgroundColor: 'rgba(127, 187, 227, 0.2)',
                            mixBlendMode: 'overlay'
                        }
                    ]
            },
            {
                name: '1977',
                filter: 'sepia(0.5) hue-rotate(-30deg) saturate(1.4)',
                overlays: []
            },
            {
                name: 'Juno',
                filter: 'contrast(1.1) saturate(1.3) brightness(1.1)',
                overlays: [
                    {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        mixBlendMode: 'overlay'
                    }
                ]
            },
            {
                name: 'Lark',
                filter: 'contrast(1.1) brightness(1.1) saturate(1.15)',
                overlays: []
            },
            {
                name: 'Ludwig',
                filter: 'contrast(1.15) brightness(1.1) sepia(0.2)',
                overlays: []
            },
            {
                name: 'Reyes',
                filter: 'sepia(0.2) brightness(1.2) contrast(1.1)',
                overlays: []
            },
            {
                name: 'Valencia',
                filter: 'sepia(0.3) brightness(1.1) contrast(1.05)',
                overlays: []
            },
            {
                name: 'X-Pro II',
                filter: 'contrast(1.2) brightness(1.1) sepia(0.4)',
                overlays: [
                    {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        mixBlendMode: 'multiply'
                    }
                ]
            },
            {
                name: 'Mayfair',
                filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
                overlays: [
                    {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        mixBlendMode: 'overlay'
                    }
                ]
            },
            {
                name: 'Sierra',
                filter: 'sepia(0.3) brightness(1.15) contrast(1.05)',
                overlays: []
            },
            {
                name: 'Toaster',
                filter: 'contrast(1.2) brightness(1.1) sepia(0.4)',
                overlays: []
            },
            {
                name: 'Grayscale',
                filter: 'grayscale(1)',
                overlays: []
            }
        ];

    // -- VARIABLES

    let cropper = $state();
    let filterMap = {};
    let selectedEffectName = $state('Normal');

    /** @type {{data?: any, fileToSave?: any}} */
    let { data = {}, fileToSave = $bindable(null) } = $props();
    let imageElement = $state();
    let canvasData = null;
    let cropBoxData = null;
    let croppedData = null;
    let dataStore = writable( data );

    // -- FUNCTIONS

    function onImageLoad(
        node
        )
    {
        if ( $dataStore.cropped || cropper )
        {
            stop();
        };
        cropper = new Cropper(
            imageElement,
            {
                autoCrop: false,
                dragMode: 'move',
                background: false,
                ready: function(
                    )
                {
                    if ( croppedData )
                    {
                        cropper
                            .crop()
                            .setData( croppedData )
                            .setCanvasData( canvasData )
                            .setCropBoxData( cropBoxData );

                        croppedData = null;
                        canvasData = null;
                        cropBoxData = null;
                    }
                },
                crop: function(
                    {
                        detail
                    }
                    )
                {
                    if ( detail.width > 0 && detail.height > 0 && !$dataStore.cropping )
                    {
                        update(
                            {
                                cropping: true
                            }
                            );
                    }
                }
            }
            );
    }

    // ~~

    function stop(
        )
    {
        if ( cropper )
        {
            dataStore.set( {} );
            cropper.destroy();
            cropper = null;
        }
    }

    // ~~

    function crop(
        )
    {
        if ( $dataStore.cropping && cropper )
        {
            croppedData = cropper.getData();
            canvasData = cropper.getCanvasData();
            cropBoxData = cropper.getCropBoxData();

            let croppedCanvas = cropper.getCroppedCanvas();
            let croppedImageSrc = croppedCanvas.toDataURL( $dataStore.type );

            update(
                {
                    cropped: true,
                    cropping: false,
                    previousUrl: $dataStore.url,
                    url: croppedImageSrc
                }
                );

            cropper.replace( croppedImageSrc );
        }
    }

    // ~~

    function clear(
        )
    {
        if ( $dataStore.cropping && cropper )
        {
            cropper.clear();
            update( { cropping: false } );
        }
    }

    // ~~

    function restore(
        )
    {
        if ( $dataStore.cropped )
        {
            update(
                {
                    cropped: false,
                    previousUrl: '',
                    url: $dataStore.previousUrl
                }
                );
        }
    }

    // ~~

    function reset(
        )
    {
        stop();

        update(
            {
                cropped: false,
                cropping: false,
                loaded: false,
                name: '',
                previousUrl: '',
                type: '',
                url: ''
            }
            );

        onImageLoad();
    }

    // ~~

    function update(
        newData
        )
    {
        Object.assign( $dataStore, newData );

        fileToSave = $dataStore;
    }

    // ~~

    function loadFile(
        event
        )
    {
        let file = event.target.files[ 0 ];

        if ( file )
        {
            let reader = new FileReader();

            reader.onload = ( event ) =>
            {
                update(
                    {
                        url: event.target.result,
                        type: file.type,
                        previousUrl: event.target.result
                    }
                    );

                cropper.replace( event.target.result );
            };

            reader.readAsDataURL( file );
        }
        else
        {
            console.log( 'No file selected or file is invalid.' );
        }
    }

    // ~~

    function handleClickEvent(
        {
            target
        }
        )
    {
        let action = target.dataset.action || target.parentElement.dataset.action;

        if ( !cropper ) return;

        switch ( action )
        {
            case 'move':
            case 'crop':
                cropper.setDragMode( action );

                break;
            case 'zoom-in':
                cropper.zoom( 0.1 );

                break;
            case 'zoom-out':
                cropper.zoom( -0.1 );

                break;
            case 'rotate-left':
                cropper.rotate( -90 );

                break;
            case 'rotate-right':
                cropper.rotate( 90 );

                break;
            case 'flip-horizontal':
                cropper.scaleX( -cropper.getData().scaleX || -1 );

                break;
            case 'flip-vertical':
                cropper.scaleY( -cropper.getData().scaleY || -1 );

                break;
            case 'reset':
                reset();

                break;
            default:
                break;
        }
    };

    // ~~

    function keydown(
        event
        )
    {
        if ( !cropper ) return;

        switch ( event.key )
        {
            case 'z':

                if ( event.ctrlKey )
                {
                    event.preventDefault();
                    restore();
                }

                break;
            case 'Delete':
                reset();

                break;
            case 'Enter':
                crop();

                break;
            case 'Escape':
                clear();

                break;
            case 'ArrowLeft':
                event.preventDefault();
                cropper.move( -1, 0 );

                break;
            case 'ArrowUp':
                event.preventDefault();
                cropper.move( 0, -1 );

                break;
            case 'ArrowRight':
                event.preventDefault();
                cropper.move( 1, 0 );

                break;
            case 'ArrowDown':
                event.preventDefault();
                cropper.move( 0, 1 );

                break;
            case 'c':
                cropper.setDragMode( 'crop' );

                break;
            case 'm':
                cropper.setDragMode( 'move' );

                break;
            case 'i':
                cropper.zoom( 0.1 );

                break;
            case 'o':
                cropper.zoom( -0.1 );

                break;
            case 'l':
                cropper.rotate( -90 );

                break;
            case 'r':
                cropper.rotate( 90 );

                break;
            case 'h':
                cropper.scaleX( -cropper.getData().scaleX || -1 );

                break;
            case 'v':
                cropper.scaleY( -cropper.getData().scaleY || -1 );

                break;
            default:
                break;
        }
    };

    // ~~

    function handleDoubleClickEvent(
        event
        )
    {
        if ( event.target.className.indexOf( 'cropper-face' ) >= 0 )
        {
            event.preventDefault();
            event.stopPropagation();
            crop();
        }
    }

    // ~~

    function applyEffect(
        effectName
        )
    {
        if ( cropper )
        {
            cropper.replace( $dataStore.previousUrl );

            let canvas = cropper.getCroppedCanvas();
            let ctx = canvas?.getContext( '2d' );

            let effect =
                effectArray.find( ( _effect ) => _effect.name === effectName );

            ctx.filter = effect.filter;
            ctx.drawImage( canvas, 0, 0 );

            let url = canvas.toDataURL( $dataStore.type );
            let previousUrl = $dataStore.url;

            update(
                {
                    previousUrl,
                    url
                }
                );

            cropper.replace( url );
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( imageElement )
            {
                onImageLoad();

                return () => stop();
            }
        }
        );

    onDestroy(
        () =>
        {
            stop();
        }
        );

    // ~~

    run(() => {
        fileToSave = $dataStore;
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    img
    {
        max-width: 100%;

        display: block;
    }

    input[ type="radio" ]
    {
        display: none;
    }

    label
    {
        display: flex;
        align-content: stretch;
    }

    // -- CLASSES

    .content-container
    {
        height: 100%;
        max-width: 80%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            max-width: 100%;
        }
    }

    .cropper-container
    {
        overflow: hidden;
        height: 100%;
        width: 100%;
    }

    .effect-list
    {
        overflow-y: hidden;
        overflow-x: auto;
        width: 100%;
        padding: 1rem 0;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        scroll-snap-type: x mandatory;
    }

    .effect-list::-webkit-scrollbar-track
    {
        background-color: #F4F4F4;
    }

    .effect-list::-webkit-scrollbar
    {
        height: 0.125em;

        background: #F4F4F4;
    }

    .effect-list::-webkit-scrollbar-thumb
    {
        border-radius: 1em;

        background: #dad7d7;
    }

    .effect-button
    {
        border: 1px solid whiteColor;
        border-radius: 1.5rem;
        padding: 0.75rem 1rem;

        background: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        line-height: 1.125rem;
        font-size: 0.875rem;
        font-weight: 500;
        text-align: center;
        color: grayColor500;
        text-wrap: nowrap;

        cursor: pointer;
        transition: border 300ms ease-in-out;
    }

    .effect-button:hover
    {
        border: 1px solid grayColor700;
    }

    input:checked + .effect-button

    {
        background: greenColor800;

        color: greenColor100;
    }

    .toolbar-button
    {
        height: 3.25rem;
        width: 3.25rem;
        border-width: 0;
        border-radius: 0.75rem;
        padding: 0.5rem;

        display: block;
        display: flex;
        justify-content: center;
        align-items: center;

        background-color: whiteColor;

        font-size: 0.875rem;
        text-align: center;

        cursor: pointer;
    }

    .toolbar-button:focus
    {
        outline: none;
    }

    .toolbar-button:hover
    {
        color: #fff;
    }

    .toolbar
    {
        width: 100%;
        padding: 1rem 0 0;

        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;
    }

    .cropper-container.canvas
    {
        border-radius: 0.75rem;

        background: grayColor800;
    }
</style>

<svelte:window onkeydown={keydown}/>

<div class="content-container">
    <!-- <input type="file" accept="image/*" on:change={ loadFile }/> -->
    <div class="effect-list">
        {#each effectArray as effect ( effect.name ) }
            <label>
                <input
                    bind:group={ selectedEffectName }
                    name="selected-effect-name"
                    onclick={() => applyEffect( effect.name )}
                    type="radio"
                    value={ effect.name }
                />
                <span class="effect-button">
                    { effect.name }
                </span>
            </label>
        {/each}
    </div>

    <div
        class="cropper-container canvas"
        ondblclick={handleDoubleClickEvent}
        onkeydown={handleDoubleClickEvent}
        role="button"
        tabindex={ 2 }
    >
        <img
            src={ $dataStore.url }
            alt={ $dataStore.name }
            bind:this={ imageElement }
        />
    </div>

    {#if cropper }
        <div
            class="toolbar"
            onclick={handleClickEvent}
            onkeydown={handleClickEvent}
            role="button"
            tabindex={ 1 }
        >
            <button class="toolbar-button" data-action="move" title="Move (M)">
                <div class="blue-100-move-icon size-150"></div>
            </button>
            <button class="toolbar-button" data-action="crop" title="Crop (C)">
                <div class="blue-100-crop-icon size-150"></div>
            </button>
            <button class="toolbar-button" data-action="zoom-in" title="Zoom In (I)">
                <div class="blue-100-zoom-in-icon size-150"></div>
            </button>
            <button class="toolbar-button" data-action="zoom-out" title="Zoom Out (O)">
                <div class="blue-100-zoom-out-icon size-150"></div>
            </button>
            <button class="toolbar-button" data-action="rotate-left" title="Rotate Left (L)">
                <div class="blue-100-rotate-left-icon size-150"></div>
            </button>
            <button class="toolbar-button" data-action="rotate-right" title="Rotate Right (R)">
                <div class="blue-100-rotate-right-icon size-150"></div>
            </button>
            <button class="toolbar-button" data-action="flip-horizontal" title="Flip Horizontal (H)">
                <div class="blue-100-flip-horizontal-icon size-150"></div>
            </button>
            <button class="toolbar-button" data-action="flip-vfnew Certical" title="Flip Vertical (V)">
                <div class="blue-100-flip-vertical-icon size-150"></div>
            </button>
            <button class="toolbar-button" data-action="reset" title="Reset (Delete)">
                <div class="blue-100-power-icon size-150"></div>
            </button>
        </div>
    {/if}
</div>
