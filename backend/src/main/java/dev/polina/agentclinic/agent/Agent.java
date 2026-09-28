package dev.polina.agentclinic.agent;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "agent")
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // SQLite autoincrement requires the column to be declared exactly INTEGER (a rowid alias).
    @Column(columnDefinition = "integer")
    private Long id;

    @Column(nullable = false, length = 60)
    private String name;

    @Column(name = "name_key", nullable = false, length = 60, unique = true)
    private String nameKey;

    @Column(nullable = false, length = 60)
    private String model;

    @Column(length = 60)
    private String vendor;

    @Column(length = 1000)
    private String description;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Agent() {
    }

    public Agent(String name, String nameKey, String model, String vendor, String description, Instant createdAt) {
        this.name = name;
        this.nameKey = nameKey;
        this.model = model;
        this.vendor = vendor;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getNameKey() {
        return nameKey;
    }

    public String getModel() {
        return model;
    }

    public String getVendor() {
        return vendor;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
