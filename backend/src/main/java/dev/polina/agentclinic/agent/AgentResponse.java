package dev.polina.agentclinic.agent;

import java.time.Instant;

public record AgentResponse(
        long id,
        String name,
        String model,
        String vendor,
        String description,
        Instant createdAt) {

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
