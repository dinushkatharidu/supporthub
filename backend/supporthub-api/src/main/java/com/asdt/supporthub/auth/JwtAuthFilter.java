package com.asdt.supporthub.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwt;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // In tests servletPath can be blank, so fallback to URI.
        String path = request.getServletPath();
        if (path == null || path.isBlank()) path = request.getRequestURI();

        return path != null && path.startsWith("/api/auth");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // No token -> continue without authentication
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7).trim();
        if (token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        // If already authenticated, continue
        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String email;
        try {
            email = jwt.extractUsername(token);
        } catch (Exception e) {
            // malformed/invalid token
            filterChain.doFilter(request, response);
            return;
        }

        // dev-token returns null in extractUsername(), so just skip auth
        if (email == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // Validate token against extracted email
        if (!jwt.isTokenValid(token, email)) {
            filterChain.doFilter(request, response);
            return;
        }

        Set<String> roles = jwt.extractRoles(token);

        var authorities = roles.stream()
                .map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        var authToken = new UsernamePasswordAuthenticationToken(
                email,
                null,
                authorities
        );

        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
