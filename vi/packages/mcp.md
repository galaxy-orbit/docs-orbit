# @galaxy-stack/orbit-mcp

Model Context Protocol server dành cho Orbit framework — đưa kiến thức framework, công cụ sinh code và kiểm tra bảo mật vào tay các AI coding agent qua [Model Context Protocol](https://modelcontextprotocol.io).

[![npm version](https://img.shields.io/npm/v/@galaxy-stack/orbit-mcp.svg)](https://www.npmjs.com/package/@galaxy-stack/orbit-mcp)

## Cung cấp những gì

| Năng lực | Tools / Resources | Mục đích |
|---|---|---|
| Kiến thức | `orbit_knowledge_topics`, `orbit_knowledge_read`, `orbit://knowledge/*` | Pattern module/controller/DI/GraphQL/microservices, bản đồ package, checklist bảo mật |
| Sinh code | `orbit_scaffold_module`, `orbit_scaffold_graphql` | Tạo module hoàn chỉnh với validation, guard, test |
| Rà soát bảo mật | `orbit_security_review` | Checklist tĩnh: thiếu validation, guard, rate limit, GraphQL limits, secret cứng, HTML chưa làm sạch |
| Prompts | `build_orbit_feature`, `harden_graphql_api`, `migrate_from_nestjs` | Prompt mẫu cho agent |

## Cài đặt

```bash
bun add @galaxy-stack/orbit-mcp
```

## Kết nối với AI agent

```json
{
  "mcpServers": {
    "orbit": {
      "command": "bunx",
      "args": ["@galaxy-stack/orbit-mcp"]
    }
  }
}
```

Hoặc qua Smithery (hosted):

```json
{
  "mcpServers": {
    "orbit": {
      "url": "https://server.smithery.ai/@galaxy-stack/orbit-mcp/mcp",
      "config": {}
    }
  }
}
```

## Skill đi kèm

[`skills/orbit-framework/SKILL.md`](https://github.com/galaxy-orbit/orbit-mcp/tree/main/skills/orbit-framework) là bản hướng dẫn di động cùng nội dung, dành cho agent thích skill hơn MCP. Đã đăng trên [Smithery](https://smithery.ai/skills/galaxy-stack/orbit-framework) với tên `galaxy-stack/orbit-framework`.

## Giao thức

Implement MCP `2025-03-26` qua stdio (JSON-RPC 2.0 phân tách bằng dòng mới): `initialize`, `ping`, `tools/list`, `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get`. Không phụ thuộc runtime — chạy dưới Bun hoặc Node >= 18.
