import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ProfilePage from "@/app/dashboard/profile/page";
import { useUser } from "@/context/UserContext";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Cookies from "js-cookie";

vi.mock("@/context/UserContext");

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ProfilePage", () => {
  const mockUpdateUser = vi.fn();
  const mockUpdatePassword = vi.fn();
  const mockEnableOtp = vi.fn();

  beforeEach(() => {
    useUser.mockReturnValue({
      user: {
        full_name: "John Doe",
        email: "john.doe@example.com",
        otp_enabled: false,
      },
      updateUser: mockUpdateUser,
      updatePassword: mockUpdatePassword,
      enableOtp: mockEnableOtp,
      loading: false,
      error: null,
      otpQR: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ full_name: "John Doe", email: "john.doe@example.com" }),
    });
    Cookies.get.mockReturnValue("token");
  });

  afterEach(() => {
    vi.clearAllMocks();
    Cookies.get.mockClear();
    cleanup();
  });

  it("renders profile information", async () => {
    render(<ProfilePage />);
    expect(screen.getByText("Profile")).toBeDefined();
    expect(screen.getByText("Update your profile information.")).toBeDefined();

    expect(screen.getByLabelText("Full Name")).toHaveProperty("value", "John Doe");
    expect(screen.getByLabelText("Email")).toHaveProperty("value", "john.doe@example.com");
  });

  it("updates profile information", () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane.doe@example.com" } });
    fireEvent.submit(screen.getByText("Save changes"));
    expect(mockUpdateUser).toHaveBeenCalledWith({ full_name: "Jane Doe", email: "jane.doe@example.com" });
  });

  it("updates password", () => {
    // Add your test implementation here
  });
});
