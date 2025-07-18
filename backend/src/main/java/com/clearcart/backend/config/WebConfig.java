package com.clearcart.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(final CorsRegistry registry){
        registry.addMapping("/graphql")
                .allowedOrigins("http://localhost:5173") // Use the specific origin
                .allowedMethods("POST", "GET", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
