import {  NextResponse } from "next/server";
import User from "@/models/userModal";
import { connect } from "@/dbConfig/dbConfig";
import { Cookie } from "next/font/google";

connect();


export async function POST(request:any){

    try {
        const reqBody = await request.json()
        const {token} = reqBody // user requested token
        console.log(token);

        const user = await User.findOne({forgotPasswordToken: token, forgotPasswordTokenExpiry: {$gt: Date.now()}});

        if (!user) {
            return NextResponse.json({error: "Invalid token"}, {status: 400})
        }
        console.log(user);

        user.forgotPasswordToken = token;

        const response = NextResponse.json({
            message: "Email verified successfully",
            success : true,
        })

        response.cookies.set("token", token, {httpOnly: true});

        return response;

        

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

}
