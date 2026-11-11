// booking.spec.ts
// API tests for Restful-Booker: read and create bookings.
import { test, expect } from '@playwright/test';
import { newBooking } from '../../test-data/bookings';
import { request } from 'node:http';

test.describe('Booking Api', () => {
    test('return lists a booking ids', async ({ request }) => {
        const response = await request.get('/booking');

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        expect(typeof body[0].bookingid).toBe('number');
    });

    test('creates a booking and reads it back', async ({ request }) => {
        // Create
        const createResponse = await request.post('/booking', { data: newBooking });
        expect(createResponse.status()).toBe(200);

        const created = await createResponse.json();
        expect(created.bookingid).toBeGreaterThan(0);
        expect(created.booking).toEqual(newBooking);

        // Read it back: prove it was really saved
        const getResponse = await request.get(`/booking/${created.bookingid}`);
        expect(getResponse.status()).toBe(200);
        expect(await getResponse.json()).toEqual(newBooking);
    });

    test('returns 404 for a booking that does not exist', async ({ request }) => {
        const response = await request.get('/booking/999999999');

        expect(response.status()).toBe(404);

    });
});