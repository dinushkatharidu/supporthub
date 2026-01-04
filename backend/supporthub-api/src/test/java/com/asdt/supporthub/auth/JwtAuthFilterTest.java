package com.asdt.supporthub.auth;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtAuthFilterTest {

    @AfterEach
    void cleanup() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldNotFilter_authEndpoints() {
        JwtService jwt = mock(JwtService.class);
        JwtAuthFilter filter = new JwtAuthFilter(jwt);

        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
        assertTrue(filter.shouldNotFilter(req));
    }

    @Test
    void doFilter_shouldSkipWhenNoBearerToken() throws Exception {
        JwtService jwt = mock(JwtService.class);
        JwtAuthFilter filter = new JwtAuthFilter(jwt);

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/tickets");
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(req, res, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(chain).doFilter(req, res);
    }

    @Test
    void doFilter_shouldSkipWhenUsernameCannotBeExtracted() throws Exception {
        JwtService jwt = mock(JwtService.class);
        JwtAuthFilter filter = new JwtAuthFilter(jwt);

        when(jwt.extractUsername("t")).thenReturn(null);

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/tickets");
        req.addHeader("Authorization", "Bearer t");

        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(req, res, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(chain).doFilter(req, res);
    }

    @Test
    void doFilter_shouldSetAuthentication_whenTokenValid() throws Exception {
        JwtService jwt = mock(JwtService.class);
        JwtAuthFilter filter = new JwtAuthFilter(jwt);

        when(jwt.extractUsername("validtoken")).thenReturn("user@test.com");
        when(jwt.isTokenValid("validtoken", "user@test.com")).thenReturn(true);
        when(jwt.extractRoles("validtoken")).thenReturn(Set.of("USER"));

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/tickets");
        req.addHeader("Authorization", "Bearer validtoken");

        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(req, res, chain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("user@test.com", SecurityContextHolder.getContext().getAuthentication().getPrincipal());

        // ✅ FIX: only 2 args
        verify(chain).doFilter(req, res);
    }
}
