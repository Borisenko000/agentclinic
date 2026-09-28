package dev.polina.agentclinic.web;

import dev.polina.agentclinic.agent.AgentNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Turns API errors into RFC 9457 ProblemDetail responses ({@code application/problem+json}).
 * Standard Spring MVC exceptions (malformed parameters, unreadable bodies, ...) are handled by the base class.
 */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(AgentNotFoundException.class)
    ProblemDetail handleAgentNotFound(AgentNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }
}
