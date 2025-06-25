// -- IMPORTS

import fs from 'node:fs/promises';
import { fetchData } from './base.js';

// -- CONSTANTS

const xml = `<?xml version="1.0" encoding="UTF-8"?>`;
const urlset = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
const sitemapIndex = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
const baseUrl = 'https://www.moien.com/sitemap/';

// -- FUNCTIONS

function getIndexString(
    index
    )
{
    const length = index.toString().length;

    for ( let i = 0; i < 4 - length; i++ )
    {
        index = '0' + index;
    }

    return index;
}

// ~~

function generateSitemapItem(
    path,
    item,
    changeFreq
    )
{
    let now = new Date( item.updateTimestamp ).toISOString();
    let urlPath;

    if ( path === 'blog' )
    {
        urlPath = `${ baseUrl + path }/article/${ item.id }`;
    }
    else if ( path === 'property' )
    {
        urlPath = `${ baseUrl + path }/${ item.id }`;
    }

    let result =
        `
            <url>\n
                <loc>${ urlPath }</loc>\n
                <lastmod>${ now }</lastmod>\n
                <changefreq>${ changeFreq }</changefreq>\n
            </url>\n
        `;

    return result;
}

// ~~

async function generateSitemap(
    path,
    itemArray,
    index = null
    )
{
    let result = null;

    try
    {
        let surfix = index ? `_${ getIndexString( index ) }` : '';
        let now = new Date().toISOString();
        let urlPath = `${ baseUrl + path }/sitemap${ surfix }.xml`;
        let frequency = index ? 'monthly' : 'yearly';

        let sitemap =`${ xml }\n${ urlset }\n`;

        for ( let i = 0; i < itemArray.length; i++ )
        {
            sitemap += generateSitemapItem( path, itemArray[ i ], frequency );
            sitemap += '\n';
        }

        sitemap += `</urlset>`;

        await fs.writeFile(
            `./public/sitemap/${ path }/sitemap${ surfix }.xml`,
            sitemap
            );

        result =
            `
                <sitemap>\n
                    <loc>${ urlPath }</loc>\n
                    <lastmod>${ now }</lastmod>\n
                </sitemap>\n
            `;
    }
    catch ( error )
    {
        console.error( error );
    }

    return result;
}

// ~~

export async function generateSitemapIndex(
    )
{
    const staticSitemap =
        `
            <sitemap>
                <loc>https://www.moien.com/sitemap/static/sitemap.xml</loc>
                <lastmod>2024-08-01</lastmod>
            </sitemap>
            <sitemap>
                <loc>https://www.moien.com/sitemap/app/sitemap.xml</loc>
                <lastmod>2024-08-06</lastmod>
            </sitemap>
        `;
    let content = `${ xml }\n${ sitemapIndex }\n${ staticSitemap }\n`;

    try
    {
        const pathArray = [ 'blog', 'property' ];
        const urlArray =
            [
                '/api/blog/articles/get',
                '/api/property/get'
            ];

        for ( let index = 0; index < pathArray.length; index++ )
        {
            let path = pathArray[ index ];
            let items = await fetchData( urlArray[ index ] );

            if ( !items )
            {
                throw new Error( 'No items found in: ' + path );
            }
            else if ( items.length < 50_000 )
            {
                content += await generateSitemap( path, items );
            }
            else
            {
                let count = Math.ceil( items.length / 50_000 );

                for ( let index = 0; index < count; index++ )
                {
                    let start = index * 50_000;
                    let end = start + 50_000;
                    let subItems = items.slice( start, end );

                    content += await generateSitemap( path, subItems, index );
                }
            }

            content += await generateSitemap( path, items, index );
        }

        content += `</sitemapindex>`;

        await fs.writeFile(
            `./public/sitemap/sitemap.xml`,
            content
            );
    }
    catch ( error )
    {
        console.error( error );
    }
}
