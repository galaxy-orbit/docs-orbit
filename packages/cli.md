# orbit

Command-line tool for scaffolding and code generation.

## Installation

```bash
bun add -g orbit
# or use with bunx
orbit <command>
```

## Commands

### Create New Project

```bash
orbit new my-app

# Options
orbit new my-app --skip-git     # Skip git initialization
orbit new my-app --skip-install # Skip dependency installation
```

Generated structure:

```
my-app/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── app.service.ts
├── test/
│   └── app.e2e-spec.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Generate Components

```bash
# Generate controller
orbit generate controller users
orbit g controller users  # shorthand

# Generate service
orbit generate service users
orbit g s users  # shorthand

# Generate module
orbit generate module users
orbit g mo users

# Generate guard
orbit generate guard auth

# Generate pipe
orbit generate pipe validation

# Generate interceptor
orbit generate interceptor logging

# Generate middleware
orbit generate middleware logger

# Generate filter
orbit generate filter http-exception

# Generate complete resource (CRUD)
orbit generate resource users
orbit g res users
```

### Generate Options

```bash
# Specify directory
orbit g controller users --path src/modules/users

# Flat structure (no folder)
orbit g service users --flat

# Skip spec file
orbit g controller users --no-spec

# Dry run (preview)
orbit g module users --dry-run
```

### Development Server

```bash
orbit dev

# With options
orbit dev --port 3000
orbit dev --host 0.0.0.0
```

Features:
- Hot reload with Bun.Transpiler
- Near-instant file transpilation
- Automatic restart on file changes

### Build

```bash
orbit build

# Options
orbit build --outdir dist
orbit build --minify
```

### Test

```bash
orbit test

# Options
orbit test --watch
orbit test --coverage
orbit test src/users/
```

## GraphQL Generation

```bash
# Generate resolver
orbit generate resolver users

# Generate complete GraphQL resource
orbit generate graphql-resource users
```

Generated files:
- `users.resolver.ts`
- `users.service.ts`
- `dto/create-user.input.ts`
- `dto/update-user.input.ts`
- `entities/user.entity.ts`

## Microservices Generation

```bash
# Generate message handler
orbit generate handler notifications

# Generate complete microservice resource
orbit generate microservice-resource orders
```

## Configuration

Create `orbit.json` in project root:

```json
{
  "sourceRoot": "src",
  "generateOptions": {
    "spec": true,
    "flat": false
  },
  "compilerOptions": {
    "plugins": []
  }
}
```

## Programmatic Usage

```typescript
import { CLI } from 'orbit';

const cli = new CLI();

// Generate component
await cli.generate('controller', 'users', {
  path: 'src/modules/users',
  spec: true,
});

// Create project
await cli.createProject('my-app', {
  skipGit: false,
  skipInstall: false,
});
```

## Exports

```typescript
export {
  CLI,
  NewCommand,
  GenerateCommand,
  DevCommand,
  BuildCommand,
  TestCommand,
};
```
