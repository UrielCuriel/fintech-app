import React from "react";
import { render, waitFor, act, cleanup } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UserProvider, useUser } from "./UserContext";
import { getUser, logout } from "@/actions/sessionActions";
import { beforeEach } from "vitest";

vi.mock("@/actions/sessionActions");

vi.mock("next/navigation");

describe("UserContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  const TestComponent = () => {
    const { user, refetchUser, logout } = useUser();
    return (
      <div>
        <div data-testid="user-email">{user?.email}</div>
        <button onClick={refetchUser}>Refetch User</button>
        <button onClick={logout}>Logout</button>
      </div>
    );
  };

  it("fetches and sets the user on mount", async () => {
    const mockUser = { email: "test@example.com" };
    (getUser as vi.Mock).mockResolvedValue(mockUser);

    const { getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => expect(getByTestId("user-email").textContent).toBe(mockUser.email));
  });

  it("handles logout correctly", async () => {
    const mockUser = { email: "test@example.com" };
    (getUser as vi.Mock).mockResolvedValue(mockUser);
    (logout as vi.Mock).mockResolvedValue();

    const { getByText, getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => expect(getByTestId("user-email").textContent).toBe(mockUser.email));

    act(() => {
      getByText("Logout").click();
    });

    await waitFor(() => expect(getByTestId("user-email").textContent).toBe(""));
  });

  it("refetches the user when refetchUser is called", async () => {
    const mockUser = { email: "test@example.com" };
    const updatedUser = { email: "updated@example.com" };
    (getUser as vi.Mock).mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedUser);

    const { getByText, getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => expect(getByTestId("user-email").textContent).toBe(mockUser.email));

    act(() => {
      getByText("Refetch User").click();
    });

    await waitFor(() => expect(getByTestId("user-email").textContent).toBe(updatedUser.email));
  });
});
