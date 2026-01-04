package com.asdt.supporthub.ticket.service;

import com.asdt.supporthub.common.exception.BadRequestException;
import com.asdt.supporthub.common.exception.NotFoundException;
import com.asdt.supporthub.ticket.domain.Ticket;
import com.asdt.supporthub.ticket.domain.TicketStatus;
import com.asdt.supporthub.ticket.dto.CreateTicketRequest;
import com.asdt.supporthub.ticket.dto.TicketResponse;
import com.asdt.supporthub.ticket.dto.TicketStatsResponse;
import com.asdt.supporthub.ticket.dto.UpdateStatusRequest;
import com.asdt.supporthub.ticket.repository.TicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository repo;

    public TicketService(TicketRepository repo) {
        this.repo = repo;
    }

    public Page<TicketResponse> list(String status, String q, Pageable pageable) {
        return repo.search(status, q, pageable).map(this::toResponse);
    }

    public TicketResponse create(CreateTicketRequest req) {
        Ticket ticket = new Ticket(req.title(), req.priority());
        Ticket saved = repo.save(ticket);
        return toResponse(saved);
    }


    public TicketResponse updateStatus(UUID id, UpdateStatusRequest req) {
        Ticket t = repo.findById(id).orElseThrow(() -> new NotFoundException("Ticket not found"));

        validateStatusTransition(t.getStatus(), req.status());

        t.setStatus(req.status());
        return toResponse(repo.save(t));
    }

    private void validateStatusTransition(TicketStatus current, TicketStatus next) {
        if (current == TicketStatus.CLOSED) {
            throw new BadRequestException("Closed tickets cannot be changed");
        }

        boolean ok =
                (current == TicketStatus.OPEN && (next == TicketStatus.IN_PROGRESS || next == TicketStatus.RESOLVED)) ||
                        (current == TicketStatus.IN_PROGRESS && next == TicketStatus.RESOLVED) ||
                        (current == TicketStatus.RESOLVED && next == TicketStatus.CLOSED) ||
                        (current == next);

        if (!ok) {
            throw new BadRequestException("Invalid status transition: " + current + " -> " + next);
        }
    }

    public TicketStatsResponse stats() {
        return new TicketStatsResponse(
                repo.countOpen(),
                repo.countInProgress(),
                repo.countResolved()
        );
    }


    private TicketResponse toResponse(Ticket t) {
        return new TicketResponse(t.getId(), t.getTitle(), t.getPriority(), t.getStatus(), t.getCreatedAt());
    }
}
