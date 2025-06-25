// -- FUNCTIONS

export function isCacheExpired(
    cacheTimestamp,
    cacheDurationMilliseconds
    )
{
    return ( Date.now() - cacheTimestamp ) > cacheDurationMilliseconds;
}

// ~~

export function checkAndRemoveExpiredCache(
    cache,
    cacheDurationMilliseconds
    )
{
    if ( isCacheExpired( cache.timestamp, cacheDurationMilliseconds ) )
    {
        cache.data = {};
        cache.timestamp = null;
    }
}

// ~~

export function startCacheCheckInterval(
    cache,
    cacheDurationMilliseconds,
    cacheCheckPeriodMilliseconds
    )
{
    setInterval(
        () =>
        {
            checkAndRemoveExpiredCache( cache, cacheDurationMilliseconds );
        },
        cacheCheckPeriodMilliseconds
        );
}

// ~~

export function getCacheData(
    cache,
    cacheDurationMilliseconds
    )
{
    if ( cache.timestamp && !isCacheExpired( cache.timestamp, cacheDurationMilliseconds ) )
    {
        return cache.data || null;
    }
    return null;
}

// ~~

export function getCacheKeyData(
    cache,
    cacheKey,
    cacheDurationMilliseconds
    )
{
    let cacheData = getCacheData( cache, cacheDurationMilliseconds );
    return cacheData ? ( cacheData[ cacheKey ] || null ) : null;
}

// ~~

export function setCacheData(
    cache,
    cacheData
    )
{
    cache.data = cacheData;
    cache.timestamp = Date.now();
}

// ~~

export function setCacheKeyData(
    cache,
    cacheKey,
    cacheKeyData
    )
{
    let cacheData = cache.data || {};
    cacheData[ cacheKey ] = cacheKeyData;
    cache.data = cacheData;
    cache.timestamp = Date.now();
}
