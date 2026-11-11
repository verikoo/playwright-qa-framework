// bookings.ts
// Booking data for API tests.
export interface Booking{
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid:boolean;
    bookingdates:{
        checkin: string;
        checkout:string;
    };
    additionalneeds: string;
}

export const newBooking: Booking={
    firstname: 'veriko',
    lastname: 'tester',
    totalprice: 150,
    depositpaid: true,
    bookingdates: {
    checkin: '2026-12-01',
    checkout: '2026-12-05',
  },
  additionalneeds: 'Breakfast',
}