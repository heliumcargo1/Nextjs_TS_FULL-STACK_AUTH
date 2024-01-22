import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModal";
import { NextResponse } from "next/server";

// *this page is just to verify the email exists or not and if exists send email, once the user clicks on email then redirect to newpassword page


export async function POST (request:any){
    try {
        await connect();
        const reqBody = await request.json();
        const { email } = reqBody;

        console.log(reqBody);

        // If user is existing
        const user = await User.findOne({email});

        console.log(user);

        if(!user){
            return NextResponse.json({error: 'Email not found'}, {status: 400});
        }

        //hash passwrod
        // const salt = await bcryptjs.genSalt(10);
        // const hashedPassword = await bcryptjs.hash(password, salt);

        // create new user
        // const newUser = await new User({
        //     username,
        //     email,
        //     password : hashedPassword
        // }).save();

        // console.log(newUser);

        await sendEmail({email, emailType: "RESET", userId: user._id});

        return NextResponse.json(
            {message : "user email found!", success: true, user},
            {status:200}
            )

        
    }  catch (error:any) {
        NextResponse.json({message: error.message}, {status: 500});
    }
}
