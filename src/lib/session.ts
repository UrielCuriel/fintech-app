import { SessionOptions } from "iron-session";

export interface SessionData {
  accessToken?: string;
  tempToken?: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
    otp_enabled?: boolean;
  } | null;
}

export const defaultSession: SessionData = {

};

export const sessionOptions: SessionOptions = {
  // You need to create a secret key at least 32 characters long.
  password: process.env.SESSION_SECRET as string,
  cookieName: "session",
  cookieOptions: {
    httpOnly: true,
    // Secure only works in `https` environments. So if the environment is `https`, it'll return true.
    secure: process.env.NODE_ENV === "production",
  },
};