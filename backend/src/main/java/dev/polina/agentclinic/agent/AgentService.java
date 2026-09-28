package dev.polina.agentclinic.agent;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AgentService {

    private final AgentRepository repository;

    public AgentService(AgentRepository repository) {
        this.repository = repository;
    }

    public AgentResponse findById(long id) {
        return repository.findById(id)
                .map(AgentResponse::from)
                .orElseThrow(() -> new AgentNotFoundException(id));
    }

    public List<AgentResponse> findAll() {
        return repository.findAllByOrderByNameKeyAsc().stream()
                .map(AgentResponse::from)
                .toList();
    }

    /** Expects a validated, already normalized request. */
    @Transactional
    public AgentResponse create(CreateAgentRequest request) {
        String nameKey = nameKey(request.name());
        if (repository.existsByNameKey(nameKey)) {
            throw new DuplicateAgentNameException(request.name());
        }
        // The database stores milliseconds; truncating keeps the response equal to a later GET.
        Instant createdAt = Instant.now().truncatedTo(ChronoUnit.MILLIS);
        Agent agent = new Agent(request.name(), nameKey, request.model(), request.vendor(), request.description(),
                createdAt);
        try {
            return AgentResponse.from(repository.saveAndFlush(agent));
        } catch (DataIntegrityViolationException e) {
            // A concurrent registration took the name between the check and the insert.
            throw new DuplicateAgentNameException(request.name());
        }
    }

    static String nameKey(String name) {
        return name.strip().toLowerCase(Locale.ROOT);
    }
}
