package com.asdt.supporthub.auth.dto;

import com.asdt.supporthub.auth.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record RegisterRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6) String password,
        Set<Role> roles
) {}
