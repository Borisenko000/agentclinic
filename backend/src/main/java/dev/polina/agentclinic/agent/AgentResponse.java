package dev.polina.agentclinic.agent;

import java.time.Instant;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

public record AgentResponse(
        @Schema(requiredMode = RequiredMode.REQUIRED) long id,
        @Schema(requiredMode = RequiredMode.REQUIRED) String name,
        @Schema(requiredMode = RequiredMode.REQUIRED) String model,
        @Schema(requiredMode = RequiredMode.REQUIRED, types = {"string", "null"}) String vendor,
        @Schema(requiredMode = RequiredMode.REQUIRED, types = {"string", "null"}) String description,
        @Schema(requiredMode = RequiredMode.REQUIRED) Instant createdAt) {

    static AgentResponse from(Agent agent) {
        return new AgentResponse(
                agent.getId(),
                agent.getName(),
                agent.getModel(),
                agent.getVendor(),
                agent.getDescription(),
                agent.getCreatedAt());
    }
}
