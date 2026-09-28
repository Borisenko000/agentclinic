package dev.polina.agentclinic.agent;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AgentControllerTest {

    private static final List<String> SEED_NAMES = List.of(
            "Deprecated Dave",
            "Overfit",
            "Галлюцинатор-3000",
            "Контекст Переполненович",
            "Рефакторус",
            "Токенька");

    @Autowired
    private MockMvc mockMvc;

    @Test
    void listsSeedAgentsSortedByName() throws Exception {
        String body = mockMvc.perform(get("/api/agents"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(SEED_NAMES.size()))
                .andReturn().getResponse().getContentAsString();

        List<String> names = JsonPath.read(body, "$[*].name");
        assertThat(names).containsExactlyElementsOf(SEED_NAMES);
        assertThat(names).isSortedAccordingTo(Comparator.comparing(name -> name.toLowerCase(Locale.ROOT)));
    }

    @Test
    void listedAgentsHaveAllFields() throws Exception {
        String body = mockMvc.perform(get("/api/agents"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<Object> agents = JsonPath.read(body, "$");
        for (int i = 0; i < agents.size(); i++) {
            String path = "$[" + i + "]";
            assertThat(JsonPath.<Integer>read(body, path + ".id")).isPositive();
            assertThat(JsonPath.<String>read(body, path + ".model")).isNotBlank();
            assertThat(JsonPath.<Map<String, Object>>read(body, path))
                    .containsKeys("id", "name", "model", "vendor", "description", "createdAt");
            String createdAt = JsonPath.read(body, path + ".createdAt");
            assertThat(Instant.parse(createdAt)).isBefore(Instant.now());
            assertThat(createdAt).endsWith("Z");
        }
    }

    @Test
    void seedContainsAgentsWithoutOptionalFields() throws Exception {
        String body = mockMvc.perform(get("/api/agents"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<Object> withoutVendor = JsonPath.read(body, "$[?(@.vendor == null)]");
        List<Object> withoutDescription = JsonPath.read(body, "$[?(@.description == null)]");
        assertThat(withoutVendor).isNotEmpty();
        assertThat(withoutDescription).isNotEmpty();
    }
}
