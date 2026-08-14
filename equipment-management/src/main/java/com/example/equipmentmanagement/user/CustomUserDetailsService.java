package com.example.equipmentmanagement.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginId)
            throws UsernameNotFoundException {

        System.out.println("================================");
        System.out.println("로그인 시도 ID = " + loginId);

        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "사용자를 찾을 수 없습니다: " + loginId
                        )
                );

        System.out.println("DB 사용자 찾음 = " + user.getLoginId());
        System.out.println("DB 비밀번호 = " + user.getPassword());
        System.out.println("DB ROLE = " + user.getRole());

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getLoginId())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }
}