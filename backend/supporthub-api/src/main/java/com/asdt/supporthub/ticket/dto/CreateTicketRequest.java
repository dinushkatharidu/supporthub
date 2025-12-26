package com.asdt.supporthub.ticket.dto;

import com.asdt.supporthub.ticket.domain.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTicketRequest(
        @NotBlank String title,
        @NotNull Priority priority
        ) {
}
