"use server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

export async function getUser() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.user) {
    if (session.accessToken) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (response.ok) {
        session.user = await response.json();
      } else {
        session.user = null;
      }
    }
  }

  return session.user;
}

export async function logout() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  session.destroy();
}