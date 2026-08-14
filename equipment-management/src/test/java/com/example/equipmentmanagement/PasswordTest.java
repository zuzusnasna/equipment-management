package com.example.equipmentmanagement;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String encoded =
                "$2a$10$3N95uCV/C7Y3bgYOqn69NO5Wd3wy1pJrUhksF0sWL12YO2V9uHcra";

        System.out.println(
                "BCrypt 검증 결과 = "
                        + encoder.matches("1234", encoded)
        );

        System.out.println(
                "새로운 BCrypt = "
                        + encoder.encode("1234")
        );
    }
}