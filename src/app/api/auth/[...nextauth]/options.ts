import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {label:'email' , type:'text'},
                password: {label:'password' , type:'password'},
            },

            async authorize(Credentials : any): Promise<any>{
                await dbConnect()

                try{
                    const user = await UserModel.findOne({
                        $or: [
                            {email: Credentials.identifier},
                            {username: Credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error('User not found')
                    }

                    if(user.isVerified){
                        throw new Error('Please verify your account first')
                    }

                    const isPasswordCorrect = await bcrypt.compare(Credentials.password,  user.password)

                    if(!isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error('Password is incorrect')
                    }
                }catch(err : any){
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.username = user.username
                token.isAcceptingMessage = user.isAcceptingMessage
            }

          return token
        },

        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.username = token.username
                session.user.isAcceptingMessage = token.isAcceptingMessage
            }

            return session
        },
    },    

    session: {
        strategy: 'jwt'
    },

    secret:process.env.NEXTAUTH_SECRET,


}