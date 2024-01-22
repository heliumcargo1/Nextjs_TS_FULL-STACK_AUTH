import  {connect}  from "@/dbConfig/dbConfig";
import User from "@/models/userModal";
import { NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

export const POST = async (request:any) => {
  try {
    await connect();
    const reqBody = await request.json();
    const { password, forgotPasswordToken } = reqBody;


    const user = await User.findOne({ forgotPasswordToken });

    console.log(user);

    if (!user) {
      return NextResponse.json({ error: "User Not Found!" }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update the password field in the document
    const updatedUser = await User.updateOne(
      { _id: user._id }, // Use the appropriate identifier, like _id
      { $set: { password: hashedPassword } }
    );

    console.log("updated successfully");


      user.forgotPasswordToken = undefined;
      user.forgotPasswordTokenExpiry = undefined;
      await user.save();

      const response = NextResponse.json({
        message: "Password Updated Successful",
        success : true,
    })

    response.cookies.set("token", "", {httpOnly: true});

    return response;
  } catch (error:any) {
    NextResponse.json({ message: error.message }, { status: 500 });
  }
};