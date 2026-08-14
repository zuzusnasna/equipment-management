package com.example.equipmentmanagement.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    /**
     * Spring Security 인증 정보를 HttpSession에 저장
     */
    private final SecurityContextRepository securityContextRepository =
            new HttpSessionSecurityContextRepository();

    /**
     * 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse,
            HttpSession session
    ) {
        System.out.println("요청 loginId = " + request.getLoginId());
        System.out.println("요청 password = " + request.getPassword());
        try {

            // 1. 아이디 / 비밀번호 인증
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getLoginId(),
                                    request.getPassword()
                            )
                    );

            // 2. SecurityContext 생성
            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);

            // 3. 현재 요청의 SecurityContext에 저장
            SecurityContextHolder.setContext(context);

            // ⭐⭐⭐ 핵심 ⭐⭐⭐
            // SecurityContext를 세션에 저장
            securityContextRepository.saveContext(
                    context,
                    httpRequest,
                    httpResponse
            );

            // 4. 사용자 정보 조회
            User user = userRepository
                    .findByLoginId(request.getLoginId())
                    .orElseThrow();

            // 5. 기존 세션 정보 저장
            session.setAttribute(
                    "LOGIN_USER_ID",
                    user.getUserId()
            );

            session.setAttribute(
                    "COMPANY_ID",
                    user.getCompanyId()
            );

            session.setAttribute(
                    "LOGIN_ID",
                    user.getLoginId()
            );

            session.setAttribute(
                    "ROLE",
                    user.getRole()
            );

            session.setAttribute(
                    "USER_NAME",
                    user.getName()
            );

            // 6. 로그인 성공 응답
            return ResponseEntity.ok(
                    new LoginResponse(
                            user.getLoginId(),
                            user.getName(),
                            user.getRole()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(401)
                    .body("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    /**
     * 현재 로그인 사용자 확인
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {

        Object userId =
                session.getAttribute("LOGIN_USER_ID");

        if (userId == null) {

            return ResponseEntity
                    .status(401)
                    .body("로그인되어 있지 않습니다.");
        }

        return ResponseEntity.ok(
                new LoginResponse(
                        (String) session.getAttribute("LOGIN_ID"),
                        (String) session.getAttribute("USER_NAME"),
                        (String) session.getAttribute("ROLE")
                )
        );
    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request,
            HttpServletResponse response,
            HttpSession session
    ) {

        // SecurityContext 삭제
        SecurityContextHolder.clearContext();

        // 세션 삭제
        session.invalidate();

        return ResponseEntity.ok(
                "로그아웃되었습니다."
        );
    }
}