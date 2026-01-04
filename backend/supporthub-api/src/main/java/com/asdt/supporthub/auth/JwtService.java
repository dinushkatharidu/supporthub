package com.asdt.supporthub.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtService {

    private static final String DEV_TOKEN = "dev-token";

    // Must be >= 32 bytes for HS256
    private static final String SECRET = "THIS_IS_A_TEST_SECRET_KEY_32_BYTES!";

    private final Key key =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    /**
     * Create JWT token
     */
    public String createToken(String email, Set<String> roles) {
        return Jwts.builder()
                .setSubject(email)                 // ✅ old-jjwt compatible
                .claim("roles", roles)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extract email (username) from token
     */
    public String extractUsername(String token) {
        if (token == null || token.equals(DEV_TOKEN)) return null;
        return parse(token).getSubject();
    }

    /**
     * Extract roles from token
     */
    public Set<String> extractRoles(String token) {
        if (token == null || token.equals(DEV_TOKEN)) return Set.of();

        Object raw = parse(token).get("roles");
        if (raw == null) return Set.of();

        if (raw instanceof List<?> list) {
            return list.stream()
                    .map(String::valueOf)
                    .collect(Collectors.toSet());
        }

        if (raw instanceof Set<?> set) {
            return set.stream()
                    .map(String::valueOf)
                    .collect(Collectors.toSet());
        }

        return Collections.emptySet();
    }

    /**
     * Validate token against expected email
     */
    public boolean isTokenValid(String token, String expectedEmail) {
        if (token == null || token.isBlank()) return false;

        // allow dev-token for local/testing
        if (token.equals(DEV_TOKEN)) return true;

        try {
            String actualEmail = extractUsername(token);
            return actualEmail != null && actualEmail.equals(expectedEmail);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Parse token and return claims
     */
    private Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
