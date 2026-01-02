import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateTicketModal from "./CreateTicketModal";

describe("CreateTicketModal", () => {
  it("does not render when open=false", () => {
    render(
      <CreateTicketModal open={false} onClose={() => {}} onCreate={() => {}} />
    );
    expect(screen.queryByText(/create ticket/i)).not.toBeInTheDocument();
  });

  it("renders when open=true", () => {
    render(
      <CreateTicketModal open={true} onClose={() => {}} onCreate={() => {}} />
    );
    expect(screen.getByText(/create ticket/i)).toBeInTheDocument();
  });

  it("calls onClose when Cancel clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <CreateTicketModal open={true} onClose={onClose} onCreate={() => {}} />
    );
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not create when title is empty", async () => {
    const onCreate = vi.fn();
    const user = userEvent.setup();

    render(
      <CreateTicketModal open={true} onClose={() => {}} onCreate={onCreate} />
    );

    await user.click(screen.getByRole("button", { name: /^create$/i }));
    expect(onCreate).not.toHaveBeenCalled();
  });
});
