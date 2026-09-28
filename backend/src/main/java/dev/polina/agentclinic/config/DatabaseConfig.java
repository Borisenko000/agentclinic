package dev.polina.agentclinic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class DatabaseConfig {

    @Bean
    static SqliteDirectoryInitializer sqliteDirectoryInitializer() {
        return new SqliteDirectoryInitializer();
    }
}
