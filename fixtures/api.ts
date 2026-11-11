// api.ts
// Custom fixtures for API tests: an API client, an auth token, and a booking with automatic cleanup.
import { test as base, expect } from '@playwright/test';
import { BookingApi } from '../api/BookingApi';
import { newBooking } from '../test-data/bookings';
import { requireEnv } from '../utils/env';
import { request } from 'node:http';


type ApiFixtures = {
    bookingApi: BookingApi;
    authToken: string;
    createdBookingId: number;
};

export const test = base.extend<ApiFixtures>({
    bookingApi: async ({ request }, use) => {
        await use(new BookingApi(request));
    },

    authToken: async ({ bookingApi }, use) => {
        const token = await bookingApi.createToken(requireEnv('API_USERNAME'), requireEnv('API_PASSWORD'));
        expect(token, 'Auth should return a token').toBeTruthy();
        await use(token as string);
    },

    createdBookingId: async ({ bookingApi, authToken }, use) => {
        // Setup: create a fresh booking for this test
        const response = await bookingApi.createBooking(newBooking);
        expect(response.status()).toBe(200);
        const { bookingid } = await response.json();

        await use(bookingid);


        // Teardown: delete it afterwards, so no test data is left behind
        await bookingApi.deleteBooking(bookingid, authToken);
    },
});

export { expect };