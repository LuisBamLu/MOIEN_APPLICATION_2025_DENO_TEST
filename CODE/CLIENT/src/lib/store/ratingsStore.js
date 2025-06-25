// -- IMPORTS

import { writable } from 'svelte/store';

// -- VARIABLES

export let propertyRatings = writable(
    {
        propertyOverall: { value: 0, rating: '', img: '' },
        propertyCleanliness: { value: 0, rating: '', img: '' },
        propertyAccuracy: { value: 0, rating: '', img: '' },
        propertyLocation: { value: 0, rating: '', img: '' },
        propertyCheckIn: { value: 0, rating: '', img: '' },
        propertyMoneyValue: { value: 0, rating: '', img: '' },
        propertyCommunication: { value: 0, rating: '', img: '' }
    }
    );
export let guestRatings = writable(
    {
        guestOverall: { value: 0, rating: '', img: '' },
        guestCommunication: { value: 0, rating: '', img: '' },
        guestCheckIn: { value: 0, rating: '', img: '' },
        guestCompliance: { value: 0, rating: '', img: '' }
    }
    );
export let hostRatings = writable(
    {
        hostOverall: { value: 0, rating: '', img: '' },
        hostCommunication: { value: 0, rating: '', img: '' },
        hostCheckIn: { value: 0, rating: '', img: '' },
        hostCompliance: { value: 0, rating: '', img: '' }
    }
    );
