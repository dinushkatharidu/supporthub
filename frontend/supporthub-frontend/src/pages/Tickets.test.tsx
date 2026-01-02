import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TicketsPage from "./Tickets";

// mock toast
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
          id: 1,
          title: "Printer not working",
          status: "OPEN",
          priority: "MED",
          createdAt: "2026-01-01T10:00:00Z",
        },
      ],
    });

    render(<TicketsPage />);

    expect(await screen.findByText(/printer not working/i)).toBeInTheDocument();
    expect(mockFetchTickets).toHaveBeenCalled();
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

    // wait UI settle
    await screen.findByText(/tickets/i);
    expect(toast.error).toHaveBeenCalled();
  });

  it("opens create modal and adds created ticket", async () => {
    mockFetchTickets.mockResolvedValueOnce({ content: [] });

    mockCreateTicket.mockResolvedValueOnce({
      id: 2,
      title: "New ticket",
      status: "OPEN",
      priority: "MED",
      createdAt: "2026-01-01T10:00:00Z",
    });

    const user = userEvent.setup();
    render(<TicketsPage />);

    // open modal (your UI uses Plus button; easiest: match by text if exists)
    // If your button has text like "New Ticket" use that.
    // Otherwise add aria-label to the plus button: aria-label="New Ticket"
    const openBtn =
      screen.queryByRole("button", { name: /new ticket|create ticket|add/i }) ??
      screen.getAllByRole("button")[0];

    await user.click(openBtn);

    expect(await screen.findByText(/create ticket/i)).toBeInTheDocument();

    // type title (best: add aria-label="Title" to Input in modal)
    const titleInput =
      screen.queryByRole("textbox", { name: /title/i }) ??
      screen.getByRole("textbox");

    await user.type(titleInput, "New ticket");
    await user.click(screen.getByRole("button", { name: /^create$/i }));

    expect(mockCreateTicket).toHaveBeenCalled();
    expect(await screen.findByText(/new ticket/i)).toBeInTheDocument();
  });
});
