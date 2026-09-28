package dev.polina.agentclinic.config;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.config.BeanPostProcessor;

/**
 * Creates the parent directory of a file-based SQLite database before the
 * connection pool opens it: the SQLite driver does not create missing directories.
 */
public class SqliteDirectoryInitializer implements BeanPostProcessor {

    private static final String SQLITE_PREFIX = "jdbc:sqlite:";

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        if (bean instanceof HikariDataSource dataSource) {
            databaseFile(dataSource.getJdbcUrl()).ifPresent(SqliteDirectoryInitializer::createParentDirectory);
        }
        return bean;
    }

    static Optional<Path> databaseFile(String jdbcUrl) {
        if (jdbcUrl == null || !jdbcUrl.startsWith(SQLITE_PREFIX)) {
            return Optional.empty();
        }
        String location = jdbcUrl.substring(SQLITE_PREFIX.length());
        int queryStart = location.indexOf('?');
        if (queryStart >= 0) {
            location = location.substring(0, queryStart);
        }
        if (location.isEmpty() || location.startsWith(":memory:") || location.startsWith("file:")) {
            return Optional.empty();
        }
        return Optional.of(Path.of(location));
    }

    private static void createParentDirectory(Path databaseFile) {
        Path parent = databaseFile.toAbsolutePath().getParent();
        if (parent == null) {
            return;
        }
        try {
            Files.createDirectories(parent);
        } catch (IOException e) {
            throw new UncheckedIOException("Cannot create SQLite database directory " + parent, e);
        }
    }
}
