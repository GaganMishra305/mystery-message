import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificaitonEmail } from "@/helpers/sendVerificaitonEmail";
import { NextRequest } from "next/server";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try{
        const {username, email, password} = await request.json();
        const exisitingUser = await UserModel.findOne(
            {
                username,
                isVerified: true
            }
        )

        if(exisitingUser){
            return Response.json(
                {
                    success: false,
                    message: "Username already taken"
                },
                {
                    status: 400
                }
            )
        }

        const exisitngUSerByEmail = await UserModel.findOne(
            {
                email,
                isVerified: true
            }
        )
        // code for verficiation
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(exisitngUSerByEmail){
            if(exisitngUSerByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    {
                        status: 400
                    }
                )
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)

                exisitngUSerByEmail.password = hashedPassword
                exisitngUSerByEmail.verifyCode = verifyCode
                exisitngUSerByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);

                await exisitngUSerByEmail.save();
                const emailResponse = await  sendVerificaitonEmail(email, username, verifyCode);
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,

                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,

                isAcceptingMessage: true,

                messages: []
            })

            await newUser.save();
        }

        
        const emailResponse = await  sendVerificaitonEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User created successfully"
            },
            {
                status: 200
            }
        )
    }catch(err){
        console.error("Eror registering user ",err)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
   }
}