package com.asdt.supporthub.auth.dto;

import java.util.Set;

public record AuthResponse(
        String token,
        String email,
        Set<String> roles
) {}
