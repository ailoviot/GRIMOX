import { join } from 'node:path';
import { writeFileSafe } from '../utils/fs-helpers.js';

/**
 * Inyecta GitHub Actions CI/CD workflow
 */
export async function inject(projectPath, config) {
    const stackId = config.isDecoupled ? null : config.stackId;
    const language = config.isDecoupled
        ? config.backend.language
        : config.language;

    const workflow = getWorkflow(stackId, language, config);

    await writeFileSafe(
        join(projectPath, '.github', 'workflows', 'ci.yml'),
        workflow
    );
}

function getWorkflow(stackId, language, config) {
    if (['fastapi', 'fastapi-ml'].includes(stackId) || language === 'Python') {
        return getPythonWorkflow();
    }

    if (stackId === 'springboot') {
        return getSpringBootWorkflow(config.language);
    }

    if (stackId === 'flutter') {
        return getFlutterWorkflow();
    }

    return getNodeWorkflow(config);
}

function getNodeWorkflow(config) {
    return `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint --if-present

      - name: Test
        run: npm test --if-present

      - name: Build
        run: npm run build --if-present
`;
}

function getPythonWorkflow() {
    return `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
          cache: 'pip'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Lint
        run: |
          pip install ruff
          ruff check .

      - name: Test
        run: pytest --if-present || echo "No tests configured"
`;
}

function getSpringBootWorkflow(language) {
    const buildCmd = language === 'Kotlin' ? './gradlew build' : './mvnw verify';
    const cache = language === 'Kotlin' ? 'gradle' : 'maven';

    return `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup JDK 21
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: 21
          cache: '${cache}'

      - name: Build & Test
        run: ${buildCmd}
`;
}

function getFlutterWorkflow() {
    return `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
          cache: true

      - name: Install dependencies
        run: flutter pub get

      - name: Analyze
        run: flutter analyze

      - name: Test
        run: flutter test
`;
}
