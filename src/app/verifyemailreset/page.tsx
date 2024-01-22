"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function VerifyEmailReset() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const [user, setUser] = useState({
    password: "",
    forgotPasswordToken: "",
  });

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemailpass", { token });
      setVerified(true);

      user.forgotPasswordToken = token;
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  const onSet = async (e:any) => {
    e.preventDefault();
    try {
      const res = await axios.post("api/users/updatepassword", user);
      console.log(res);

      toast.success(res.data.message);

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-white py-2">
      {verified && (
        <div>
          <h2>
            {token && (
              <div className=" items-center font-bold text-green-500 rounded-md border-8 border-l-green-600 mb-6  p-3 bg-white">
                Email Verified Successfully
              </div>
            )}
          </h2>

          <form className="flex flex-col items-start justify-start p-3 gap-2">
            

            <label>New Password :</label>
            <input
              className="inputs"
              type="text"
              id="password"
              value={user.password}
              placeholder="Enter your new password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <button className="outline_btn" onClick={onSet}>
              Set New Password
            </button>
            <p>Please do not refresh this page!</p>
          </form>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">Something Wrong!</h2>
        </div>
      )}



      <Toaster />
    </div>
  );
}