import { render, screen, cleanup } from "@testing-library/react";
import LoginForm from "./Form";
import { useActionState } from "react";
import { describe, it, beforeEach, vi, expect } from "vitest";

vi.mock(import("react"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useActionState: vi.fn(actual.useActionState),
  };
});

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders login form initially", () => {
    (useActionState as vi.Mock).mockReturnValue([{ requiresTotp: false, errors: {}, message: "" }, vi.fn(), false]);

    render(<LoginForm />);

    expect(screen.getByLabelText(/Email Address/i)).toBeDefined();
    expect(screen.getByLabelText(/Password/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Sign in/i })).toBeDefined();
  });

  it("renders OTP form when requiresTotp is true", () => {
    (useActionState as vi.Mock).mockReturnValueOnce([{ requiresTotp: true, errors: {}, message: "" }, vi.fn(), false]).mockReturnValueOnce([{ errors: {}, message: "" }, vi.fn(), false]);

    render(<LoginForm />);

    expect(screen.getByLabelText(/OTP Code/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Verify OTP/i })).toBeDefined();
  });

  it("displays error messages for login form", () => {
    (useActionState as vi.Mock).mockReturnValue([{ requiresTotp: false, errors: { username: "Invalid email", password: "Invalid password" }, message: "" }, vi.fn(), false]);

    render(<LoginForm />);

    expect(screen.getByText(/Invalid email/i)).toBeDefined();
    expect(screen.getByText(/Invalid password/i)).toBeDefined();
  });

  it("displays error message for OTP form", () => {
    (useActionState as vi.Mock).mockReturnValueOnce([{ requiresTotp: true, errors: {}, message: "" }, vi.fn(), false]).mockReturnValueOnce([{ errors: { totp_code: "Invalid OTP" }, message: "" }, vi.fn(), false]);

    render(<LoginForm />);

    expect(screen.getByText(/Invalid OTP/i)).toBeDefined();
  });

  it("disables login button when pending", () => {
    (useActionState as vi.Mock).mockReturnValue([{ requiresTotp: false, errors: {}, message: "" }, vi.fn(), true]);

    render(<LoginForm />);

    expect(screen.getByRole("button", { name: /Sign in/i })).toHaveProperty("disabled", true);
  });

  it("disables OTP button when pending", () => {
    (useActionState as vi.Mock).mockReturnValueOnce([{ requiresTotp: true, errors: {}, message: "" }, vi.fn(), false]).mockReturnValueOnce([{ errors: {}, message: "" }, vi.fn(), true]);

    render(<LoginForm />);

    expect(screen.getByRole("button", { name: "Verify OTP" })).toHaveProperty("disabled", true);
  });
});
