package com.asdt.supporthub.auth;

import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String DEV_TOKEN = "dev-token";

    @Test
    void createToken_shouldReturnNonEmptyString() {
        JwtService jwt = new JwtService();

        String token = jwt.createToken("a@a.com", Set.of("USER"));

        assertNotNull(token);
        assertFalse(token.isBlank());
    }

    @Test
    void extractUsername_shouldReturnNull_forDevToken() {
        JwtService jwt = new JwtService();

        assertNull(jwt.extractUsername(DEV_TOKEN));
    }

    @Test
    void extractRoles_shouldReturnEmptySet_forDevToken() {
        JwtService jwt = new JwtService();

        assertNotNull(jwt.extractRoles(DEV_TOKEN));
        assertTrue(jwt.extractRoles(DEV_TOKEN).isEmpty());
    }

    @Test
    void extractUsername_shouldThrow_forMalformedToken() {
        JwtService jwt = new JwtService();

        assertThrows(Exception.class, () -> jwt.extractUsername("random"));
    }
}
