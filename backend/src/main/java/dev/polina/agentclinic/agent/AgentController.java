package dev.polina.agentclinic.agent;

import java.net.URI;
import java.util.List;

import dev.polina.agentclinic.web.ApiProblem;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Agents")
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService service;

    public AgentController(AgentService service) {
        this.service = service;
    }

    @GetMapping
    public List<AgentResponse> listAgents() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @ApiResponse(responseCode = "200", description = "OK")
    @ApiResponse(responseCode = "404", description = "Агент не найден",
            content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ApiProblem.class)))
    public AgentResponse getAgent(@PathVariable long id) {
        return service.findById(id);
    }

    @PostMapping
    @ApiResponse(responseCode = "201", description = "Агент зарегистрирован",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AgentResponse.class)))
    @ApiResponse(responseCode = "400", description = "Ошибки валидации; errors: поле -> сообщение",
            content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ApiProblem.class)))
    @ApiResponse(responseCode = "409", description = "Имя уже занято; errors.name",
            content = @Content(mediaType = "application/problem+json", schema = @Schema(implementation = ApiProblem.class)))
    public ResponseEntity<AgentResponse> createAgent(@Valid @RequestBody CreateAgentRequest request) {
        AgentResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/agents/" + created.id())).body(created);
    }
}
