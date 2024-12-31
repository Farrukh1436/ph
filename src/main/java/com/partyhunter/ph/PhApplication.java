package com.partyhunter.ph;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.partyhunter.ph")
public class PhApplication {

	public static void main(String[] args) {
		SpringApplication.run(PhApplication.class, args);
	}
}
