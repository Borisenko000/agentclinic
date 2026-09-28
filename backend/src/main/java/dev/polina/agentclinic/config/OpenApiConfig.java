package dev.polina.agentclinic.config;

import java.util.List;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class OpenApiConfig {

    /**
     * A fixed server list keeps the committed snapshot independent of the request URL
     * (springdoc otherwise fills it from the current request).
     */
    @Bean
    OpenAPI agentClinicOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("AgentClinic API")
                        .version("v1"))
                .servers(List.of(new Server().url("http://localhost:8080").description("Local backend")));
    }
}
