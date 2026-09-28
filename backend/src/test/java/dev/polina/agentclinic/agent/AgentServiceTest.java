package dev.polina.agentclinic.agent;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;

class AgentServiceTest {

    @Test
    void reportsDuplicateNameWhenUniqueIndexRejectsConcurrentInsert() {
        AgentRepository repository = mock(AgentRepository.class);
        when(repository.existsByNameKey("близнец")).thenReturn(false);
        when(repository.saveAndFlush(any(Agent.class)))
                .thenThrow(new DataIntegrityViolationException("UNIQUE constraint failed: agent.name_key"));
        AgentService service = new AgentService(repository);

        assertThatThrownBy(() -> service.create(new CreateAgentRequest("Близнец", "GPT-5", null, null)))
                .isInstanceOf(DuplicateAgentNameException.class);
    }
}
