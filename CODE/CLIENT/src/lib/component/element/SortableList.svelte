<script>
    // -- IMPORTS

    import { onDestroy, onMount } from 'svelte';
    import SortableJs, { MultiDrag, Swap } from 'sortablejs';

    // -- VARIABLES

    let list;
    let sortable;
    let className;
    let options;

    export { className as class };
    export let multiDragClass = null;
    export let swapClass = null;
    export let draggable = null
    export let group = undefined;
    export let store = undefined;
    export let handle = undefined;
    export let invertedSwapThreshold = undefined;
    export let direction = undefined;
    export let touchStartThreshold = undefined;
    export let setData = undefined;
    export let filter = undefined;
    export let easing = undefined;
    export let sort = true;
    export let disabled = false;
    export let invertSwap = false;
    export let removeCloneOnHide = true;
    export let delayOnTouchOnly = false;
    export let forceFallback = false;
    export let preventOnFilter = true;
    export let fallbackOnBody = false;
    export let ghostClass = 'sortable-ghost';
    export let chosenClass = 'sortable-chosen';
    export let dragClass = 'sortable-drag'
    export let fallbackClass = 'sortable-fallback'
    export let ignore = 'a; img';
    export let dataIdAttr = 'data-id';
    export let swapThreshold = 1;
    export let animation = 0;
    export let delay = 0;
    export let fallbackTolerance = 0;
    export let emptyDistanceToInsertThreshold = 5;
    export let fallbackOffset = {
        x: 0,
        y: 0
    }

    export let onChoose = ( event ) => null;
    export let onUnchoose = ( event ) => null;
    export let onStartDrag = ( event ) => null;
    export let onEndDrag = ( event ) => null;
    export let onAdd = ( event ) => null;
    export let onUpdate = ( event ) => null;
    export let onRemove = ( event ) => null;
    export let onFilter = ( event ) => null;
    export let onSort = ( event ) => null;
    export let onClone = ( event ) => null;
    export let onMove = ( event ) => null;
    export let onChange = ( event ) => null;

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
                onChange
            };

            if ( draggable !== null )
            {
                options.draggable = draggable;
            }
            if ( multiDragClass !== null )
            {
                try
                {
                    SortableJs.mount( new MultiDrag() );
                }
                catch ( error )
                {
                    console.error('Error on handle sort multiple:', error)
                }

                options.multiDrag = true;
                options.selectedClass = multiDragClass;
                options.fallbackTolerance = 3;
            }
            if ( swapClass )
            {
                try
                {
                    SortableJs.mount( new Swap() );
                }
                catch ( error )
                {
                    console.error('Error on handle sort multiple:', error)
                }

                options.swap = true;
                options.swapClass = swapClass;
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
    <slot />
</div>
