
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import Dashboard from "./Dashboard";

const mockFetchTicketStats = vi.fn();

vi.mock("../api/tickets", () => ({
  fetchTicketStats: (...args: any[]) => mockFetchTicketStats(...args),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders stat cards and shows values from API", async () => {
    mockFetchTicketStats.mockResolvedValueOnce({
      open: 5,
      inProgress: 2,
      resolved: 1,
    });

    render(<Dashboard />);

    // Titles always visible
    const openTitle = screen.getByText(/open tickets/i);
    const inProgressTitle = screen.getByText(/in progress/i);
    const resolvedTitle = screen.getByText(/resolved today/i);

    // Wait until values update from API
    await waitFor(() => {
      // Each title is inside its Card; check the number inside the same Card
      const openCard = openTitle.closest("div");
      const inProgressCard = inProgressTitle.closest("div");
      const resolvedCard = resolvedTitle.closest("div");

      expect(openCard).not.toBeNull();
      expect(inProgressCard).not.toBeNull();
      expect(resolvedCard).not.toBeNull();

      expect(
        within(openCard as HTMLElement).getByText("5")
      ).toBeInTheDocument();
      expect(
        within(inProgressCard as HTMLElement).getByText("2")
      ).toBeInTheDocument();
      expect(
        within(resolvedCard as HTMLElement).getByText("1")
      ).toBeInTheDocument();
    });

    expect(mockFetchTicketStats).toHaveBeenCalledTimes(1);
  });

  it("logs error if stats API fails (no crash)", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetchTicketStats.mockRejectedValueOnce(new Error("API down"));

    render(<Dashboard />);

    // Titles still render even if API fails
    expect(screen.getByText(/open tickets/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/resolved today/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
    });

    spy.mockRestore();
  });
});
