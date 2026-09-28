package dev.polina.agentclinic.agent;

import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

/**
 * Runs in a rolled-back transaction so that created agents do not leak into
 * other tests sharing the same database.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AgentRegistrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createsAgent() throws Exception {
        var result = postAgent("""
                {"name": "Новый Пациент", "model": "GPT-5", "vendor": "OpenAI", "description": "Жалуется на людей"}
                """)
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", matchesPattern("/api/agents/\\d+")))
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Новый Пациент"))
                .andExpect(jsonPath("$.model").value("GPT-5"))
                .andExpect(jsonPath("$.vendor").value("OpenAI"))
                .andExpect(jsonPath("$.description").value("Жалуется на людей"))
                .andExpect(jsonPath("$.createdAt").isString())
                .andReturn().getResponse();

        mockMvc.perform(get(result.getHeader("Location")))
                .andExpect(status().isOk())
                .andExpect(content().json(result.getContentAsString(), true));
    }

    @Test
    void trimsFieldsAndStoresBlankOptionalFieldsAsNull() throws Exception {
        postAgent("""
                {"name": "  Пробельный  ", "model": " Claude ", "vendor": "   ", "description": ""}
                """)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Пробельный"))
                .andExpect(jsonPath("$.model").value("Claude"))
                .andExpect(jsonPath("$.vendor").isEmpty())
                .andExpect(jsonPath("$.description").isEmpty());
    }

    static Stream<Arguments> invalidRequests() {
        return Stream.of(
                Arguments.of("empty name", "{\"name\": \"\", \"model\": \"GPT-5\"}", "name"),
                Arguments.of("blank name", "{\"name\": \"   \", \"model\": \"GPT-5\"}", "name"),
                Arguments.of("one-letter name", "{\"name\": \"Я\", \"model\": \"GPT-5\"}", "name"),
                Arguments.of("one letter after trim", "{\"name\": \" Я \", \"model\": \"GPT-5\"}", "name"),
                Arguments.of("too long name", "{\"name\": \"" + "a".repeat(61) + "\", \"model\": \"GPT-5\"}", "name"),
                Arguments.of("missing name", "{\"model\": \"GPT-5\"}", "name"),
                Arguments.of("empty model", "{\"name\": \"Агент\", \"model\": \"\"}", "model"),
                Arguments.of("too long model", "{\"name\": \"Агент\", \"model\": \"" + "m".repeat(61) + "\"}", "model"),
                Arguments.of("too long vendor",
                        "{\"name\": \"Агент\", \"model\": \"GPT-5\", \"vendor\": \"" + "v".repeat(61) + "\"}", "vendor"),
                Arguments.of("too long description",
                        "{\"name\": \"Агент\", \"model\": \"GPT-5\", \"description\": \"" + "d".repeat(1001) + "\"}",
                        "description"));
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("invalidRequests")
    void rejectsInvalidRequest(String description, String body, String field) throws Exception {
        postAgent(body)
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors." + field).isString());
    }

    @Test
    void reportsEveryInvalidField() throws Exception {
        postAgent("{}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").value("Укажите имя"))
                .andExpect(jsonPath("$.errors.model").value("Укажите модель"));
    }

    @Test
    void acceptsBoundaryLengths() throws Exception {
        postAgent("{\"name\": \"Ok\", \"model\": \"" + "m".repeat(60) + "\", \"vendor\": \"" + "v".repeat(60)
                + "\", \"description\": \"" + "d".repeat(1000) + "\"}")
                .andExpect(status().isCreated());
    }

    @ParameterizedTest
    @ValueSource(strings = {"overfit", "OVERFIT", " Overfit ", "токенька", "ТОКЕНЬКА", "Галлюцинатор-3000"})
    void rejectsNameTakenIgnoringCase(String name) throws Exception {
        postAgent("{\"name\": \"" + name + "\", \"model\": \"GPT-5\"}")
                .andExpect(status().isConflict())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.errors.name").value("Агент с таким именем уже зарегистрирован"));
    }

    private ResultActions postAgent(String json) throws Exception {
        return mockMvc.perform(post("/api/agents")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json));
    }
}
