// booking.schema.ts
// Contracts for Restful-Booker responses: the shape and types the API must return.
import { z } from 'zod';

export const BookingSchema = z.strictObject({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    totalprice: z.number().int().nonnegative(),
    depositpaid: z.boolean(),
    bookingdates: z.strictObject({
        checkin: z.iso.date(),
        checkout: z.iso.date(),
    }),
    additionalneeds: z.string().optional(),
});

export const CreateBookingResponseSchema = z.strictObject({
    bookingid: z.number().int().positive(),
    booking: BookingSchema,
});

export const BookingIdListSchema = z.array(
    z.object({
        bookingid: z.number().int().positive(),
    }),
);