import 'next-auth'
import { DefaultSession } from 'next-auth';

export module 'next-auth' {
    interface User{
        _id? : string;
        isVerified? : boolean;
        isAcceptingMessage? : boolean;
        username? : string;
    }

    interface Session{
        user:{
            _id? : string;
            isVerified? : boolean;
            isAcceptingMessage? : boolean;
            username? : string;
        } & DefaultSession['user']
    }    
}

export module 'next-auth/jwt' {
    interface JWT{
        _id? : string;
        isVerified? : boolean;
        isAcceptingMessage? : boolean;
        username? : string;
    }
}