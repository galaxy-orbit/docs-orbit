import { defineConfig } from 'vitepress';

export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'Galaxy Orbit',
      description: 'A NestJS-style framework optimized for the Bun runtime — 30+ modular packages, GraphQL, microservices, and first-class security.',
    },
    vi: {
      label: 'Tiếng Việt',
      lang: 'vi',
      title: 'Galaxy Orbit',
      description: 'Framework backend theo phong cách NestJS, tối ưu cho Bun runtime — hơn 30 package mô-đun, GraphQL, microservices và bảo mật toàn diện.',
      link: '/vi/',
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  ],

  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Packages', link: '/packages/core' },
      { text: 'API Reference', link: '/api/decorators' },
      {
        text: 'Ecosystem',
        items: [
          { text: 'VS Code Extension', link: '/ecosystem/vscode' },
          { text: 'CLI', link: '/ecosystem/cli' },
          { text: 'Devtools', link: '/ecosystem/devtools' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Project Structure', link: '/guide/project-structure' },
          ],
        },
        {
          text: 'Fundamentals',
          items: [
            { text: 'Modules', link: '/guide/modules' },
            { text: 'Controllers', link: '/guide/controllers' },
            { text: 'Providers', link: '/guide/providers' },
            { text: 'Dependency Injection', link: '/guide/dependency-injection' },
          ],
        },
        {
          text: 'Request Pipeline',
          items: [
            { text: 'Middleware', link: '/guide/middleware' },
            { text: 'Guards', link: '/guide/guards' },
            { text: 'Pipes', link: '/guide/pipes' },
            { text: 'Interceptors', link: '/guide/interceptors' },
            { text: 'Exception Filters', link: '/guide/exception-filters' },
          ],
        },
        {
          text: 'Database',
          items: [
            { text: 'Database Setup', link: '/guide/database' },
            { text: 'Repository Pattern', link: '/guide/repository' },
            { text: 'Transactions', link: '/guide/transactions' },
          ],
        },
        {
          text: 'GraphQL',
          items: [
            { text: 'GraphQL Setup', link: '/guide/graphql' },
            { text: 'Resolvers', link: '/guide/resolvers' },
            { text: 'DataLoader', link: '/guide/dataloader' },
            { text: 'Subscriptions', link: '/guide/subscriptions' },
            { text: 'Federation', link: '/guide/federation' },
            { text: 'GraphQL Security', link: '/guide/graphql-security' },
          ],
        },
        {
          text: 'Microservices',
          items: [
            { text: 'Overview', link: '/guide/microservices' },
            { text: 'TCP Transport', link: '/guide/microservices-tcp' },
            { text: 'Redis Transport', link: '/guide/microservices-redis' },
            { text: 'NATS Transport', link: '/guide/microservices-nats' },
            { text: 'RabbitMQ Transport', link: '/guide/microservices-rmq' },
            { text: 'Kafka Transport', link: '/guide/microservices-kafka' },
            { text: 'gRPC Transport', link: '/guide/microservices-grpc' },
          ],
        },
        {
          text: 'WebSocket',
          items: [
            { text: 'Gateway', link: '/guide/websocket-gateway' },
            { text: 'Events', link: '/guide/websocket-events' },
          ],
        },
        {
          text: 'Security',
          items: [
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Authorization', link: '/guide/authorization' },
            { text: 'Rate Limiting', link: '/guide/rate-limiting' },
            { text: 'CORS & Helmet', link: '/guide/security-headers' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Validation', link: '/guide/validation' },
            { text: 'Caching', link: '/guide/caching' },
            { text: 'Task Scheduling', link: '/guide/scheduling' },
            { text: 'Health Checks', link: '/guide/health-checks' },
            { text: 'API Versioning', link: '/guide/versioning' },
            { text: 'Lifecycle Hooks', link: '/guide/lifecycle' },
          ],
        },
        {
          text: 'Observability',
          items: [
            { text: 'Logging', link: '/guide/logging' },
            { text: 'Tracing', link: '/guide/tracing' },
            { text: 'Metrics', link: '/guide/metrics' },
          ],
        },
        {
          text: 'Testing',
          items: [
            { text: 'Unit Testing', link: '/guide/testing' },
            { text: 'E2E Testing', link: '/guide/e2e-testing' },
          ],
        },
        {
          text: 'Migration',
          items: [
            { text: 'From NestJS', link: '/guide/migration' },
          ],
        },
      ],

      '/packages/': [
        {
          text: 'Core Packages',
          items: [
            { text: '@galaxy-stack/orbit-core', link: '/packages/core' },
            { text: '@galaxy-stack/orbit-common', link: '/packages/common' },
            { text: '@galaxy-stack/orbit-config', link: '/packages/config' },
            { text: '@galaxy-stack/orbit-validation', link: '/packages/validation' },
            { text: '@galaxy-stack/orbit-platform-bun', link: '/packages/platform-bun' },
          ],
        },
        {
          text: 'Database',
          items: [
            { text: '@galaxy-stack/orbit-database', link: '/packages/database' },
            { text: '@galaxy-stack/orbit-cache', link: '/packages/cache' },
          ],
        },
        {
          text: 'Microservices',
          items: [
            { text: '@galaxy-stack/orbit-microservices', link: '/packages/microservices' },
            { text: '@galaxy-stack/orbit-microservices-tcp', link: '/packages/microservices-tcp' },
            { text: '@galaxy-stack/orbit-microservices-redis', link: '/packages/microservices-redis' },
            { text: '@galaxy-stack/orbit-microservices-nats', link: '/packages/microservices-nats' },
            { text: '@galaxy-stack/orbit-microservices-rmq', link: '/packages/microservices-rmq' },
            { text: '@galaxy-stack/orbit-microservices-kafka', link: '/packages/microservices-kafka' },
            { text: '@galaxy-stack/orbit-microservices-grpc', link: '/packages/microservices-grpc' },
          ],
        },
        {
          text: 'GraphQL',
          items: [
            { text: '@galaxy-stack/orbit-graphql', link: '/packages/graphql' },
            { text: '@galaxy-stack/orbit-graphql-federation', link: '/packages/graphql-federation' },
          ],
        },
        {
          text: 'WebSocket',
          items: [
            { text: '@galaxy-stack/orbit-websockets', link: '/packages/websockets' },
          ],
        },
        {
          text: 'Security',
          items: [
            { text: '@galaxy-stack/orbit-auth', link: '/packages/auth' },
            { text: '@galaxy-stack/orbit-security', link: '/packages/security' },
            { text: '@galaxy-stack/orbit-throttler', link: '/packages/throttler' },
          ],
        },
        {
          text: 'Observability',
          items: [
            { text: '@galaxy-stack/orbit-observability', link: '/packages/observability' },
            { text: '@galaxy-stack/orbit-logger', link: '/packages/logger' },
          ],
        },
        {
          text: 'Utilities',
          items: [
            { text: '@galaxy-stack/orbit-mcp', link: '/packages/mcp' },
            { text: '@galaxy-stack/orbit-schedule', link: '/packages/schedule' },
            { text: '@galaxy-stack/orbit-terminus', link: '/packages/terminus' },
            { text: '@galaxy-stack/orbit-swagger', link: '/packages/swagger' },
            { text: '@galaxy-stack/orbit-docs', link: '/packages/docs' },
            { text: '@galaxy-stack/orbit-devtools', link: '/packages/devtools' },
          ],
        },
        {
          text: 'Development',
          items: [
            { text: 'orbit-cli', link: '/packages/cli' },
            { text: '@galaxy-stack/orbit-testing', link: '/packages/testing' },
          ],
        },
      ],

      '/api/': [
        {
          text: 'Decorators',
          items: [
            { text: 'Module Decorators', link: '/api/decorators' },
            { text: 'Controller Decorators', link: '/api/controller-decorators' },
            { text: 'Route Decorators', link: '/api/route-decorators' },
            { text: 'Parameter Decorators', link: '/api/param-decorators' },
            { text: 'Injectable Decorators', link: '/api/injectable-decorators' },
          ],
        },
        {
          text: 'Interfaces',
          items: [
            { text: 'Module Interfaces', link: '/api/module-interfaces' },
            { text: 'Pipeline Interfaces', link: '/api/pipeline-interfaces' },
            { text: 'Lifecycle Interfaces', link: '/api/lifecycle-interfaces' },
          ],
        },
      ],

      '/ecosystem/': [
        {
          text: 'Tools',
          items: [
            { text: 'VS Code Extension', link: '/ecosystem/vscode' },
            { text: 'CLI', link: '/ecosystem/cli' },
            { text: 'Devtools Dashboard', link: '/ecosystem/devtools' },
          ],
        },
      ],
      
      '/vi/guide/': [
        {
          text: 'Bắt đầu',
          items: [
            { text: 'Giới thiệu', link: '/vi/guide/introduction' },
            { text: 'Bắt đầu nhanh', link: '/vi/guide/quick-start' },
            { text: 'Cấu trúc dự án', link: '/vi/guide/project-structure' },
          ],
        },
        {
          text: 'Cơ bản',
          items: [
            { text: 'Module', link: '/vi/guide/modules' },
            { text: 'Controller', link: '/vi/guide/controllers' },
            { text: 'Provider', link: '/vi/guide/providers' },
            { text: 'Tiêm phụ thuộc', link: '/vi/guide/dependency-injection' },
          ],
        },
        {
          text: 'Pipeline yêu cầu',
          items: [
            { text: 'Middleware', link: '/vi/guide/middleware' },
            { text: 'Guard', link: '/vi/guide/guards' },
            { text: 'Pipe', link: '/vi/guide/pipes' },
            { text: 'Interceptor', link: '/vi/guide/interceptors' },
            { text: 'Bộ lọc ngoại lệ', link: '/vi/guide/exception-filters' },
          ],
        },
        {
          text: 'Cơ sở dữ liệu',
          items: [
            { text: 'Thiết lập CSDL', link: '/vi/guide/database' },
            { text: 'Mẫu Repository', link: '/vi/guide/repository' },
            { text: 'Giao dịch', link: '/vi/guide/transactions' },
          ],
        },
        {
          text: 'GraphQL',
          items: [
            { text: 'Thiết lập GraphQL', link: '/vi/guide/graphql' },
            { text: 'Resolver', link: '/vi/guide/resolvers' },
            { text: 'DataLoader', link: '/vi/guide/dataloader' },
            { text: 'Subscription', link: '/vi/guide/subscriptions' },
            { text: 'Federation', link: '/vi/guide/federation' },
            { text: 'Bảo mật GraphQL', link: '/vi/guide/graphql-security' },
          ],
        },
        {
          text: 'Microservice',
          items: [
            { text: 'Tổng quan', link: '/vi/guide/microservices' },
            { text: 'TCP Transport', link: '/vi/guide/microservices-tcp' },
            { text: 'Redis Transport', link: '/vi/guide/microservices-redis' },
            { text: 'NATS Transport', link: '/vi/guide/microservices-nats' },
            { text: 'RabbitMQ Transport', link: '/vi/guide/microservices-rmq' },
            { text: 'Kafka Transport', link: '/vi/guide/microservices-kafka' },
            { text: 'gRPC Transport', link: '/vi/guide/microservices-grpc' },
          ],
        },
        {
          text: 'WebSocket',
          items: [
            { text: 'Gateway', link: '/vi/guide/websocket-gateway' },
            { text: 'Sự kiện', link: '/vi/guide/websocket-events' },
          ],
        },
        {
          text: 'Bảo mật',
          items: [
            { text: 'Xác thực', link: '/vi/guide/authentication' },
            { text: 'Ủy quyền', link: '/vi/guide/authorization' },
            { text: 'Giới hạn tốc độ', link: '/vi/guide/rate-limiting' },
            { text: 'CORS & Helmet', link: '/vi/guide/security-headers' },
          ],
        },
        {
          text: 'Nâng cao',
          items: [
            { text: 'Cấu hình', link: '/vi/guide/configuration' },
            { text: 'Xác thực dữ liệu', link: '/vi/guide/validation' },
            { text: 'Bộ nhớ đệm', link: '/vi/guide/caching' },
            { text: 'Lập lịch tác vụ', link: '/vi/guide/scheduling' },
            { text: 'Kiểm tra sức khỏe', link: '/vi/guide/health-checks' },
            { text: 'Phiên bản API', link: '/vi/guide/versioning' },
            { text: 'Hook vòng đời', link: '/vi/guide/lifecycle' },
          ],
        },
        {
          text: 'Khả năng quan sát',
          items: [
            { text: 'Logging', link: '/vi/guide/logging' },
            { text: 'Truy vết', link: '/vi/guide/tracing' },
            { text: 'Metric', link: '/vi/guide/metrics' },
          ],
        },
        {
          text: 'Kiểm thử',
          items: [
            { text: 'Kiểm thử đơn vị', link: '/vi/guide/testing' },
            { text: 'Kiểm thử E2E', link: '/vi/guide/e2e-testing' },
          ],
        },
        {
          text: 'Di chuyển',
          items: [
            { text: 'Từ NestJS', link: '/vi/guide/migration' },
          ],
        },
      ],

      '/vi/packages/': [
        {
          text: 'Gói lõi',
          items: [
            { text: '@galaxy-stack/orbit-core', link: '/vi/packages/core' },
            { text: '@galaxy-stack/orbit-common', link: '/vi/packages/common' },
            { text: '@galaxy-stack/orbit-config', link: '/vi/packages/config' },
            { text: '@galaxy-stack/orbit-validation', link: '/vi/packages/validation' },
            { text: '@galaxy-stack/orbit-platform-bun', link: '/vi/packages/platform-bun' },
          ],
        },
        {
          text: 'Cơ sở dữ liệu',
          items: [
            { text: '@galaxy-stack/orbit-database', link: '/vi/packages/database' },
            { text: '@galaxy-stack/orbit-cache', link: '/vi/packages/cache' },
          ],
        },
        {
          text: 'Microservices',
          items: [
            { text: '@galaxy-stack/orbit-microservices', link: '/vi/packages/microservices' },
            { text: '@galaxy-stack/orbit-microservices-tcp', link: '/vi/packages/microservices-tcp' },
            { text: '@galaxy-stack/orbit-microservices-redis', link: '/vi/packages/microservices-redis' },
            { text: '@galaxy-stack/orbit-microservices-nats', link: '/vi/packages/microservices-nats' },
            { text: '@galaxy-stack/orbit-microservices-rmq', link: '/vi/packages/microservices-rmq' },
            { text: '@galaxy-stack/orbit-microservices-kafka', link: '/vi/packages/microservices-kafka' },
            { text: '@galaxy-stack/orbit-microservices-grpc', link: '/vi/packages/microservices-grpc' },
          ],
        },
        {
          text: 'GraphQL',
          items: [
            { text: '@galaxy-stack/orbit-graphql', link: '/vi/packages/graphql' },
            { text: '@galaxy-stack/orbit-graphql-federation', link: '/vi/packages/graphql-federation' },
          ],
        },
        {
          text: 'WebSocket',
          items: [
            { text: '@galaxy-stack/orbit-websockets', link: '/vi/packages/websockets' },
          ],
        },
        {
          text: 'Bảo mật',
          items: [
            { text: '@galaxy-stack/orbit-auth', link: '/vi/packages/auth' },
            { text: '@galaxy-stack/orbit-security', link: '/vi/packages/security' },
            { text: '@galaxy-stack/orbit-throttler', link: '/vi/packages/throttler' },
          ],
        },
        {
          text: 'Khả năng quan sát',
          items: [
            { text: '@galaxy-stack/orbit-observability', link: '/vi/packages/observability' },
            { text: '@galaxy-stack/orbit-logger', link: '/vi/packages/logger' },
          ],
        },
        {
          text: 'Tiện ích',
          items: [
            { text: '@galaxy-stack/orbit-mcp', link: '/vi/packages/mcp' },
            { text: '@galaxy-stack/orbit-schedule', link: '/vi/packages/schedule' },
            { text: '@galaxy-stack/orbit-terminus', link: '/vi/packages/terminus' },
            { text: '@galaxy-stack/orbit-swagger', link: '/vi/packages/swagger' },
            { text: '@galaxy-stack/orbit-docs', link: '/vi/packages/docs' },
            { text: '@galaxy-stack/orbit-devtools', link: '/vi/packages/devtools' },
          ],
        },
        {
          text: 'Phát triển',
          items: [
            { text: 'orbit-cli', link: '/vi/packages/cli' },
            { text: '@galaxy-stack/orbit-testing', link: '/vi/packages/testing' },
          ],
        },
      ],

      '/vi/api/': [
        {
          text: 'Decorator',
          items: [
            { text: 'Decorator Module', link: '/vi/api/decorators' },
            { text: 'Decorator Controller', link: '/vi/api/controller-decorators' },
            { text: 'Decorator Route', link: '/vi/api/route-decorators' },
            { text: 'Decorator Tham số', link: '/vi/api/param-decorators' },
            { text: 'Decorator Có thể tiêm', link: '/vi/api/injectable-decorators' },
          ],
        },
        {
          text: 'Interface',
          items: [
            { text: 'Interface Module', link: '/vi/api/module-interfaces' },
            { text: 'Interface Pipeline', link: '/vi/api/pipeline-interfaces' },
            { text: 'Interface Vòng đời', link: '/vi/api/lifecycle-interfaces' },
          ],
        },
      ],

      '/vi/ecosystem/': [
        {
          text: 'Công cụ',
          items: [
            { text: 'VS Code Extension', link: '/vi/ecosystem/vscode' },
            { text: 'CLI', link: '/vi/ecosystem/cli' },
            { text: 'Devtools Dashboard', link: '/vi/ecosystem/devtools' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/galaxy-orbit' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Galaxy Orbit',
    },

    search: {
      provider: 'local',
    },
  },
});