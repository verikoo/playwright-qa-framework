// BookingApi.ts
// API client for Restful-Booker: one place for all endpoints (like a Page Object for the API).

import { type APIRequestContext, type APIResponse  } from "@playwright/test";
import { Booking } from "../test-data/bookings";

export class BookingApi{
    readonly request : APIRequestContext;

    constructor(request: APIRequestContext){
        this.request=request;
    }

    /** Logs in and returns the auth token (undefined if credentials are wrong). */
    async createToken(username: string, password: string): Promise< string | undefined >{
        const response= await this.request.post('/auth', {data: {username, password}});
        const body = await response.json();

        return body.token;
    }

    async getBooking(id: number): Promise<APIResponse>{
        return this.request.get(`/booking/${id}`);
    }

    async createBooking(booking: Booking): Promise<APIResponse>{
        return this.request.post('/booking', {data: booking});
    }

    async updateBooking(id: number, booking: Booking, token?: string): Promise<APIResponse>{
        return this.request.put(`/booking/${id}`,{
            data: booking,
            headers: this.authHeader(token),
        });
    }

    async partialUpdateBooking(id: number, changes: Partial<Booking>, token?: string): Promise<APIResponse>{
        return this.request.patch(`/booking/${id}`, {
            data: changes,
            headers: this.authHeader(token),
        })
    }

    async deleteBooking(id: number, token?:string): Promise<APIResponse>{
        return this.request.delete(`/booking/${id}`, {
            headers: this.authHeader(token),
        });
    }

     /** Restful-Booker expects the token as a cookie header. No token = no header. */

     private authHeader(token?: string): Record<string, string>{
        return token ? {Cookie: `token=${token}`} :{};
     }



}