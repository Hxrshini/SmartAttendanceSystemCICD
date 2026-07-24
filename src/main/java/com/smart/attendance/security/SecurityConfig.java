package com.smart.attendance.security;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import lombok.RequiredArgsConstructor;
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
        .cors()   // ✅ JUST ADD THIS LINE
        .and()
        .csrf().disable()
        .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
        )
        .authorizeHttpRequests(auth -> auth
        .requestMatchers(
                "/api/auth/**",
                "/api/faculty/**",
                "/api/student/**",
                "/swagger-ui/**",
                "/v3/api-docs/**",
                "/test-mail",
                "/uploads/**"
        ).permitAll()
         .requestMatchers("/api/student/upload-photo").authenticated()
        .anyRequest().authenticated()
)
        .authenticationProvider(authenticationProvider())
        .formLogin().disable()
        .httpBasic().disable();

    return http.build();
}
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
public org.springframework.security.authentication.dao.DaoAuthenticationProvider authenticationProvider() {
    org.springframework.security.authentication.dao.DaoAuthenticationProvider provider =
            new org.springframework.security.authentication.dao.DaoAuthenticationProvider();

    provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());

    return provider;
}
@Bean
public AuthenticationManager authenticationManager(
        AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}
@Bean
public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {

    org.springframework.web.cors.CorsConfiguration configuration =
            new org.springframework.web.cors.CorsConfiguration();

    configuration.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
    configuration.setAllowedMethods(java.util.List.of("*"));
    configuration.setAllowedHeaders(java.util.List.of("*"));
    configuration.setAllowCredentials(true);

    org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
            new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", configuration);

    return source;
}
}