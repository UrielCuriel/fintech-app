import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect, afterEach } from "vitest";
import { UserProvider, useUser } from "./UserContext";
import Cookies from "js-cookie";

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

const TestComponent = () => {
  const { user, login, logout, fetchUser, updateUser, configOtp, enableOtp, verifyOtp, updatePassword } = useUser();

  return (
    <div>
      <button onClick={() => login("test@example.com", "password")} aria-label="Login">
        Login
      </button>
      <button onClick={logout} aria-label="Logout">
        Logout
      </button>
      <button onClick={fetchUser} aria-label="Fetch User">
        Fetch User
      </button>
      <button onClick={() => updateUser({ email: "new@example.com" })} aria-label="Update User">
        Update User
      </button>
      <button onClick={() => configOtp()} aria-label="Enable OTP">
        Enable OTP
      </button>
      <button onClick={() => enableOtp("123456")} aria-label="Confirm OTP">
        Confirm OTP
      </button>
      <button onClick={() => verifyOtp("123456")} aria-label="Verify OTP">
        Verify OTP
      </button>
      <button onClick={() => updatePassword("oldPassword", "newPassword")} aria-label="Update Password">
        Update Password
      </button>
      {user && <div>{user.email}</div>}
    </div>
  );
};

describe("UserContext", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
    mockFetch.mockClear();
    Cookies.get.mockClear();
    Cookies.set.mockClear();
    Cookies.remove.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks(); // Resetea todos los mocks para evitar fugas entre pruebas
    cleanup();
  });
  it("should login a user", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "token" }),
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    screen.getByRole("button", { name: "Login" }).click();

    await waitFor(() => expect(Cookies.set).toHaveBeenCalledWith("access_token", "token", { secure: true }));
  });

  it("should logout a user", async () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    screen.getByRole("button", { name: "Logout" }).click();

    await waitFor(() => expect(Cookies.remove).toHaveBeenCalledWith("access_token"));
  });

  it("should fetch user data", async () => {
    Cookies.get.mockReturnValue("token");

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ email: "test@example.com" }),
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    screen.getByRole("button", { name: "Fetch User" }).click();

    await waitFor(() => expect(screen.getByText("test@example.com")).toBeDefined());
  });

  it("should update user data", async () => {
    Cookies.get.mockReturnValue("token");
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ email: "new@example.com" }),
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    screen.getByRole("button", { name: "Update User" }).click();

    await waitFor(() => expect(screen.getByText("new@example.com")).toBeDefined());
  });

  it("should enable OTP", async () => {
    Cookies.get.mockReturnValue("token");
    mockFetch.mockResolvedValueOnce({ ok: true });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ temp_token: "token" }),
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(),
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    screen.getByRole("button", { name: "Enable OTP" }).click();

    await waitFor(() => {
      const specificCalls = mockFetch.mock.calls.filter((call) => call[0].includes("auth/otp/generate"));
      expect(specificCalls).toHaveLength(1);
    });
  });

  it("should confirm OTP", async () => {
    Cookies.get.mockReturnValue("token");
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ email: "new@example.com" }),
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(),
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ otp_enabled: true }),
    });
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    screen.getByRole("button", { name: "Enable OTP" }).click();
    screen.getByRole("button", { name: "Confirm OTP" }).click();
    await waitFor(() => {
      console.log(mockFetch.mock.calls);
      const specificCalls = mockFetch.mock.calls.filter((call) => call[0].includes("/auth/otp/enable"));
      expect(specificCalls).toHaveLength(1);
    });
  });

  it("should verify OTP", async () => {
    console.log("verify otp");
    Cookies.get.mockReturnValue("token");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      call: "1",
      json: async () => ({ temp_token: "token", otp_enabled: true }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      call: "2",
      json: async () => ({ access_token: "token" }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      call: "3",
      json: async () => ({ email: "test@example.com" }),
    });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    //first call login
    screen.getByRole("button", { name: "Login" }).click();

    screen.getByRole("button", { name: "Verify OTP" }).click();

    await waitFor(() => {
      const specificCalls = mockFetch.mock.calls;
      console.log(specificCalls);
    });

    await waitFor(() => expect(Cookies.set).toHaveBeenCalledWith("access_token", "token", { secure: true }));
  });

  it("should update password", async () => {
    Cookies.get.mockReturnValue("token");
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    screen.getByRole("button", { name: "Update Password" }).click();

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
  });
});
