package dev.polina.agentclinic.web;

import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;

/**
 * OpenAPI description of the error body: an RFC 9457 ProblemDetail as {@link ApiExceptionHandler}
 * renders it, with the {@code errors} extension (field -> message) for 400 and 409.
 * {@code type} is omitted when it is {@code about:blank}.
 * Documentation only; responses are built as {@link org.springframework.http.ProblemDetail}.
 */
@Schema(name = "ApiProblem")
public record ApiProblem(
        String type,
        @Schema(requiredMode = RequiredMode.REQUIRED) String title,
        @Schema(requiredMode = RequiredMode.REQUIRED) int status,
        String detail,
        String instance,
        Map<String, String> errors) {
}
