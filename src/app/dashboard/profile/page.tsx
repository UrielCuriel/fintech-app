"use client";
import { Button } from "@/components/button";
import { Divider } from "@/components/divider";
import { Label, Description, Field, ErrorMessage } from "@/components/fieldset";
import { Heading, Subheading } from "@/components/heading";
import { Input } from "@/components/input";
import { Text } from "@/components/text";
import { Switch, SwitchField } from "@/components/switch";
import { useUser } from "@/context/UserContext";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/dialog";
import { updateUserDataAction, updatePasswordAction } from "@/actions/userActions";
import { enableMfaAction, getQrCode } from "@/actions/authActions";
import { useActionState, useEffect, useState } from "react";

import Image from "next/image";

export default function ProfilePage() {
  const { user, refetchUser } = useUser();
  const [updateUserDataState, updateUserData, isPendingUserData] = useActionState(updateUserDataAction, { success: false });
  const [updatePasswordState, updatePassword, isPendingPassword] = useActionState(updatePasswordAction, { success: false });
  const [enableMfaState, enableMfa, isPendingEnableMFA] = useActionState(enableMfaAction, { success: false });
  const [showQR, setShowQR] = useState(false);
  const [otpQR, setOtpQR] = useState("");

  const toggleMFA = async (isEnableMFA: boolean) => {
    if (isEnableMFA) {
      const qrUrl = URL.createObjectURL(await getQrCode());
      console.log(qrUrl);
      setOtpQR(qrUrl);
      setShowQR(true);
    }
  };

  useEffect(() => {
    if (enableMfaState.success) {
      setShowQR(false);
    }
  }, [enableMfaState.success]);

  useEffect(() => {
    if (updateUserDataState.success || updatePasswordState.success || enableMfaState.success) {
      refetchUser();
    }
  }, [updateUserDataState.success, updatePasswordState.success, enableMfaState.success, refetchUser]);

  return (
    <>
      <form action={updateUserData} className="mx-auto max-w-4xl">
        <Heading>Profile</Heading>
        <Text>Update your profile information.</Text>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Full Name</Subheading>
            <Text>This will be displayed on your public profile.</Text>
          </div>
          <div>
            <Field>
              <Input aria-label="Full Name" name="full_name" defaultValue={user?.full_name} invalid={!!updateUserDataState.errors?.full_name} />
              {updateUserDataState.errors?.full_name && <ErrorMessage>{updateUserDataState.errors?.full_name}</ErrorMessage>}
            </Field>
          </div>
        </section>
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Email</Subheading>
            <Text>This is how you log in and how we contact you.</Text>
          </div>
          <div>
            <Field>
              <Input type="email" aria-label="Email" name="email" defaultValue={user?.email} invalid={!!updateUserDataState.errors?.email} />
              {updateUserDataState.errors?.email && <ErrorMessage>{updateUserDataState.errors?.email}</ErrorMessage>}
            </Field>
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain>
            Reset
          </Button>
          <Button type="submit" disabled={isPendingUserData || !!updateUserDataState.errors}>
            Save changes
          </Button>
        </div>
        {updateUserDataState.message && <p className="text-red-500 text-sm">{updateUserDataState.message}</p>}
      </form>

      <form action={updatePassword} className="mx-auto max-w-4xl mt-10">
        <Heading>Change Password</Heading>
        <Text>To change your password, enter your current password and a new password.</Text>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Current Password</Subheading>
            <Text>Enter your current password to authenticate.</Text>
          </div>
          <div className="space-y-4">
            <Input type="password" aria-label="Current Password" name="current_password" invalid={!!updatePasswordState.errors?.current_password} />
            {updatePasswordState.errors?.current_password && <ErrorMessage>{updatePasswordState.errors?.current_password}</ErrorMessage>}
          </div>
        </section>

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>New Password</Subheading>
            <Text>Enter a new password to replace your current one.</Text>
          </div>
          <div className="space-y-4">
            <Input type="password" aria-label="New Password" name="new_password" invalid={!!updatePasswordState.errors?.new_password} />
            {updatePasswordState.errors?.new_password && <ErrorMessage>{updatePasswordState.errors?.new_password}</ErrorMessage>}
          </div>
        </section>

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Confirm New Password</Subheading>
            <Text>Re-enter your new password to confirm.</Text>
          </div>
          <div className="space-y-4">
            <Input type="password" aria-label="Confirm New Password" name="confirm_new_password" />
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain>
            Reset
          </Button>
          <Button type="submit" disabled={isPendingPassword || !!updatePasswordState.errors}>
            Change Password
          </Button>
        </div>
        {updatePasswordState.message && <p className="text-red-500 text-sm">{updatePasswordState.message}</p>}
      </form>

      <div className="mx-auto max-w-4xl mt-10">
        <form action={enableMfa} className="space-y-6">
          <Heading>Security</Heading>
          <Text>Enable Multi Factor Authentication (MFA) for your account.</Text>
          <Divider className="my-10 mt-6" />
          <SwitchField className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Enable TOTP</Label>
              <Description>Enable TOTP for your account, to authenticate using an authenticator app like Google Authenticator.</Description>
            </div>
            <div>
              <Switch checked={user?.otp_enabled} onChange={toggleMFA} disabled={isPendingEnableMFA || user?.otp_enabled} />
            </div>
          </SwitchField>
        </form>
        <Dialog open={showQR} onClose={() => setShowQR(false)}>
          <form action={enableMfa} className="space-y-6">
            <DialogTitle>Config TOTP Application</DialogTitle>
            <DialogDescription>Scan the QR code below using your authenticator app to enable TOTP for your account.</DialogDescription>
            <DialogBody>
              <div className="flex justify-center">{otpQR && otpQR.length > 0 && <Image src={otpQR} alt="QR Code" width={200} height={200} />}</div>
              <Field>
                <Label>TOTP</Label>
                <Input name="totp_code" placeholder="000000" invalid={!!enableMfaState.errors?.totp_code} />
                <Description>Enter the TOTP code from your authenticator app.</Description>
                {enableMfaState.errors?.totp_code && <ErrorMessage>{enableMfaState.errors?.totp_code}</ErrorMessage>}
              </Field>
              {enableMfaState.message && <p className="text-red-500 text-sm">{enableMfaState.message}</p>}
            </DialogBody>
            <DialogActions>
              <Button plain onClick={() => setShowQR(false)}>
                Cancel
              </Button>
              <Button type="submit">Enable</Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
}
