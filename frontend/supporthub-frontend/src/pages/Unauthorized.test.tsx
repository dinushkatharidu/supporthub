import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Unauthorized from "./Unauthorized";

describe("Unauthorized", () => {
  it("renders message and Go Home link", () => {
    render(
      <MemoryRouter>
        <Unauthorized />
      </MemoryRouter>
    );

    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
    expect(
      screen.getByText(/you don’t have permission to access this page/i)
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /go home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
