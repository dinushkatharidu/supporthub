package com.asdt.supporthub.ticket.dto;

import com.asdt.supporthub.ticket.domain.Priority;
import com.asdt.supporthub.ticket.domain.TicketStatus;

import java.time.LocalDate;
import java.util.UUID;

public record TicketResponse (
        UUID id,
        String title,
        Priority priority,
        TicketStatus status,
        LocalDate date
){
}
