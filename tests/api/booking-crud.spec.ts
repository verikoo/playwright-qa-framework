// booking-crud.spec.ts
// Auth, update and delete tests for Restful-Booker, plus known bugs.

import { test, expect } from '../../fixtures/api';
import { newBooking, type Booking } from '../../test-data/bookings';
import { requireEnv } from '../../utils/env';

test.describe('Booking API: auth, update, delete', () => {
    test('valid credentials return a token', async ({ bookingApi }) => {
        const token = await bookingApi.createToken(requireEnv('API_USERNAME'), requireEnv('API_PASSWORD'));

        expect(token).toBeTruthy();
    });

    test('update without a token is forbidden', async ({ bookingApi, createdBookingId }) => {
        const response = await bookingApi.updateBooking(createdBookingId, newBooking);

        expect(response.status()).toBe(403);
    });

    test('full update with a token changes the booking', async ({ bookingApi, authToken, createdBookingId }) => {
        const updated: Booking = { ...newBooking, firstname: 'Updated', totalprice: 999 };

        const response = await bookingApi.updateBooking(createdBookingId, updated, authToken);
        expect(response.status()).toBe(200);

        // Read back to prove the change was saved
        const getResponse = await bookingApi.getBooking(createdBookingId);
        expect(await getResponse.json()).toEqual(updated);
    });

    test('partial update changes only the given field', async ({ bookingApi, authToken, createdBookingId }) => {
        const response = await bookingApi.partialUpdateBooking(createdBookingId, { lastname: 'Patched' }, authToken);
        expect(response.status()).toBe(200);

        const getResponse = await bookingApi.getBooking(createdBookingId);
        expect(await getResponse.json()).toEqual({ ...newBooking, lastname: 'Patched' });
    });

    test('delete removes the booking', async ({ bookingApi, authToken, createdBookingId }) => {
        const response = await bookingApi.deleteBooking(createdBookingId, authToken);
        // Quirk: Restful-Booker answers 201 Created for a delete (standard would be 200 or 204)
        expect(response.status()).toBe(201);

        const getResponse = await bookingApi.getBooking(createdBookingId);
        expect(getResponse.status()).toBe(404);

    });

    test('wrong credentials are rejected with 401', async ({ request }) => {
        test.fail(true, 'Known bug: Restful-Booker returns 200 with { reason: "Bad credentials" } instead of 401');

        const response = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });

        expect(response.status()).toBe(401);
    });
})