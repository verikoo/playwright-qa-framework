// booking-schema.spec.ts
// Contract tests: Restful-Booker responses must match their schemas.
import { test, expect } from '../../fixtures/api';
import { newBooking } from '../../test-data/bookings';
import {
    BookingSchema,
    BookingIdListSchema,
    CreateBookingResponseSchema
} from '../../schemas/booking.schema';
import { expectToMatchSchema } from '../../utils/schema';

test.describe('Booking API contracts', () => {
    test('booking id list matches its schema', async ({ request }) => {
        const response = await request.get('/booking');
        expect(response.status()).toBe(200);

        expectToMatchSchema(await response.json(), BookingIdListSchema);
    });

    test('create booking response matches itss chema', async ({ bookingApi, authToken }) => {
        const response = await bookingApi.createBooking(newBooking);
        const body = await response.json();

        try {
            expect(response.status()).toBe(200);
            expectToMatchSchema(body, CreateBookingResponseSchema);
        } finally {
            // Clean up even if the assertions fail
            await bookingApi.deleteBooking(body.bookingid, authToken);
        }

    });

    test('get booking response matches its schema', async ({ bookingApi, createdBookingId }) => {
        const response = await bookingApi.getBooking(createdBookingId);
        expect(response.status()).toBe(200);

        expectToMatchSchema(await response.json(), BookingSchema);
    });

    test('schema rejects invalid booking data', () => {
        const brokenBooking = {
            ...newBooking,
            totalprice: '150', // string instead of number
            bookingdates: { checkin: 'tomorrow', checkout: '2026-12-05' },  // not a date
            unexpectedField: true, // extra field
        };

        const result = BookingSchema.safeParse(brokenBooking);

        expect(result.success).toBe(false);
        const problemPaths = result.error?.issues.map((issue) => issue.path.join('.'));
        expect(problemPaths).toEqual(
            expect.arrayContaining(['totalprice', 'bookingdates.checkin']),
        );
    });
});