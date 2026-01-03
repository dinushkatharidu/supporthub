import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TicketsPage from "./Tickets";

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockFetchTickets = vi.fn();
const mockCreateTicket = vi.fn();
const mockUpdateStatus = vi.fn();

vi.mock("../api/tickets", () => ({
  fetchTickets: (...args: any[]) => mockFetchTickets(...args),
  createTicket: (...args: any[]) => mockCreateTicket(...args),
  updateTicketStatus: (...args: any[]) => mockUpdateStatus(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("TicketsPage", () => {
  it("loads tickets and displays them", async () => {
    mockFetchTickets.mockResolvedValueOnce({
      content: [
        {
          id: "a1b2c3d4e5f6g7h8", // ✅ string id
          title: "Printer not working",
          status: "OPEN",
          priority: "MED",
          createdAt: "2026-01-01T10:00:00Z",
        },
      ],
    });

    render(<TicketsPage />);

    expect(await screen.findByText(/printer not working/i)).toBeInTheDocument();
    expect(mockFetchTickets).toHaveBeenCalledTimes(1);
  });

  it("shows empty state when no tickets", async () => {
    mockFetchTickets.mockResolvedValueOnce({ content: [] });

    render(<TicketsPage />);

    expect(await screen.findByText(/no tickets found/i)).toBeInTheDocument();
  });

  it("shows toast error when api fails", async () => {
    const toast = (await import("react-hot-toast")).default;

    mockFetchTickets.mockRejectedValueOnce(new Error("boom"));

    render(<TicketsPage />);

    // page title exists, then toast should be called
    await screen.findByText(/tickets/i);
    expect(toast.error).toHaveBeenCalled();
  });

  it("opens create modal and adds created ticket", async () => {
    mockFetchTickets.mockResolvedValueOnce({ content: [] });

    mockCreateTicket.mockResolvedValueOnce({
      id: "zz11yy22xx33ww44", // ✅ string id
      title: "New ticket",
      status: "OPEN",
      priority: "MED",
      createdAt: "2026-01-01T10:00:00Z",
    });

    const user = userEvent.setup();
    render(<TicketsPage />);

    // open modal via button
    await user.click(screen.getByRole("button", { name: /create ticket/i }));

    // ✅ unique modal text (avoids "Create Ticket" duplicate)
    expect(
      await screen.findByText(/add a new support request/i)
    ).toBeInTheDocument();

    // modal title input uses placeholder
    const titleInput = screen.getByPlaceholderText(/cannot login/i);
    await user.type(titleInput, "New ticket");

    await user.click(screen.getByRole("button", { name: /^create$/i }));

    expect(mockCreateTicket).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/new ticket/i)).toBeInTheDocument();
  });
});
