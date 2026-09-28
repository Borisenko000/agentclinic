package dev.polina.agentclinic.agent;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;

import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AgentRepositoryTest {

    @Autowired
    private AgentRepository repository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void storesAndReadsInstantWithoutShift() {
        Instant createdAt = Instant.parse("2026-09-28T10:15:30.123Z");
        Agent saved = repository.save(new Agent("Test Agent", "test agent", "Test Model", null, null, createdAt));
        entityManager.flush();
        entityManager.clear();

        Agent reloaded = repository.findById(saved.getId()).orElseThrow();

        assertThat(reloaded.getCreatedAt()).isEqualTo(createdAt);
    }

    @Test
    void storesTimestampsAsEpochMillis() {
        Agent saved = repository.save(new Agent("Test Agent", "test agent", "Test Model", null, null,
                Instant.parse("2026-09-28T10:15:30.123Z")));
        entityManager.flush();

        String storedType = jdbcTemplate.queryForObject(
                "SELECT typeof(created_at) FROM agent WHERE id = ?", String.class, saved.getId());
        Long seedMillis = jdbcTemplate.queryForObject(
                "SELECT created_at FROM agent WHERE name_key = 'overfit'", Long.class);

        assertThat(storedType).isEqualTo("integer");
        assertThat(seedMillis).isEqualTo(Instant.parse("2026-09-01T09:00:00Z").toEpochMilli());
    }

    @Test
    void readsSeedTimestampAsUtc() {
        Agent overfit = repository.findAllByOrderByNameKeyAsc().stream()
                .filter(agent -> agent.getNameKey().equals("overfit"))
                .findFirst().orElseThrow();

        assertThat(overfit.getCreatedAt()).isEqualTo(Instant.parse("2026-09-01T09:00:00Z"));
    }

    @Test
    void checksNameKeyExistence() {
        assertThat(repository.existsByNameKey("overfit")).isTrue();
        assertThat(repository.existsByNameKey("nobody")).isFalse();
    }
}
