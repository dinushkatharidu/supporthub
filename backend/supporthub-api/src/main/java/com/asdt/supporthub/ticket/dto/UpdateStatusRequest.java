package com.asdt.supporthub.ticket.dto;

import com.asdt.supporthub.ticket.domain.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
        @NotNull TicketStatus status
        ) {
}
