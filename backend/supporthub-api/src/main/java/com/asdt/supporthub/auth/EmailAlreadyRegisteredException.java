package com.asdt.supporthub.auth;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException() {
        super("Email already registered");
    }
}
