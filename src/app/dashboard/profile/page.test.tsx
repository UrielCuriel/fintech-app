import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import ProfilePage from "./page";
import { useUser } from "@/context/UserContext";
import { updateUserDataAction, updatePasswordAction } from "@/actions/userActions";
import { enableMfaAction, getQrCode } from "@/actions/authActions";
import { useActionState, useState } from "react";
import { describe, it, beforeEach, vi, expect, afterEach } from "vitest";

vi.mock("@/context/UserContext");
vi.mock("@/actions/userActions");
vi.mock("@/actions/authActions");
vi.mock(import("react"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useActionState: vi.fn(actual.useActionState),
    useState: vi.fn(actual.useState),
  };
});

//mock URL.createObjectURL
global.URL.createObjectURL = vi.fn();

describe("ProfilePage", () => {
  const mockUser = {
    full_name: "John Doe",
    email: "john.doe@example.com",
    otp_enabled: false,
  };

  beforeEach(() => {
    cleanup();
    (useUser as vi.Mock).mockReturnValue({
      user: mockUser,
      refetchUser: vi.fn(),
    });

    (useActionState as vi.Mock).mockImplementation((action, initialState) => {
      const [state, setState] = useState(initialState);
      const execute = async (data) => {
        const result = await action(data);
        setState(result);
      };
      return [state, execute, false];
    });

    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "headlessui-portal-root");
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    // Elimina el contenedor del portal después de cada prueba
    const portalRoot = document.getElementById("headlessui-portal-root");
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  it("renders profile form with user data", () => {
    render(<ProfilePage />);

    expect(screen.getByLabelText("Full Name")).toHaveProperty("value", mockUser.full_name);
    expect(screen.getByLabelText("Email")).toHaveProperty("value", mockUser.email);
  });

  it("updates user data on form submit", async () => {
    const mockUpdateUserData = vi.fn().mockResolvedValue({ success: true });
    updateUserDataAction.mockImplementation(mockUpdateUserData);

    render(<ProfilePage />);

    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane.doe@example.com" } });
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() => expect(mockUpdateUserData).toBeCalledTimes(1));
  });

  it("updates password on form submit", async () => {
    const mockUpdatePassword = vi.fn().mockResolvedValue({ success: true });
    updatePasswordAction.mockImplementation(mockUpdatePassword);

    render(<ProfilePage />);

    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "current_password" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "new_password" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "new_password" } });
    fireEvent.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => expect(mockUpdatePassword).toBeCalledTimes(1));
  });

  it("enables MFA and shows QR code", async () => {
    const mockEnableMfa = vi.fn().mockResolvedValue({ success: true });
    const mockGetQrCode = vi.fn().mockResolvedValue(new Blob(["qr_code"]));
    (enableMfaAction as vi.Mock).mockImplementation(mockEnableMfa);
    (getQrCode as vi.Mock).mockImplementation(mockGetQrCode);
    (URL.createObjectURL as vi.Mock).mockReturnValue("/qr_code.png");

    render(<ProfilePage />);

    fireEvent.click(screen.getByLabelText("Enable TOTP"));

    await waitFor(() => expect(mockGetQrCode).toHaveBeenCalled());
    expect(screen.getByAltText("QR Code")).toBeDefined();
  });

  it("displays error message when user data update fails", async () => {
    const mockUpdateUserData = vi.fn().mockResolvedValue({ success: false, message: "Update failed" });
    (updateUserDataAction as vi.Mock).mockImplementation(mockUpdateUserData);

    render(<ProfilePage />);

    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane.doe@example.com" } });
    fireEvent.click(screen.getByText("Save changes"));

    await waitFor(() => expect(screen.getByText("Update failed")).toBeDefined());
  });

  it("displays error message when password update fails", async () => {
    const mockUpdatePassword = vi.fn().mockResolvedValue({ success: false, message: "Password update failed" });
    updatePasswordAction.mockImplementation(mockUpdatePassword);

    render(<ProfilePage />);

    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "current_password" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "new_password" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "new_password" } });
    fireEvent.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => expect(screen.getByText("Password update failed")).toBeDefined());
  });

  it("displays error message when enabling MFA fails", async () => {
    const mockEnableMfa = vi.fn().mockResolvedValue({ success: false, message: "MFA enable failed" });
    (enableMfaAction as vi.Mock).mockImplementation(mockEnableMfa);

    render(<ProfilePage />);

    fireEvent.click(screen.getByLabelText("Enable TOTP"));

    await waitFor(() => expect(screen.getByText("Config TOTP Application")).toBeDefined());

    fireEvent.click(screen.getByRole("button", { name: "Enable" }));

    await waitFor(() => expect(screen.getByText("MFA enable failed")).toBeDefined());
  });
});
