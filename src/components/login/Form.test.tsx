import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import LoginForm from "./Form";
import { useUser } from "@/context/UserContext";

vi.mock("@/context/UserContext");

describe("LoginForm", () => {
  const mockLogin = vi.fn();
  const mockVerifyOtp = vi.fn();
  const mockUseUser = {
    login: mockLogin,
    verifyOtp: mockVerifyOtp,
    requiresTotp: false,
    error: null,
    loading: false,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (useUser as vi.Mock).mockReturnValue(mockUseUser);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders login form", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email address/i)).toBeDefined();
    expect(screen.getByLabelText(/password/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDefined();
  });

  it("validates email and password fields", () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "short" } });

    expect(screen.getByText(/must be a valid email/i)).toBeDefined();
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeDefined();
  });

  it("calls login function on form submit", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("renders OTP form when requiresTotp is true", () => {
    mockUseUser.requiresTotp = true;
    render(<LoginForm />);
    expect(screen.getByLabelText(/otp code/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /verify otp/i })).toBeDefined();
  });

  it("validates OTP field", () => {
    mockUseUser.requiresTotp = true;
    render(<LoginForm />);
    const otpInput = screen.getByLabelText(/otp code/i);

    fireEvent.change(otpInput, { target: { value: "123" } });

    expect(screen.getByText(/otp must be exactly 6 digits/i)).toBeDefined();
  });

  it("calls verifyOtp function on OTP form submit", async () => {
    mockUseUser.requiresTotp = true;
    render(<LoginForm />);
    const otpInput = screen.getByLabelText(/otp code/i);
    const submitButton = screen.getByRole("button", { name: /verify otp/i });

    fireEvent.change(otpInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    expect(mockVerifyOtp).toHaveBeenCalledWith("123456", "");
  });
});
