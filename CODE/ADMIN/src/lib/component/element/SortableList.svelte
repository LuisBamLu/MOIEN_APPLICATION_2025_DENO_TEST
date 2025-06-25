<script>
    // -- IMPORTS

    import { onDestroy, onMount } from 'svelte';
    import SortableJs from 'sortablejs';

    // -- VARIABLES

    let list = $state();
    let sortable;
    let options;

    /** @type {{class: any, multiDragClass?: any, swapClass?: any, draggable?: any, group?: any, store?: any, handle?: any, invertedSwapThreshold?: any, direction?: any, touchStartThreshold?: any, setData?: any, filter?: any, easing?: any, sort?: boolean, disabled?: boolean, invertSwap?: boolean, removeCloneOnHide?: boolean, delayOnTouchOnly?: boolean, forceFallback?: boolean, preventOnFilter?: boolean, fallbackOnBody?: boolean, ghostClass?: string, chosenClass?: string, dragClass?: string, fallbackClass?: string, ignore?: string, dataIdAttr?: string, swapThreshold?: number, animation?: number, delay?: number, fallbackTolerance?: number, emptyDistanceToInsertThreshold?: number, fallbackOffset?: any, onChoose?: any, onUnchoose?: any, onStartDrag?: any, onEndDrag?: any, onAdd?: any, onUpdate?: any, onRemove?: any, onFilter?: any, onSort?: any, onClone?: any, onMove?: any, onChange?: any, onEnd?: any, children?: import('svelte').Snippet}} */
    let {
            class: className,
            multiDragClass = null,
            swapClass = null,
            draggable = null,
            group = undefined,
            store = undefined,
            handle = undefined,
            invertedSwapThreshold = undefined,
            direction = undefined,
            touchStartThreshold = undefined,
            setData = undefined,
            filter = undefined,
            easing = undefined,
            sort = true,
            disabled = false,
            invertSwap = false,
            removeCloneOnHide = true,
            delayOnTouchOnly = false,
            forceFallback = false,
            preventOnFilter = true,
            fallbackOnBody = false,
            ghostClass = 'sortable-ghost',
            chosenClass = 'sortable-chosen',
            dragClass = 'sortable-drag',
            fallbackClass = 'sortable-fallback',
            ignore = 'a; img',
            dataIdAttr = 'data-id',
            swapThreshold = 1,
            animation = 0,
            delay = 0,
            fallbackTolerance = 0,
            emptyDistanceToInsertThreshold = 5,
            fallbackOffset =
            {
                x: 0,
                y: 0
            },
            onChoose = ( event ) => null,
            onUnchoose = ( event ) => null,
            onStartDrag = ( event ) => null,
            onEndDrag = ( event ) => null,
            onAdd = ( event ) => null,
            onUpdate = ( event ) => null,
            onRemove = ( event ) => null,
            onFilter = ( event ) => null,
            onSort = ( event ) => null,
            onClone = ( event ) => null,
            onMove = ( event ) => null,
            onChange = ( event ) => null,
            onEnd = ( event ) => null,
            children
        } = $props();

    // -- STATEMENTS

    onMount(
        () =>
        {
            options = {
                group,
                sort,
                disabled,
                store,
                handle,
                swapThreshold,
                invertSwap,
                invertedSwapThreshold,
                removeCloneOnHide,
                ghostClass,
                chosenClass,
                dragClass,
                ignore,
                filter,
                preventOnFilter,
                animation,
                easing,
                dataIdAttr,
                delay,
                delayOnTouchOnly,
                forceFallback,
                fallbackClass,
                fallbackOnBody,
                fallbackTolerance,
                fallbackOffset,
                emptyDistanceToInsertThreshold,
                direction,
                touchStartThreshold,
                setData,
                onChoose,
                onUnchoose,
                onStartDrag,
                onEndDrag,
                onAdd,
                onUpdate,
                onRemove,
                onFilter,
                onSort,
                onClone,
                onMove,
                onChange,
                onEnd
            };

            if ( draggable !== null )
            {
                options[ 'draggable' ] = draggable;
            }
            if ( multiDragClass !== null )
            {
                options[ 'multiDrag' ] = true;
                options[ 'selectedClass' ] = multiDragClass;
                options.fallbackTolerance = 3;
            }
            if ( swapClass )
            {
                options[ 'swap' ] = true;
                options[ 'swapClass' ] = swapClass;
            }

            sortable = SortableJs.create( list, options );
        }
    );

    onDestroy(
        () => {
            if ( sortable )
            {
                sortable.destroy();
            }
        }
    );
</script>

<div
    bind:this={ list }
    class={ className }
>
    {@render children?.()}
</div>
