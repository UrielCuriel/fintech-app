"use server";

import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { z } from "zod";
import { redirect } from 'next/navigation';


const signupSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(40, "Password must be less than 40 characters"),
  full_name: z.string().min(3, "Full name must be at least 3 characters").max(100, "Full name must be less than 100 characters"),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, { message: "Passwords do not match", path: ["confirmPassword"] });

const updateUserDataSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters").max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Must be a valid email"),
});

const updatePasswordSchema = z.object({
  current_password: z.string().min(8, "Password must be at least 8 characters").max(40, "Password must be less than 40 characters"),
  new_password: z.string().min(8, "Password must be at least 8 characters").max(40, "Password must be less than 40 characters"),
});

export type SignupActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    full_name?: string[];
    confirm_password?: string[];
  }
};

type UpdateUserDataActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    email?: string[];
    full_name?: string[];
  }
};

type UpdatePasswordActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    current_password?: string[];
    new_password?: string[];
  }
};

export async function signupAction(prevState: SignupActionState, formData: FormData): Promise<SignupActionState> {
  let success = false;
  try {
    // Validación de datos usando Zod
    const validationData = signupSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      full_name: formData.get("full_name"),
      confirm_password: formData.get("confirm_password"),
    });

    if (!validationData.success) {
      return { success: false, errors: validationData.error.flatten().fieldErrors };
    }

    // Petición al backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        full_name: formData.get("full_name"),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Something went wrong, please try again later.",
      };
    }
    success = true;
    return { success: true };
  } catch (err) {
    console.error("Error signing up:", err);
    return { success: false, message: "Something went wrong, please try again later." };
  } finally {
    if (success) {
      redirect("/login");
    }
  }
}


export async function updateUserDataAction(prevState: UpdateUserDataActionState, formData: FormData) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  try {
    const validationData = updateUserDataSchema.safeParse({
      email: formData.get("email"),
      full_name: formData.get("full_name"),
    });

    if (!validationData.success) {
      return { errors: validationData.error.flatten().fieldErrors }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        email: formData.get("email"),
        full_name: formData.get("full_name"),
      }),
    });

    const result = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      return { message: result.message || "Something went wrong, please try again later." };
    }
  } catch (err) {
    console.error("Error updating user data:", err);
    return { message: "Something went wrong, please try again later." };
  }
}

export async function updatePasswordAction(prevState: UpdatePasswordActionState, formData: FormData) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  try {
    const validationData = updatePasswordSchema.safeParse({
      current_password: formData.get("current_password"),
      new_password: formData.get("new_password"),
    });

    if (!validationData.success) {
      return { errors: validationData.error.flatten().fieldErrors }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        current_password: formData.get("current_password"),
        new_password: formData.get("new_password"),
      }),
    });

    const result = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      return { message: result.message || "Something went wrong, please try again later." };
    }
  } catch (err) {
    console.error("Error updating password:", err);
    return { message: "Something went wrong, please try again later." };
  }
}
