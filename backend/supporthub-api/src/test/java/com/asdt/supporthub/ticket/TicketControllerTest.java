package com.asdt.supporthub.ticket;

import com.asdt.supporthub.auth.JwtAuthFilter;
import com.asdt.supporthub.auth.JwtService;
import com.asdt.supporthub.ticket.controller.TicketController;
import com.asdt.supporthub.ticket.service.TicketService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(controllers = TicketController.class)
@AutoConfigureMockMvc(addFilters = false)
class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // Your controller dependencies
    @MockitoBean
    private TicketService ticketService;

    // ✅ FIX: provide beans needed by JwtAuthFilter / security wiring
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private JwtAuthFilter jwtAuthFilter;

    @Test
    void contextLoads() {
        // If this test passes, Spring can start the test context successfully.
        assert true;
    }
}
