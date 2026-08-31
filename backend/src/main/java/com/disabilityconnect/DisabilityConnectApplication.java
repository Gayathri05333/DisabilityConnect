package com.disabilityconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DisabilityConnectApplication {
    public static void main(String[] args) {
        SpringApplication.run(DisabilityConnectApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" DisabilityConnect backend started successfully ");
        System.out.println(" API base URL: http://localhost:8080/api        ");
        System.out.println("=================================================");
    }
}
