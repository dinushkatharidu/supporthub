package com.asdt.supporthub.ticket.controller;
import com.asdt.supporthub.ticket.dto.CreateTicketRequest;
import com.asdt.supporthub.ticket.dto.TicketResponse;
import com.asdt.supporthub.ticket.dto.UpdateStatusRequest;
import com.asdt.supporthub.ticket.service.TicketService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
@AllArgsConstructor
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService service;

    @GetMapping
    public Page<TicketResponse> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Sort s = parseSort(sort);
        return service.list(status, q, PageRequest.of(page, size, s));
    }

    @PostMapping
    public TicketResponse create(@Valid @RequestBody CreateTicketRequest req) {
        return service.create(req);
    }


    @PatchMapping("/{id}/status")
    public TicketResponse updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateStatusRequest req) {
        return service.updateStatus(id, req);
    }

    private Sort parseSort(String sort) {
        String[] parts = sort.split(",");
        String field = parts[0];
        Sort.Direction dir = (parts.length > 1 && parts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        return Sort.by(dir, field);
    }
}