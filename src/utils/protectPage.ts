import { redirect } from "next/navigation";
import { cookiesType, getSession } from "./session";


export async function isSessionExistORRedurect(redirectPath:string="/login",cookieKey:cookiesType = "sky-session") {
    const session = (await getSession(cookieKey))
    if (!session) {
       return redirect(redirectPath);
    }
    console.log('se'+session);
    
    return session
}