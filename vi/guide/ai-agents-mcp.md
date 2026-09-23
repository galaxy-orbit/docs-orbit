# MCP & Skills cho AI Agents

Orbit cung cấp **MCP server** tích hợp sẵn và **skill file** để các AI coding agent (Claude, Cursor, Codex, Copilot Workspace...) làm việc trực tiếp với codebase Orbit: tra cứu kiến thức framework, sinh module code, audit bảo mật.

## Package cần cài

```bash
bun add -g @galaxy-stack/orbit-mcp
# hoặc dùng npx
npx @galaxy-stack/orbit-mcp
```

MCP server chạy qua stdio (JSON-RPC 2.0), không có dependency runtime, chạy được cả Bun và Node ≥ 18.

## Cấu hình MCP server

### Claude Desktop

Thêm vào `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "orbit": {
      "command": "npx",
      "args": ["-y", "@galaxy-stack/orbit-mcp"]
    }
  }
}
```

### Cursor / Windsurf

Thêm vào `.cursor/mcp.json` (hoặc cấu hình MCP tương ứng):

```json
{
  "mcpServers": {
    "orbit": {
      "command": "npx",
      "args": ["-y", "@galaxy-stack/orbit-mcp"]
    }
  }
}
```

### Codex CLI

Thêm vào `~/.codex/config.toml`:

```toml
[mcp_servers.orbit]
command = "npx"
args = ["-y", "@galaxy-stack/orbit-mcp"]
```

### Ứng dụng Orbit của bạn (hosted)

Orbit app cũng có thể expose MCP endpoint qua HTTP cho agent kết nối trực tiếp:

```json
{
  "mcpServers": {
    "orbit": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## Tools có sẵn

| Tool | Chức năng |
|---|---|
| `orbit_knowledge_topics` | Liệt kê các chủ đề kiến thức framework |
| `orbit_knowledge_read` | Đọc chi tiết một chủ đề theo id |
| `orbit_scaffold_module` | Sinh module hoàn chỉnh (module, controller, service, Zod DTO, tests) |
| `orbit_scaffold_graphql` | Sinh GraphQL resolver + types + wiring bảo mật |
| `orbit_security_review` | Kiểm tra checklist bảo mật trên code bạn dán vào |

## Prompts mẫu

MCP server cũng cung cấp sẵn các prompt template:

- `build_orbit_feature` — thiết kế và hiện thực một feature module end-to-end
- `harden_graphql_api` — audit và gia cố GraphQL API (introspection, depth limits, auth)
- `migrate_from_nestjs` — map decorator/concept NestJS sang Orbit và lập kế hoạch migration

## Cài Skill cho AI Agent

Skill file giúp agent hiểu quy ước framework khi viết code (dùng Bun thay node, cấu trúc module, security baseline...). Có 2 cách:

### Cách 1 — Copy skill file

```bash
# Từ package npm
cp node_modules/@galaxy-stack/orbit-mcp/skills/orbit-framework/SKILL.md ~/.claude/skills/orbit-framework/

# Hoặc clone từ repo
git clone https://github.com/galaxy-orbit/orbit-cli.git
cp orbit-cli/skills/orbit-framework/SKILL.md ~/.claude/skills/orbit-framework/
```

Với Cursor, copy vào `.cursor/skills/`; với Codex, copy vào `~/.codex/skills/`.

### Cách 2 — Smithery (hosted)

Cài qua Smithery registry: `galaxy-stack/orbit-framework`.

## Kiểm tra cài đặt

Sau khi cấu hình, khởi động lại agent và thử:

```
Liệt kê các knowledge topics của Orbit framework
```

Agent sẽ gọi tool `orbit_knowledge_topics` và trả về danh sách chủ đề — xác nhận MCP đã kết nối thành công.

## Khắc phục sự cố

**`npx` không tìm thấy package:** kiểm tra bạn đã đăng nhập npm hoặc dùng `bunx` thay thế: `bunx @galaxy-stack/orbit-mcp`.

**Tool không hiện trong agent:** đảm bảo cấu hình JSON đúng vị trí file config mà agent đó đọc; khởi động lại agent sau khi sửa.

**Lỗi stdio trên Windows:** dùng `cmd /c npx -y @galaxy-stack/orbit-mcp` làm command.
