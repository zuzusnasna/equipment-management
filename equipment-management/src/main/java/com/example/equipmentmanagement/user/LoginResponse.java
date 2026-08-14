package com.example.equipmentmanagement.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String loginId;
    private String name;
    private String role;
}
