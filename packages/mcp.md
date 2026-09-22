# @galaxy-stack/orbit-mcp

Model Context Protocol server that gives AI coding agents first-class knowledge of Orbit: framework patterns, code scaffolding, and security review — through the [Model Context Protocol](https://modelcontextprotocol.io).

[![npm version](https://img.shields.io/npm/v/@galaxy-stack/orbit-mcp.svg)](https://www.npmjs.com/package/@galaxy-stack/orbit-mcp)

## What it provides

| Capability | Tools / Resources | Purpose |
|---|---|---|
| Knowledge | `orbit_knowledge_topics`, `orbit_knowledge_read`, `orbit://knowledge/*` | Module/controller/DI/GraphQL/microservices patterns, package map, security checklist |
| Scaffolding | `orbit_scaffold_module`, `orbit_scaffold_graphql` | Generate complete feature modules with validation, guards, and tests |
| Security review | `orbit_security_review` | Static checklist: missing validation, guards, rate limits, GraphQL limits, hardcoded secrets, unsanitized HTML |
| Prompts | `build_orbit_feature`, `harden_graphql_api`, `migrate_from_nestjs` | Ready-made task prompts for agents |

## Install

```bash
bun add @galaxy-stack/orbit-mcp
```

## Connect to your AI agent

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

Or via Smithery (hosted):

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

## Companion skill

[`skills/orbit-framework/SKILL.md`](https://github.com/galaxy-orbit/orbit-mcp/tree/main/skills/orbit-framework) is a portable skill definition covering the same guidance for agents that prefer skills over MCP. Published on [Smithery](https://smithery.ai/skills/galaxy-stack/orbit-framework) as `galaxy-stack/orbit-framework`.

## Protocol

Implements MCP `2025-03-26` over stdio (newline-delimited JSON-RPC 2.0): `initialize`, `ping`, `tools/list`, `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get`. Zero runtime dependencies — runs under Bun or Node >= 18.
