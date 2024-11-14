"use client";

import Image from "next/image";
import { Heading } from "@/components/heading";
import { Field, FieldGroup, Fieldset, Label, ErrorMessage } from "@/components/fieldset";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { loginAction, verifyOtpAction } from "@/actions/loginActions";
import { useActionState } from "react";

export default function LoginForm() {
  const [loginState, loginFormAction, isPendingLogin] = useActionState(loginAction, { requiresTotp: false });
  const [verifyOtpState, verifyOtpFormAction, isPendingVerify] = useActionState(verifyOtpAction, { success: false });
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="relative h-full sm:mx-auto sm:w-full sm:max-w-sm px-6 py-12 lg:px-8 rounded-xl bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset] forced-colors:outline">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image alt="Fintech logo" src="/fintech.svg" width={40} height={40} className="mx-auto h-10 w-auto dark:invert" />
          <Heading className="mt-10 text-center">Sign in to your account</Heading>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {!loginState.requiresTotp ? (
            <form action={loginFormAction} className="space-y-6">
              <Fieldset>
                <FieldGroup>
                  <Field>
                    <Label>Email Address</Label>
                    <Input name="username" invalid={!!loginState.errors?.username} />
                    {loginState.errors?.username && <ErrorMessage>{loginState.errors?.username}</ErrorMessage>}
                  </Field>
                  <Field>
                    <Label>Password</Label>
                    <Input name="password" type="password" invalid={!!loginState.errors?.password} />
                    {loginState.errors?.password && <ErrorMessage>{loginState.errors?.password}</ErrorMessage>}
                  </Field>
                </FieldGroup>
              </Fieldset>
              {loginState.message && <p className="text-red-500 text-sm/6">{loginState.message}</p>}
              <Button color="dark/white" type="submit" className="w-full" disabled={isPendingLogin}>
                {isPendingLogin ? <i className="fa-duotone fa-spinner-third fa-spin"></i> : "Sign in"}
                <span className="sr-only">Sign in</span>
              </Button>
            </form>
          ) : (
            <form action={verifyOtpFormAction} className="space-y-6">
              <Field>
                <Label>OTP Code</Label>
                <Input name="totp_code" invalid={!!verifyOtpState.errors?.totp_code} />
                {verifyOtpState.errors?.totp_code && <ErrorMessage>{verifyOtpState.errors?.totp_code}</ErrorMessage>}
              </Field>
              {verifyOtpState.message && <p className="text-red-500 text-sm/6">{verifyOtpState.message}</p>}
              <Button color="dark/white" type="submit" className="w-full" disabled={isPendingVerify} id="verify-otp">
                {isPendingVerify ? <i className="fa-duotone fa-spinner-third fa-spin"></i> : "Verify OTP"}
                <span className="sr-only">Verify OTP</span>
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
