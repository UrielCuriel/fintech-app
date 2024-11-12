"use server";

import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { z } from "zod";
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  username: z.string().email("Must be a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(40, "Password must be less than 40 characters"),
});

const otpSchema = z.object({
  totp_code: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

type LoginActionState = {
  success?: boolean;
  requiresTotp?: boolean;
  error?: string;
  errors?: {
    username?: string[];
    password?: string[];
  }
};

type VerifyOTPActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    totp_code?: string[];
  }
};

export async function loginAction(prevState: LoginActionState, formData: FormData) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  try {
    const validationData = loginSchema.safeParse({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    });

    if (!validationData.success) {
      return { errors: validationData.error.flatten().fieldErrors }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/access-token`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      if (result.requires_totp) {
        session.tempToken = result.temp_token;
        return { requiresTotp: true };
      } else {
        session.accessToken = result.access_token;
        return { success: true };
      }
    } else {
      return { message: result.message || "Invalid email or password" };
    }
  } catch (err) {
    console.error("Error logging in:", err);
    return { message: "Something went wrong, please try again later." };
  } finally {
    await session.save();
    if (session.accessToken) {
      redirect("/dashboard");
    }
  }
}

export async function verifyOtpAction(prevState: VerifyOTPActionState, formData: FormData) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  try {
    const validationData = otpSchema.safeParse({
      totp_code: formData.get("totp_code") as string,
    });

    if (!validationData.success) {
      return { errors: validationData.error.flatten().fieldErrors }
    }

    if (!session.tempToken) {
      return {
        message: "Error verifying OTP",
      };
    }
    formData.set("temp_token", session.tempToken);

    formData.forEach((value, key) => { console.log(key, value) });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/access-token/otp`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      if (result.access_token) {
        session.accessToken = result.access_token;
        session.tempToken = undefined;
        return { success: true };
      } else {
        return { error: "Invalid OTP" };
      } 
    } else {
      return { message: result.message || result.detail || "Invalid OTP" };
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return { message: "Something went wrong, please try again later." };
  } finally {
    await session.save();
    if (session.accessToken) {
      redirect("/dashboard");
    }
  }
}
