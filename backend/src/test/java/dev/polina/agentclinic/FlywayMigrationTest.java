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
    void appliesAllMigrationsSuccessfully() {
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT version, success FROM flyway_schema_history WHERE version IS NOT NULL ORDER BY installed_rank");

        assertThat(rows).extracting(row -> row.get("version")).containsExactly("1", "2", "3");
        assertThat(rows).allSatisfy(row -> assertThat(row.get("success")).isIn(1, true));
    }
}
