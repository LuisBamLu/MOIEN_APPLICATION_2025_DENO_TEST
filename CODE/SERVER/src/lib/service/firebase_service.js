// -- IMPORTS

import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

// -- CONSTANTS

const serviceAccount =
    {
        'type' : 'service_account',
        'project_id' : 'dtmoney-d3a60',
        'private_key_id' : 'b6522942f83e6082850264f4d4e03df446370243',
        'private_key' : '-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDBPhJtglPAcdek\nghY+HOjHyR/FYUuyJ/zBCwNFFO1nHjk1s6IcUaw1Ybp4EK8++6osZ7oCPBfRk2qq\nSnrQvL4yBdI5LiqC2eWQxEXqMuB/pDNFP/pUGRHNMTJNg+K/coFkneox2xM1WYIQ\ngWFAtgxm9b865T+rvqYgDqlS8Pz74U9ydkzHagp1ROptVqV91b4LeVIvliYUwm7l\njlPXxU4cMnHNvJWUl6f+EhpkIATtHMDg0+xNWqKw1vSW1qZMxEqGmmXiT8rQGc05\n1/cmfsrk1c+wIzf8mkPjlfOmgIA6MOALvwE/VJ/XGNoUUQr1r6ny2RnQ5a0qGRhI\nPk7opBzvAgMBAAECgf9GsfRhPeNgPQcnGbo27fB/gY8x4kcb3az9s/t7abI9MgHB\nse1sRv1bbbItt79fU9/8CXlhJLdZJPMckng0DQZJQO6wL8SWhnBcC4jG9OFUe6nf\ntExxbGrVX3FDbU7kwOW3nM9pAcUezZeXUBja6+EPbrBRBj2/M4uB8EGVyYi4bxrg\nApQhI3rhkkep7A+Jgo4ozlsaAltGZrXYhjN/GlT8EUOWrePIkwB0ISyVE1kNClY8\na15Gn9Z5Jbnw2O+AHpkFGrMap36jObCYLdZw01Jdmm7vIbLdikQFf6n0nrzD+Xb/\nLV+phof89P+8O5keBi4uB9fW6xwwRi0FA4ePGV0CgYEA4/Rerg+fDg3u52Cxv9x7\n4UKnjguxnfIXb4OSUUyWoRMAkb+0TEvHxJ+KwUHOm9fg+cTVO3BydK+kYQammyOO\ntMw1byjXa+DoU50Up8FYG1s0z02A/CPKmtzxv9fbvygvXgHwWYD2zSOQtp194kOT\nY6gIQPea7hpwkTkSe2Q6oK0CgYEA2QRp9jsxZxMY48MMfM8EwI/jN+UPC2nC4RCt\nT5mRPoS3d5tDJPDNnsZ+xK1An63KX8oz81QLIVDm8/a7e3b9279mbcmaFhiBGDAO\n0Q6aOtCCDlCRQfWt7H6dSY6DRiLcKMt2HMctJ+LSXvuNRjtMNPhESV1zpG/ToXBT\nuK7DO4sCgYBFwosXCYDLdEggVt8OsBLZJOTR+5Inm+bAIautZZrTQFV0RQ6QKsC/\n03NLITBxUOdwiGQZBJiCTR4o8zgZUhBiE/xmQEFsqi9vJysjC3BDLu5CYp2OjAV8\nzxDMfOqq3Ulho4ZCXc0pijDHMftMOxHn9YxRFXU8WKsKRkT5rfqjIQKBgBxTUSlM\nbJRRj8wap0SbGLmxjiy7fw00TrVlodlj5+tLE09POqJVs+Dnc6BkJK0y19lM4R7/\ndzxv/NUW/T2OOHA4OTxXNf9wT1lC3Iw45bSLho4rwenkEUFu/USej0/WOPoyJEZ5\nUNGF74NqPfROxRGc3fzdb7ykw/CsYqEWXnElAoGBAIzpRttpykrXJR2Tau3LfGRs\n8w9HJbcGfd7qtdwUTIvUqn9bUxb2cF/mLPcFDhYDKRjI4UJjX+8pnbCUH2bY+m/K\nlmz/ptAtjD0hcKWNBmDzWg7ZU/lfc2Ps9DDsbRDugyzYM84zwoh6qepGy6Iy8p3Q\n+bUJ0GFSxGmPyEH1/nsk\n-----END PRIVATE KEY-----\n',
        'client_email' : 'firebase-adminsdk-h1tss@dtmoney-d3a60.iam.gserviceaccount.com',
        'client_id' : '114328656610814393000',
        'auth_uri' : 'https://accounts.google.com/o/oauth2/auth',
        'token_uri' : 'https://oauth2.googleapis.com/token',
        'auth_provider_x509_cert_url' : 'https://www.googleapis.com/oauth2/v1/certs',
        'client_x509_cert_url' : 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-h1tss%40dtmoney-d3a60.iam.gserviceaccount.com',
        'universe_domain' : 'googleapis.com'
    };

class FirebaseService
{
    // -- CONSTRUCTOR
    constructor()
    {
        initializeApp(
            {
                credential: cert( serviceAccount ),
                projectId: serviceAccount[ 'project_id' ]
            }
            );
    }

    // -- OPERATIONS

    async send(
        message
        )
    {
        let response = await getMessaging()
            .send( message );

        return response;
    }

    // ~~

    async sendToTopic(
        topic,
        message
        )
    {
        await getMessaging()
            .sendToTopic( topic, message );
    }

    // ~~

    async subscribeToTopic(
        token,
        topic
        )
    {
        await getMessaging().subscribeToTopic( token, topic );
    }

    // ~~
    async unsubscribeFromTopic(
        token,
        topic
        )
    {
        await getMessaging().unsubscribeFromTopic( token, topic );
    }
}

export const firebaseService =
    new FirebaseService();
