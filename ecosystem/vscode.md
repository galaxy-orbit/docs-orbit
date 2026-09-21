# VS Code Extension

IDE support with snippets, autocomplete, and validation for Orbit.

## Installation

Search for "Orbit" in VS Code extensions marketplace, or install from VSIX:

```bash
code --install-extension orbit-vscode-0.1.0.vsix
```

## Features

### Code Snippets

Type the prefix and press Tab to insert snippets:

| Prefix | Description |
|--------|-------------|
| `bg-module` | Create a module |
| `bg-controller` | Create a controller |
| `bg-service` | Create a service |
| `bg-guard` | Create a guard |
| `bg-pipe` | Create a pipe |
| `bg-interceptor` | Create an interceptor |
| `bg-middleware` | Create middleware |
| `bg-filter` | Create exception filter |

#### Module Snippet

```typescript
// Type: bg-module + Tab
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class ${1:Name}Module {}
```

#### Controller Snippet

```typescript
// Type: bg-controller + Tab
@Controller('${1:path}')
export class ${2:Name}Controller {
  constructor(private readonly ${3:service}: ${4:Service}) {}

  @Get()
  findAll() {
    return this.${3:service}.findAll();
  }
}
```

### Decorator Autocomplete

Press `@` to see available decorators:

- `@Module` - Module decorator
- `@Controller` - Controller decorator
- `@Injectable` - Injectable decorator
- `@Get`, `@Post`, `@Put`, `@Delete`, `@Patch` - Route decorators
- `@UseGuards`, `@UsePipes`, `@UseInterceptors` - Pipeline decorators

### Diagnostics

Real-time validation of decorators:

- Warns when controllers have no providers
- Validates module structure
- Checks for common mistakes

### Commands

Access via Command Palette (Ctrl+Shift+P / Cmd+Shift+P):

| Command | Description |
|---------|-------------|
| `Orbit: Generate Module` | Generate a new module |
| `Orbit: Generate Controller` | Generate a new controller |
| `Orbit: Generate Service` | Generate a new service |
| `Orbit: Show DI Graph` | Visualize dependency injection |
| `Orbit: Show Routes` | View all application routes |

### Configuration

Settings (File > Preferences > Settings):

```json
{
  "orbit.enableDiagnostics": true,
  "orbit.showInlineHints": true,
  "orbit.formatOnSave": false
}
```

## More Snippets

### GraphQL

| Prefix | Description |
|--------|-------------|
| `bg-resolver` | Create a resolver |
| `bg-objecttype` | Create an ObjectType |
| `bg-inputtype` | Create an InputType |

### Microservices

| Prefix | Description |
|--------|-------------|
| `bg-handler` | Create message handler |
| `bg-gateway` | Create WebSocket gateway |

### Testing

| Prefix | Description |
|--------|-------------|
| `bg-test` | Create unit test |
| `bg-e2e-test` | Create e2e test |

## Keyboard Shortcuts

- `Ctrl+Shift+G` (Windows/Linux) or `Cmd+Shift+G` (Mac): Generate component
- `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac): Show routes

## Tips

1. **Quick Module Creation**: Use `bg-module` snippet and fill in the name
2. **Add Route**: Position cursor in controller, use `bg-get` or `bg-post`
3. **View Dependencies**: Use "Show DI Graph" to visualize module structure
4. **Debug Routes**: Use "Show Routes" to see all registered endpoints
