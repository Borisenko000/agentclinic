package dev.polina.agentclinic.agent;

public class DuplicateAgentNameException extends RuntimeException {

    public DuplicateAgentNameException(String name) {
        super("Имя «" + name + "» уже занято");
    }
}
