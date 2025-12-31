import { http } from "./http";
import type { Page, Priority, Ticket, TicketStatus } from "../types/api";

// Query params for list endpoint
export async function fetchTickets(params?: {
  page?: number;
  size?: number;
  sort?: string;
  status?: TicketStatus | "ALL";
  q?: string;
}) {
  const query: Record<string, any> = {
    page: params?.page ?? 0,
    size: params?.size ?? 50,
    sort: params?.sort ?? "createdAt,desc",
    q: params?.q?.trim() ? params.q.trim() : undefined,
    status:
      params?.status && params.status !== "ALL" ? params.status : undefined,
  };

  const res = await http.get<Page<Ticket>>("/api/tickets", { params: query });
  return res.data;
}

export async function createTicket(data: {
  title: string;
  priority: Priority;
}) {
  const res = await http.post<Ticket>("/api/tickets", data);
  return res.data;
}

export async function updateTicketStatus(id: string, status: TicketStatus) {
  const res = await http.patch<Ticket>(`/api/tickets/${id}/status`, { status });
  return res.data;
}

export type TicketStats = {
  open: number;
  inProgress: number;
  resolved: number; 
};

export async function fetchTicketStats() {
  const res = await http.get("/api/tickets/stats");
  return res.data;
}


