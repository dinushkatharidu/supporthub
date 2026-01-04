package com.asdt.supporthub.auth;

import com.asdt.supporthub.auth.dto.AuthResponse;
import com.asdt.supporthub.auth.dto.LoginRequest;
import com.asdt.supporthub.auth.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    AuthService service;

    @MockitoBean
    JwtService jwtService;

    @Test
    void register_shouldReturnAuthResponse() throws Exception {
        when(service.register(any(RegisterRequest.class)))
                .thenReturn(new AuthResponse("T", "a@a.com", Set.of("USER")));

        // ✅ password must be 6+
        String body = """
        {
          "email": "a@a.com",
          "password": "123456",
          "roles": ["USER"]
        }
        """;

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("T"));
    }

    @Test
    void login_shouldReturnAuthResponse() throws Exception {
        when(service.login(any(LoginRequest.class)))
                .thenReturn(new AuthResponse("T2", "a@a.com", Set.of("USER")));

        // ✅ password must be 6+ if your LoginRequest also validates it
        String body = """
        {
          "email": "a@a.com",
          "password": "123456"
        }
        """;

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("T2"));
    }
}
