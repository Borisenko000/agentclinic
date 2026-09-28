package dev.polina.agentclinic.agent;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Registration form. Values are normalized on construction (trimmed, blank -> null),
 * so the constraints below apply to the trimmed values.
 */
public record CreateAgentRequest(
        @Schema(requiredMode = RequiredMode.REQUIRED, minLength = 2, maxLength = 60)
        @NotNull(message = "Укажите имя")
        @Size(min = 2, max = 60, message = "Длина от 2 до 60 символов")
        String name,

        @Schema(requiredMode = RequiredMode.REQUIRED, minLength = 1, maxLength = 60)
        @NotNull(message = "Укажите модель")
        @Size(max = 60, message = "Не длиннее 60 символов")
        String model,

        @Schema(types = {"string", "null"}, maxLength = 60)
        @Size(max = 60, message = "Не длиннее 60 символов")
        String vendor,

        @Schema(types = {"string", "null"}, maxLength = 1000)
        @Size(max = 1000, message = "Не длиннее 1000 символов")
        String description) {

    public CreateAgentRequest {
        name = normalize(name);
        model = normalize(model);
        vendor = normalize(vendor);
        description = normalize(description);
    }

    private static String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.strip();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
