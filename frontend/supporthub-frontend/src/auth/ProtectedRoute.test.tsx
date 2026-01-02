import React from "react";
import { describe, it, expect, vi } from "vitest";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";

// 1) Make auth state controllable by a variable
let authState: any = { isAuthenticated: false, user: null };

// 2) Mock useAuth once; it will return current authState
vi.mock("./AuthContext", () => ({
  useAuth: () => authState,
}));

describe("ProtectedRoute", () => {
  it("redirects to /login when not authenticated", () => {
    authState = { isAuthenticated: false, user: null };

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>PRIVATE</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>LOGIN</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("LOGIN")).toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    authState = { isAuthenticated: true, user: { roles: ["ADMIN"] } };

    render(
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <div>PRIVATE</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>LOGIN</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("PRIVATE")).toBeInTheDocument();
  });
});
