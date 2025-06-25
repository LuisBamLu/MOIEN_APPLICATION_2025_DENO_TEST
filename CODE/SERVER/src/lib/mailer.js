// -- IMPORTS

import nodemailer from 'nodemailer';

// -- CONSTANTS

export const transporter = nodemailer.createTransport(
    {
        host : 'ssl0.ovh.net',
        port : 465,
        secure : true,
        auth :
            {
                user : 'contact@groupbam.com',
                pass : 'qX3xrtHXJVegmUahX4X5T!Hyrfc'
            }
    }
    );
