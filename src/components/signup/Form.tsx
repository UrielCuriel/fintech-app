"use client";

import { useState } from "react";
import Image from "next/image";
import { Heading } from "@/components/heading";
import { Field, FieldGroup, Fieldset, Label, ErrorMessage } from "@/components/fieldset";
import { Input, InputGroup } from "@/components/input";
import { Button } from "@/components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";

import { z } from "zod";
import { useUser } from "@/context/UserContext";

const signupSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(50),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(40, "Password must be less than 40 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
});

export default function SignupForm() {
  const { signup, error, loading } = useUser();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (field: string, value: string) => {
    try {
      if (value) {
        signupSchema.shape[field as keyof typeof signupSchema.shape].parse(value);
      }
      setErrors((prev) => ({ ...prev, [field]: "" }));
      if (field === "confirmPassword") {
        if (password !== value) {
          setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
        } else {
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: err.errors[0].message }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      signupSchema.parse({ email, fullName, password, confirmPassword });
      await signup(email, password, fullName);
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((error) => {
          setErrors((prev) => ({ ...prev, [error.path[0]]: error.message }));
        });
      }
    }
  };

  const handleBlur = (field: string, value: string) => {
    validateField(field, value);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="relative h-full sm:mx-auto sm:w-full sm:max-w-sm px-6 py-12 lg:px-8 rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image alt="Fintech logo" src="/fintech.svg" width={40} height={40} className="mx-auto h-10 w-auto dark:invert" />
          <Heading className="mt-10 text-center">Sign up for an account</Heading>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Fieldset>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => handleBlur("email", e.target.value)} invalid={!!errors.email} />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                  </Field>
                  <Field>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} onBlur={(e) => handleBlur("fullName", e.target.value)} invalid={!!errors.fullName} />
                    {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
                  </Field>
                  <Field>
                    <Label htmlFor="password">Password</Label>
                    <InputGroup>
                      <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onBlur={(e) => handleBlur("password", e.target.value)} invalid={!!errors.password} />
                      <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="w-5 h-5 absolute right-2 top-2 text-gray-500 cursor-pointer" onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} />
                    </InputGroup>
                    {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                  </Field>
                  <Field>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <InputGroup>
                      <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={(e) => handleBlur("confirmPassword", e.target.value)} invalid={!!errors.confirmPassword} />
                      <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} className="w-5 h-5 absolute right-2 top-2 text-gray-500 cursor-pointer" onMouseDown={() => setShowConfirmPassword(true)} onMouseUp={() => setShowConfirmPassword(false)} />
                    </InputGroup>
                    {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
                  </Field>
                </FieldGroup>
              </Fieldset>
              <Button type="submit" className="w-full" disabled={loading || !!errors.email || !!errors.fullName || !!errors.password || !!errors.confirmPassword}>
                {loading ? (
                  <>
                    <span className="mr-2">Loading</span>
                    <FontAwesomeIcon icon={faSpinnerThird} spin />
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
            <p className="mt-10 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="font-semibold leading-6 text-yellow-500 hover:text-yellow-600 dark:text-blue-500 dark:hover:text-blue-600">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
