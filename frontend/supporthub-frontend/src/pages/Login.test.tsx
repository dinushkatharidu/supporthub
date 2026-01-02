import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";

// ---- Mock AuthContext ----
const mockLogin = vi.fn();

vi.mock("../auth/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

// ---- Mock react-router-dom useNavigate ----
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading, inputs and Sign In button", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("SupportHub")).toBeInTheDocument();
    expect(screen.getByText(/sign in to manage tickets/i)).toBeInTheDocument();

    // After you add htmlFor/id (recommended), these will work:
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("submits with default values and navigates to / on success", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith("admin@test.com", "123456");

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("allows typing email and password", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    // clear defaults then type
    await user.clear(email);
    await user.type(email, "user@test.com");

    await user.clear(password);
    await user.type(password, "pass123");

    expect(email).toHaveValue("user@test.com");
    expect(password).toHaveValue("pass123");
  });

  it("shows error message when login fails", async () => {
    mockLogin.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows 'Login failed' when backend message is missing", async () => {
    mockLogin.mockRejectedValueOnce(new Error("boom"));

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("disables button and shows Signing in... while loading", async () => {
    // make login pending until we resolve it
    let resolveFn: (v?: any) => void = () => {};
    mockLogin.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveFn = resolve;
        })
    );

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const btn = screen.getByRole("button", { name: /sign in/i });
    await user.click(btn);

    // loading UI
    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();

    // finish promise
    resolveFn();
  });
});
