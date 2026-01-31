import { postReq } from "./postReq";
import { LoginInput } from "../validations/login.schema";
import { getReq } from "./getReq";
import { Session } from "better-auth";


//login
export async function loginUser(payload: LoginInput) {
    return postReq("/api/auth/sign-in/email", payload);
}


//session
export async function getSession(): Promise<Session | null> {
    return getReq<Session | null>("/api/auth/session");
}
// logout
export async function logoutUser() {
    return postReq("/api/auth/sign-out");
}