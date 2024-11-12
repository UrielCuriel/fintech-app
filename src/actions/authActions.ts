"use server";

import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { z } from "zod";

const enableMfaSchema = z.object({
  totp_code: z.string().min(6, "TOTP code must be at least 6 characters long"),
});

export type EnableMfaActionState = {
  success?: boolean;
  message?: string;
  qrUrl?: string;
  errors?: {
    enable_mfa?: string[];
    totp_code?: string[];
  }
};

export async function getQrCode() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  console.log(session.accessToken);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/generate`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "image/png",
    },
  });

  const qrData = await response.blob();
  return qrData;
}

export async function enableMfaAction(prevState: EnableMfaActionState, formData: FormData): Promise<EnableMfaActionState> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  try {

    const validationData = enableMfaSchema.safeParse({
      totp_code: formData.get("totp_code") as string,
    });

    if (!validationData.success) {
      return { errors: validationData.error.flatten().fieldErrors }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/otp/enable`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totp_code: formData.get("totp_code"),
      }),
    });

    const result = await response.json();
    if (response.ok) {
      return { success: true, message: result.message };
    } else {
      return { errors: result.errors };
    }
  } catch (error) {
    console.error("Error enabling MFA:", error);
    return { message: "Something went wrong, please try again later." };
  }
}