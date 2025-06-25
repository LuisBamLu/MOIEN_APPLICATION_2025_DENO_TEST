// -- IMPORTS

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getInteger } from 'senselogic-gist';

// -- TYPES

class AnalyticsService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.betaAnalyticsDataClient = new BetaAnalyticsDataClient(
            {
                credentials:
                    {
                        'type': 'service_account',
                        'project_id': 'moienapp-ad3aa',
                        'private_key_id': 'ac9dbc68e1ef0ac1cc3dd06df1e2c60406680527',
                        'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCN/HiyNbbukNEl\nDZ6/bAX5QO2avQts87ypSn0JI2iT9iQKDxHQHU1Ts63IR8a7tlgLBYWOEpuk478I\n03IizAs5+6SO8NLjVfBdnL8k3cubDs7t9cfj0UPsqmm0pwM1edCQQUgINt5dRqeS\nQDJ9xl5ahkedM7sYoghWjNvs6OTR3Nauhyu5AilO7lk/FS5giTjdP0/h2XM+OGDg\ngSyL+G4CsnuWC4sINoAgsZTyVNvyNOhS4ncRsD+X9gKUkNyKrh46GK6bHwLGETtt\nikUvJCjoGlJ+UyuWQvfc+CAYqDBcCJaqNrXvUe49HSSpGq6AjEsBV+HN9C6CNDqZ\nRVDqfb6bAgMBAAECggEADIc2byMQ3RlSGvQ0tFc9FQfcRJxhobTFSiVpxaCmMvKz\nrgozsX/5uWT6ny1reldV4BhrTGSVRIYD7oIZvrrvp/zC7F87fGuyJdBq3T86Hphp\nPH3vVp65tkGNyi7iYu7jWZcpBUXcy7DW9a9Mb+SiTAKFLHh1YxsI+U9nKGRJrGqv\nrstNdo6jkMbtPcAlToYPgvk29m5axNHJkep0x5cixgEcyCLE0Ib3vLXYNzJ3QFa6\nlRYjcbOgvRLKJyd5uYn3mSTJ06PDYlO2rpEtX54BYGgh+PxpuLovJnThCouw89GF\np5aV/E3LtyEtcn1eYA4D9GlVGefhW/GVCqbr8IsCYQKBgQDDg/zvhGDD243WK+lR\nf/OTrKuPS30/LKG7SVC9akFLZdOawEb9sT7SShJxDNC6t7wl+1WlJTHhjfiTz3D+\n2NIB9wu5TxlkCDDqkjowBBRAXt+AJqimZuhZs/E/xN/sq+aDn64IlAEymPXqFTtg\nnoll+4Y43DqxUqeN5MhC3fGrjQKBgQC56S7Zm3NwOC4/7mUpI9gjOcDSfPqyXS1p\n/ImQRfYwfh9js5xuQ3+MJfFiAX6IKlQmsi8AriSoBx5YUA+YO/AC3FOZm+7g/tiJ\n5NKI8agJMHIGS7IxI5ydiqf7rqbCYbHbn+unnwdrrX++Zkv+XpmXDwd8DvVf+aVN\n5bf3lVv0xwKBgA1OMixqqdsqWeC1ZE9zkbP/ED3UOVXPR8JjHueFD6R97YSeiTZC\nla/h8pdW8+2BC4DaNd3jRh2/d6c3es0dHE2d7mJSC7xPAmU0Rll2LZqj2jnyZ4/L\neQyBvm1EjKiimjFi8IkM6Xf0COhBQaU1pMwX7e54rlXa9iQl6asDR6sRAoGAPb6K\nRs9wKYcfJTCB/IXhFOHrfnzvrilwGdE7xuTVfQmGV1Ch1aUpSVyYrJoecg7M4AUx\nwyITHpMuqtn8M+1EK08NnOjDD4rUVAfhPIY17sdeN2UQi21uaIxSei5pSAm2TmDw\nnT0d888trAjBmHvGuvrM25EEQZniItr2nI3IeqUCgYBxwH0PdPgE/K9e20nuE8id\noRKVL+UkP0eUVy/Gndvn/NgIRuu01Fx47S3T8oXjEMYtto7c+yMtoefFCrziuoho\nOrVXKUj+rV7nmqIIH+1Hk4/cX3jmaV8tAPwXiI/+EZ9fmR84TC4Kzq5HgRNu7Fn0\neUO4kySX8G1t3Kux+3GG6Q==\n-----END PRIVATE KEY-----\n',
                        'client_email': 'analytics-admin-moien@moienapp-ad3aa.iam.gserviceaccount.com',
                        'client_id': '103405769854915047122',
                        'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                        'token_uri': 'https://oauth2.googleapis.com/token',
                        'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
                        'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/analytics-admin-moien%40moienapp-ad3aa.iam.gserviceaccount.com',
                        'universe_domain': 'googleapis.com'
                    }
            }
            );
    }

    // -- INQUIRIES

    async getPropertyViewReport(
        )
    {
        let [ response ] = await this.betaAnalyticsDataClient.runReport(
            {
                property: 'properties/275995463',
                dateRanges:
                    [
                        {
                            startDate: '365daysAgo',
                            endDate: 'today'
                        }
                    ],
                dimensions:
                    [
                        { name: 'date' },
                        { name: 'eventName' },
                        { name: 'dayOfWeek' },
                        { name: 'hour' },
                        { name: 'day' },
                        { name: 'month' },
                        { name: 'year' },
                        { name: 'week' }
                    ],
                metrics:
                    [
                        { name: 'eventCount' }
                    ],
                dimensionFilter:
                    {
                        andGroup:
                            {
                                expressions:
                                    [
                                        {
                                            filter:
                                                {
                                                    fieldName: 'eventName',
                                                    stringFilter:
                                                        {
                                                            matchType: 'EXACT',
                                                            value: 'page_view'
                                                        }
                                                }
                                        },
                                        {
                                            filter:
                                                {
                                                    fieldName: 'pagePath',
                                                    stringFilter:
                                                        {
                                                            matchType: 'CONTAINS',
                                                            value: '/property/'
                                                        }
                                                }
                                        }
                                    ]
                            }
                    }
            }
            );

        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let lastDayInMonth = new Date( year, month, 0 );
        let monthArray = Array( 12 ).fill( 0 );
        let daysOfMonthArray = Array( lastDayInMonth.getDate() ).fill( 0 );
        let daysOfWeekArray = Array( 7 ).fill( 0 );
        let hoursOfDayArray = Array( 24 ).fill( 0 );

        for ( let row of response.rows )
        {
            let date = row.dimensionValues[ 0 ].value;
            let dayOfWeekCount = getInteger( row.dimensionValues[ 2 ].value, 10 );
            let hourCount = getInteger( row.dimensionValues[ 3 ].value, 10 );
            let viewCount = getInteger( row.metricValues[ 0 ].value, 10 );
            let monthCount = getInteger( row.dimensionValues[ 5 ].value, 10 );
            let monthIndex = monthCount === 12 ? 0 : monthCount;
            monthArray[ 11 - monthIndex ] += viewCount;
            let dayOfMonthIndex = getInteger( date.substring( 6, 8 ), 10 );
            daysOfMonthArray[ dayOfMonthIndex - 1 ] += viewCount;
            daysOfWeekArray[ ( dayOfWeekCount + 1 ) % 7 ] += viewCount;
            let hourIndex = hourCount >= 16 ? hourCount - 16 : hourCount + 8;
            hoursOfDayArray[ 23 - hourIndex ] += viewCount;
        }

        let result =
            [
                monthArray.reverse(),
                daysOfMonthArray,
                daysOfWeekArray,
                hoursOfDayArray.reverse()
            ];

        return (
            {
                detailedViewArray: response.rows,
                result
            }
            );
    }

    // ~~

    async getPropertyPurchaseReport(
        )
    {
        let [ response ] = await this.betaAnalyticsDataClient.runReport(
            {
                property: 'properties/275995463',
                dateRanges:
                    [
                        {
                            startDate: '365daysAgo',
                            endDate: 'today'
                        }
                    ],
                dimensions:
                    [
                        { name: 'date' },
                        { name: 'eventName' },
                        { name: 'dayOfWeek' },
                        { name: 'hour' },
                        { name: 'day' },
                        { name: 'month' },
                        { name: 'year' },
                        { name: 'week' }
                    ],
                metrics:
                    [
                        { name: 'eventCount' }
                    ],
                dimensionFilter:
                    {
                        andGroup:
                            {
                                expressions:
                                    [
                                        {
                                            filter:
                                                {
                                                    fieldName: 'eventName',
                                                    stringFilter:
                                                        {
                                                            matchType: 'EXACT',
                                                            value: 'purchase'
                                                        }
                                                }
                                        }
                                    ]
                            }
                    }
            }
            );

        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let lastDayInMonth = new Date( year, month, 0  );
        let monthArray = Array( 12 ).fill( 0 );
        let daysOfMonthArray = Array( lastDayInMonth.getDate() ).fill( 0 );
        let daysOfWeekArray = Array( 7 ).fill( 0 );
        let hoursOfDayArray = Array( 24 ).fill( 0 );

        for ( let row of response.rows )
        {
            let date = row.dimensionValues[ 0 ].value;
            let dayOfWeekCount = getInteger( row.dimensionValues[ 2 ].value, 10 );
            let hourCount = getInteger( row.dimensionValues[ 3 ].value, 10 );
            let viewCount = getInteger( row.metricValues[ 0 ].value, 10 );
            let monthCount = getInteger( row.dimensionValues[ 5 ].value, 10 );
            let monthIndex = monthCount === 12 ? 0 : monthCount;
            monthArray[ 11 - monthIndex ] += viewCount;
            let dayOfMonthIndex = getInteger( date.substring( 6, 8 ), 10 );
            daysOfMonthArray[ dayOfMonthIndex - 1 ] += viewCount;
            daysOfWeekArray[ ( dayOfWeekCount + 1 ) % 7 ] += viewCount;
            let hourIndex = hourCount >= 16 ? hourCount - 16 : hourCount + 8;
            hoursOfDayArray[ 23 - hourIndex ] += viewCount;
        }

        let result =
            [
                monthArray.reverse(),
                daysOfMonthArray,
                daysOfWeekArray,
                hoursOfDayArray.reverse()
            ];

        return (
            {
                detailedViewArray: response.rows,
                result
            }
            );
    }
}

// -- VARIABLES

export let analyticsService
    = new AnalyticsService();
