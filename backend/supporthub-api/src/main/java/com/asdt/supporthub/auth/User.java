package com.asdt.supporthub.auth;

import lombok.*;
import org.springframework.data.neo4j.core.schema.*;

import java.util.Set;
import java.util.UUID;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Node("User")
public class User {

    @Id @GeneratedValue(GeneratedValue.UUIDGenerator.class)
    private UUID id;

    @Property("email")
    private String email;

    private String passwordHash;

    private Set<Role> roles;
}
