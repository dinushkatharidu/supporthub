package com.asdt.supporthub.auth;

import com.asdt.supporthub.auth.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthResponse register(RegisterRequest req) {
        if (repo.existsByEmail(req.email())) {
            throw new EmailAlreadyRegisteredException(); // ✅ dedicated exception
        }

        var roles = (req.roles() == null || req.roles().isEmpty())
                ? Set.of(Role.USER)
                : req.roles();

        var user = User.builder()
                .email(req.email().toLowerCase())
                .passwordHash(encoder.encode(req.password()))
                .roles(roles)
                .build();

        repo.save(user);

        var roleStrings = roles.stream().map(Enum::name).collect(Collectors.toSet());
        var token = jwt.createToken(user.getEmail(), roleStrings);

        return new AuthResponse(token, user.getEmail(), roleStrings);
    }

    public AuthResponse login(LoginRequest req) {
        var user = repo.findByEmail(req.email().toLowerCase())
                .orElseThrow(InvalidCredentialsException::new); // ✅ dedicated exception

        if (!encoder.matches(req.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException(); // ✅ dedicated exception
        }

        var roleStrings = user.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
        var token = jwt.createToken(user.getEmail(), roleStrings);

        return new AuthResponse(token, user.getEmail(), roleStrings);
    }
}
