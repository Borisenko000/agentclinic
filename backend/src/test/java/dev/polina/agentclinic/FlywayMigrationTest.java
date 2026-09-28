package dev.polina.agentclinic;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class FlywayMigrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Test
    void usesTemporaryDatabase() {
        assertThat(datasourceUrl).contains("agentclinic-test").doesNotContain("./data/");
    }

    @Test
    void appliesInitialMigration() {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT version, success FROM flyway_schema_history WHERE version = '1'");

        assertThat(rows).hasSize(1);
        assertThat(rows.getFirst().get("success")).isIn(1, true);
    }
}
