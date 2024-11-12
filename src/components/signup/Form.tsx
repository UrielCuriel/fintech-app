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
import { useActionState } from "react";
import { signupAction } from "@/actions/userActions";

export default function SignupForm() {
  const [signUpState, signUp, isPendingSignUp] = useActionState(signupAction, { success: false });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="relative h-full sm:mx-auto sm:w-full sm:max-w-sm px-6 py-12 lg:px-8 rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image alt="Fintech logo" src="/fintech.svg" width={40} height={40} className="mx-auto h-10 w-auto dark:invert" />
          <Heading className="mt-10 text-center">Sign up for an account</Heading>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action={signUp} className="space-y-6">
              <Fieldset>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" invalid={!!signUpState.errors?.email} />
                    {signUpState.errors?.email && <ErrorMessage>{signUpState.errors?.email}</ErrorMessage>}
                  </Field>
                  <Field>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="full_name" type="text" invalid={!!signUpState.errors?.full_name} />
                    {signUpState.errors?.full_name && <ErrorMessage>{signUpState.errors?.full_name}</ErrorMessage>}
                  </Field>
                  <Field>
                    <Label htmlFor="password">Password</Label>
                    <InputGroup>
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} invalid={!!signUpState.errors?.password} />
                      <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="w-5 h-5 absolute right-2 top-2 text-gray-500 cursor-pointer" onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} />
                    </InputGroup>
                    {signUpState.errors?.password && <ErrorMessage>{signUpState.errors?.password}</ErrorMessage>}
                  </Field>
                  <Field>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <InputGroup>
                      <Input id="confirmPassword" name="confirm_password" type={showConfirmPassword ? "text" : "password"} invalid={!!signUpState.errors?.confirm_password} />
                      <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} className="w-5 h-5 absolute right-2 top-2 text-gray-500 cursor-pointer" onMouseDown={() => setShowConfirmPassword(true)} onMouseUp={() => setShowConfirmPassword(false)} />
                    </InputGroup>
                    {signUpState.errors?.confirm_password && <ErrorMessage>{signUpState.errors?.confirm_password}</ErrorMessage>}
                  </Field>
                </FieldGroup>
              </Fieldset>
              <Button type="submit" className="w-full" disabled={isPendingSignUp || !!signUpState.errors}>
                {isPendingSignUp ? (
                  <>
                    <span className="mr-2">Loading</span>
                    <FontAwesomeIcon icon={faSpinnerThird} spin />
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
              {signUpState.message && <p className="text-red-500 text-sm">{signUpState.message}</p>}
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
