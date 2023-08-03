import { createContext } from "react";

export const AuthContext = createContext({
    initalized : false,
    user : null,
    signup : async () => {},
    processingSignup : false,
    singin : async () => {},
    processingSignin : false,
})