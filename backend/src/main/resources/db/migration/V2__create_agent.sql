-- Agents (patients of the clinic).
-- name_key = lower-cased trimmed name: SQLite NOCASE/UPPER() only fold ASCII,
-- so case-insensitive uniqueness for Cyrillic names is enforced through this column.
CREATE TABLE agent (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        VARCHAR(60)   NOT NULL,
    name_key    VARCHAR(60)   NOT NULL,
    model       VARCHAR(60)   NOT NULL,
    vendor      VARCHAR(60),
    description VARCHAR(1000),
    created_at  TIMESTAMP     NOT NULL
);

CREATE UNIQUE INDEX ux_agent_name_key ON agent (name_key);
