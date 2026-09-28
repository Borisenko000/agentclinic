package dev.polina.agentclinic.web;

import java.util.LinkedHashMap;
import java.util.Map;

import dev.polina.agentclinic.agent.AgentNotFoundException;
import dev.polina.agentclinic.agent.DuplicateAgentNameException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Turns API errors into RFC 9457 ProblemDetail responses ({@code application/problem+json}).
 * Standard Spring MVC exceptions (malformed parameters, unreadable bodies, ...) are handled by the base class.
 * 400 and 409 carry an {@code errors} extension: field -> message (see {@link ApiProblem}).
 */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(AgentNotFoundException.class)
    ProblemDetail handleAgentNotFound(AgentNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(DuplicateAgentNameException.class)
    ProblemDetail handleDuplicateAgentName(DuplicateAgentNameException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
        problem.setProperty("errors", Map.of("name", "Агент с таким именем уже зарегистрирован"));
        return problem;
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, "Проверьте поля формы");
        problem.setProperty("errors", errors);
        return handleExceptionInternal(ex, problem, headers, status, request);
    }
}
