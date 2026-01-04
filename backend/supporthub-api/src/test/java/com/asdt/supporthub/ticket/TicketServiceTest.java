package com.asdt.supporthub.ticket;

import com.asdt.supporthub.common.exception.BadRequestException;
import com.asdt.supporthub.common.exception.NotFoundException;
import com.asdt.supporthub.ticket.domain.Priority;
import com.asdt.supporthub.ticket.domain.Ticket;
import com.asdt.supporthub.ticket.domain.TicketStatus;
import com.asdt.supporthub.ticket.dto.CreateTicketRequest;
import com.asdt.supporthub.ticket.dto.TicketStatsResponse;
import com.asdt.supporthub.ticket.dto.UpdateStatusRequest;
import com.asdt.supporthub.ticket.repository.TicketRepository;
import com.asdt.supporthub.ticket.service.TicketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TicketServiceTest {

    private TicketRepository repo;
    private TicketService service;

    @BeforeEach
    void setup() {
        repo = mock(TicketRepository.class);
        service = new TicketService(repo);
    }

    @Test
    void create_shouldSaveTicket_andReturnResponse() {
        Ticket saved = new Ticket("Broken Login", Priority.MED);
        saved.setId(UUID.randomUUID());

        when(repo.save(any(Ticket.class))).thenReturn(saved);

        var res = service.create(new CreateTicketRequest("Broken Login", Priority.MED));

        assertEquals(saved.getId(), res.id());
        assertEquals("Broken Login", res.title());
        assertEquals(Priority.MED, res.priority());
        assertEquals(TicketStatus.OPEN, res.status());

        verify(repo).save(any(Ticket.class));
    }

    @Test
    void updateStatus_shouldThrowNotFound_ifTicketMissing() {
        UUID id = UUID.randomUUID();
        when(repo.findById(id)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.updateStatus(id, new UpdateStatusRequest(TicketStatus.RESOLVED)));
    }

    @Test
    void updateStatus_shouldReject_ifClosedTicket() {
        UUID id = UUID.randomUUID();
        Ticket t = new Ticket("t", Priority.LOW);
        t.setId(id);
        t.setStatus(TicketStatus.CLOSED);

        when(repo.findById(id)).thenReturn(Optional.of(t));

        assertThrows(BadRequestException.class,
                () -> service.updateStatus(id, new UpdateStatusRequest(TicketStatus.OPEN)));
    }

    @Test
    void updateStatus_shouldAllowValidTransition_OPEN_to_IN_PROGRESS() {
        UUID id = UUID.randomUUID();
        Ticket t = new Ticket("t", Priority.LOW);
        t.setId(id);
        t.setStatus(TicketStatus.OPEN);

        when(repo.findById(id)).thenReturn(Optional.of(t));
        when(repo.save(any(Ticket.class))).thenAnswer(inv -> inv.getArgument(0));

        var res = service.updateStatus(id, new UpdateStatusRequest(TicketStatus.IN_PROGRESS));

        assertEquals(TicketStatus.IN_PROGRESS, res.status());
        verify(repo).save(any(Ticket.class));
    }

    @Test
    void stats_shouldReturnCounts() {
        when(repo.countOpen()).thenReturn(5L);
        when(repo.countInProgress()).thenReturn(2L);
        when(repo.countResolved()).thenReturn(1L);

        TicketStatsResponse stats = service.stats();

        assertEquals(5L, stats.open());
        assertEquals(2L, stats.inProgress());
        assertEquals(1L, stats.resolvedToday());
    }
}
