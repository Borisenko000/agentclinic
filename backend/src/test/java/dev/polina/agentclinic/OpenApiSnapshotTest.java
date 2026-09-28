package dev.polina.agentclinic;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.SerializationFeature;
import tools.jackson.databind.json.JsonMapper;

/**
 * Keeps the committed OpenAPI contract ({@code openapi/openapi.json}) in sync with the code.
 * Run with {@code -Dopenapi.update=true} to rewrite the snapshot instead of comparing.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OpenApiSnapshotTest {

    private static final Path SNAPSHOT = Path.of("..", "openapi", "openapi.json");

    private static final JsonMapper JSON = JsonMapper.builder()
            .enable(SerializationFeature.INDENT_OUTPUT)
            .build();

    @Autowired
    private MockMvc mockMvc;

    @Test
    void apiDocsMatchCommittedSnapshot() throws Exception {
        String body = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode actual = JSON.readTree(body);

        if (Boolean.getBoolean("openapi.update")) {
            Files.createDirectories(SNAPSHOT.getParent());
            Files.writeString(SNAPSHOT, JSON.writeValueAsString(actual) + "\n");
            return;
        }

        assertThat(SNAPSHOT)
                .as("OpenAPI snapshot is missing; run ./mvnw test -Dtest=OpenApiSnapshotTest -Dopenapi.update=true")
                .exists();
        JsonNode expected = JSON.readTree(Files.readString(SNAPSHOT));
        assertThat(actual)
                .as("OpenAPI snapshot is outdated; run ./mvnw test -Dtest=OpenApiSnapshotTest -Dopenapi.update=true")
                .isEqualTo(expected);
    }
}
