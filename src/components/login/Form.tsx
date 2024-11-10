"use client";

import { useState } from "react";
import Image from "next/image";
import { Heading } from "@/components/heading";
import { Field, FieldGroup, Fieldset, Label } from "@/components/fieldset";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { z } from "zod";
import { useUser } from "@/context/UserContext";

const loginSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(40, "Password must be less than 40 characters"),
});

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

export default function LoginForm() {
  const { login, verifyOtp, requiresTotp, error, loading } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    await login(email, password);
  };

  const handleOtpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await verifyOtp(otp, "");
  };
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const validateField = (field: "email" | "password", value: string) => {
    try {
      if (field === "email") {
        loginSchema.shape.email.parse(value);
        setErrors((prev) => ({ ...prev, email: "" }));
      } else if (field === "password") {
        loginSchema.shape.password.parse(value);
        setErrors((prev) => ({ ...prev, password: "" }));
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
      }
    }
  };

  const validateOtp = (value: string) => {
    try {
      otpSchema.shape.otp.parse(value);
      setErrors((prev) => ({ ...prev, otp: "" }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, otp: err.errors[0].message }));
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateField("email", value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validateField("password", value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtp(value);
    validateOtp(value);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="relative h-full sm:mx-auto sm:w-full sm:max-w-sm px-6 py-12 lg:px-8 rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image alt="Fintech logo" src="/fintech.svg" width={40} height={40} className="mx-auto h-10 w-auto dark:invert" />
          <Heading className="mt-10 text-center">Sign in to your account</Heading>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {!requiresTotp ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <Fieldset>
                <FieldGroup>
                  <Field>
                    <Label>Email Address</Label>
                    <Input name="email" value={email} onChange={handleEmailChange} className={errors.email ? "border-red-500" : ""} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </Field>
                  <Field>
                    <Label>Password</Label>
                    <Input name="password" type="password" value={password} onChange={handlePasswordChange} className={errors.password ? "border-red-500" : ""} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </Field>
                </FieldGroup>
              </Fieldset>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button color="dark/white" type="submit" className="w-full" disabled={loading || !!errors.email || !!errors.password}>
                {loading ? <FontAwesomeIcon icon={faSpinnerThird} className="fa-spin" /> : "Sign in"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <Field>
                <Label>OTP Code</Label>
                <Input name="otp" value={otp} onChange={handleOtpChange} className={errors.otp ? "border-red-500" : ""} />
                {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
              </Field>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button color="dark/white" type="submit" className="w-full" disabled={loading || !!errors.otp}>
                {loading ? <FontAwesomeIcon icon={faSpinnerThird} className="fa-spin" /> : "Verify OTP"}
              </Button>
            </form>
          )}
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{" "}
            <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
