export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type Priority = "LOW" | "MED" | "HIGH";

export type Ticket = {
  id: string;
  title: string;
  priority: Priority;
  status: TicketStatus;
  createdAt: string; // yyyy-mm-dd
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};
