# Spring Boot Starter

Minimal Spring Boot 3 + Kotlin + Gradle starter template.

## Prerequisites

- JDK 21+
- Gradle 8.x (run `gradle wrapper --gradle-version 8.8` to generate wrapper)

## Setup

```bash
gradle wrapper --gradle-version 8.8
```

## Run

```bash
./gradlew bootRun
```

Server starts at http://localhost:8080

## Endpoints

- `GET /` — Welcome message
- `GET /health` — Health check
