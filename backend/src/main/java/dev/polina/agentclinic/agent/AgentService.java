package dev.polina.agentclinic.agent;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AgentService {

    private final AgentRepository repository;

    public AgentService(AgentRepository repository) {
        this.repository = repository;
    }

    public List<AgentResponse> findAll() {
        return repository.findAllByOrderByNameKeyAsc().stream()
                .map(AgentResponse::from)
                .toList();
    }
}
