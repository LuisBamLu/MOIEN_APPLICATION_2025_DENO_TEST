// -- IMPORTS

import { EmailStrategy } from './email_strategy';
import { PushStrategy } from './push_strategy';

// -- TYPES

export class NotificationFactory
{
    // -- OPERATIONS

    static createStrategy(
        notificationMedium
        )
    {
        switch( notificationMedium )
        {
            case 'email':
                return new EmailStrategy();
            case 'push':
                return new PushStrategy();
            default:
                throw new Error( 'Invalid notification medium' );
        }
    }
}
