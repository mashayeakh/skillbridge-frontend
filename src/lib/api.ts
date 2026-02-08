/* eslint-disable @typescript-eslint/no-explicit-any */
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

// export async function fetchTutors() {
//     const res = await fetch(`${BASE_URL}/api/tutors/all`, {
//         cache: "no-store", // important for dev
//     })

//     if (!res.ok) {
//         throw new Error("Failed to fetch tutors")
//     }

//     return res.json()
// }


// lib/api.ts
// export async function apiGet(endpoint: string) {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             // send token if you have one stored after login
//             // Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         credentials: "include",
//     });

//     console.log(res)

//     if (!res.ok) {
//         throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
//     }

//     const data = await res.json();
//     return data;
// }

// export async function apiPatch(endpoint: string, body: any) {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json",
//             // Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(body),
//         credentials: "include",
//     });

//     if (!res.ok) {
//         throw new Error(`Failed to patch ${endpoint}: ${res.status}`);
//     }

//     const data = await res.json();
//     return data;
// }

// export async function apiPost(endpoint: string, body: any) {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//         credentials: "include",
//     });
//     if (!res.ok) throw new Error(`Failed to post ${endpoint}: ${res.status}`);
//     return await res.json();
// }

// export async function apiDelete(endpoint: string) {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//     });
//     if (!res.ok) throw new Error(`Failed to delete ${endpoint}: ${res.status}`);
//     return await res.json();
// }

// // client/api/bookings.ts
// export async function getAllBookings() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/bookings`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             // Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         credentials: "include",
//     });

//     console.log("RRR", res)

//     if (!res.ok) {
//         throw new Error("Failed to fetch bookings");
//     }

//     const data = await res.json();
//     return data.data; // array of bookings
// }
