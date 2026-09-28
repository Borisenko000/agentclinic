package dev.polina.agentclinic.agent;

public class AgentNotFoundException extends RuntimeException {

    public AgentNotFoundException(long id) {
        super("Агент " + id + " не найден");
    }
}
