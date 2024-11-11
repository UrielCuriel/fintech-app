"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Divider } from "@/components/divider";
import { Label, Description, Field } from "@/components/fieldset";
import { Heading, Subheading } from "@/components/heading";
import { Input } from "@/components/input";
import { Text } from "@/components/text";
import { Switch, SwitchField } from "@/components/switch";
import { useUser } from "@/context/UserContext";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/dialog";

import Image from "next/image";

export default function ProfilePage() {
  const { user, updateUser, updatePassword, enableOtp, loading, error, otpQR, configOtp } = useUser();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpEnabled, setOtpEnabled] = useState(user?.otp_enabled || false);
  const [showQR, setShowQR] = useState(false);
  const [totp, setTotp] = useState("");

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateUser({ full_name: fullName, email });
  };

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updatePassword(currentPassword, newPassword);
  };

  const handleOtpToggle = async () => {
    await configOtp();
    setShowQR(true);
  };

  const handleOtpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await enableOtp(totp);
    setShowQR(false);
  };

  useEffect(() => {
    setFullName(user?.full_name || "");
    setEmail(user?.email || "");
    setCurrentPassword("");
    setNewPassword("");
    setOtpEnabled(user?.otp_enabled || false);
  }, [user]);

  return (
    <>
      <form onSubmit={handleProfileSubmit} className="mx-auto max-w-4xl">
        <Heading>Profile</Heading>
        <Text>Update your profile information.</Text>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Full Name</Subheading>
            <Text>This will be displayed on your public profile.</Text>
          </div>
          <div>
            <Input aria-label="Full Name" name="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
        </section>
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Email</Subheading>
            <Text>This is how you log in and how we contact you.</Text>
          </div>
          <div>
            <Input type="email" aria-label="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </section>

        <Divider className="my-10" soft />

        <div className="flex justify-end gap-4">
          <Button type="reset" plain>
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            Save changes
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <form onSubmit={handlePasswordSubmit} className="mx-auto max-w-4xl mt-10">
        <Heading>Change Password</Heading>
        <Text>To change your password, enter your current password and a new password.</Text>
        <Divider className="my-10 mt-6" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>Current Password</Subheading>
            <Text>Enter your current password to authenticate.</Text>
          </div>
          <div className="space-y-4">
            <Input type="password" aria-label="Current Password" name="current_password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
        </section>

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>New Password</Subheading>
            <Text>Enter a new password to replace your current one.</Text>
          </div>
          <div className="space-y-4">
            <Input type="password" aria-label="New Password" name="new_password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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
          <Button type="submit" disabled={loading}>
            Change Password
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <div className="mx-auto max-w-4xl mt-10">
        <Heading>Security</Heading>
        <Text>Enable Multi Factor Authentication (MFA) for your account.</Text>
        <Divider className="my-10 mt-6" />
        <SwitchField className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Enable TOTP</Label>
            <Description>Enable TOTP for your account, to authenticate using an authenticator app like Google Authenticator.</Description>
          </div>
          <div>
            <Switch checked={otpEnabled} onChange={handleOtpToggle} disabled={loading || user?.otp_enabled} />
          </div>
        </SwitchField>
        <Dialog open={showQR} onClose={() => setShowQR(false)}>
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <DialogTitle>Config TOTP Application</DialogTitle>
            <DialogDescription>Scan the QR code below using your authenticator app to enable TOTP for your account.</DialogDescription>
            <DialogBody>
              <div className="flex justify-center">{otpQR && otpQR.length > 0 && <Image src={otpQR} alt="QR Code" width={200} height={200} />}</div>
              <Field>
                <Label>TOTP</Label>
                <Input name="totp_code" placeholder="000000" value={totp} onChange={(e) => setTotp(e.target.value)} />
                <Description>Enter the TOTP code from your authenticator app.</Description>
              </Field>
            </DialogBody>
            <DialogActions>
              <Button plain onClick={() => setShowQR(false)}>
                Cancel
              </Button>
              <Button type="submit">Refund</Button>
            </DialogActions>
          </form>
        </Dialog>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </>
  );
}
