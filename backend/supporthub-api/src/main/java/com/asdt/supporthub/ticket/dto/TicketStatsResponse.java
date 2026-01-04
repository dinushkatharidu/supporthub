package com.asdt.supporthub.ticket.dto;

public record TicketStatsResponse(
        long open,
        long inProgress,
        long resolvedToday
) {
}
