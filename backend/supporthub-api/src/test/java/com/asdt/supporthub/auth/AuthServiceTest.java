package com.asdt.supporthub.auth;

import com.asdt.supporthub.auth.dto.AuthResponse;
import com.asdt.supporthub.auth.dto.LoginRequest;
import com.asdt.supporthub.auth.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UserRepository repo;
    private PasswordEncoder encoder;
    private JwtService jwt;
    private AuthService service;

    @BeforeEach
    void setup() {
        repo = mock(UserRepository.class);
        encoder = mock(PasswordEncoder.class);
        jwt = mock(JwtService.class);
        service = new AuthService(repo, encoder, jwt);
    }

    @Test
    void register_shouldCreateUser_withDefaultRoleUSER_andReturnToken() {
        when(repo.existsByEmail("test@gmail.com")).thenReturn(false);
        when(encoder.encode("123456")).thenReturn("HASH");
        when(jwt.createToken(eq("test@gmail.com"), anySet())).thenReturn("TOKEN");

        // ✅ password 6+
        RegisterRequest req = new RegisterRequest("test@gmail.com", "123456", null);

        AuthResponse res = service.register(req);

        assertEquals("TOKEN", res.token());
        assertEquals("test@gmail.com", res.email());
        assertTrue(res.roles().contains("USER"));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(repo).save(captor.capture());

        User saved = captor.getValue();
        assertEquals("test@gmail.com", saved.getEmail());
        assertEquals("HASH", saved.getPasswordHash());
        assertTrue(saved.getRoles().contains(Role.USER));
    }

    @Test
    void register_shouldThrow_whenEmailAlreadyExists() {
        when(repo.existsByEmail("a@a.com")).thenReturn(true);

        RegisterRequest req = new RegisterRequest("a@a.com", "123456", Set.of(Role.USER));

        EmailAlreadyRegisteredException ex =
                assertThrows(EmailAlreadyRegisteredException.class, () -> service.register(req));

        assertTrue(ex.getMessage().toLowerCase().contains("already"));
        verify(repo, never()).save(any());
    }

    @Test
    void login_shouldReturnToken_whenPasswordMatches() {
        User user = User.builder()
                .email("x@x.com")
                .passwordHash("HASH")
                .roles(Set.of(Role.ADMIN, Role.AGENT))
                .build();

        when(repo.findByEmail("x@x.com")).thenReturn(Optional.of(user));
        when(encoder.matches("pw", "HASH")).thenReturn(true);
        when(jwt.createToken(eq("x@x.com"), anySet())).thenReturn("TOKEN2");

        AuthResponse res = service.login(new LoginRequest("x@x.com", "pw"));

        assertEquals("TOKEN2", res.token());
        assertEquals("x@x.com", res.email());
        assertTrue(res.roles().contains("ADMIN"));
        assertTrue(res.roles().contains("AGENT"));
    }

    @Test
    void login_shouldThrow_whenPasswordWrong() {
        User user = User.builder()
                .email("x@x.com")
                .passwordHash("HASH")
                .roles(Set.of(Role.USER))
                .build();

        when(repo.findByEmail("x@x.com")).thenReturn(Optional.of(user));
        when(encoder.matches("wrong", "HASH")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class,
                () -> service.login(new LoginRequest("x@x.com", "wrong")));
    }
}
