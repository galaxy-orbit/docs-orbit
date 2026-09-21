# @galaxy-stack/orbit-database

Tích hợp cơ sở dữ liệu với Drizzle ORM và mẫu Repository.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-database drizzle-orm
```

## Cơ sở dữ liệu được hỗ trợ

| Cơ sở dữ liệu | Driver |
|---------------|--------|
| PostgreSQL | `drizzle-orm/postgres-js` |
| MySQL | `drizzle-orm/mysql2` |
| SQLite | `drizzle-orm/better-sqlite3` |
| LibSQL | `drizzle-orm/libsql` |
| MongoDB | Driver gốc |

## Thiết lập

### PostgreSQL

```typescript
import { Module } from '@galaxy-stack/orbit-core';
import { DatabaseModule } from '@galaxy-stack/orbit-database';

@Module({
  imports: [
    DatabaseModule.forRoot({
      type: 'postgresql',
      url: process.env.DATABASE_URL,
    }),
  ],
})
export class AppModule {}
```

### SQLite

```typescript
DatabaseModule.forRoot({
  type: 'sqlite',
  database: './data.db',
})
```

### MySQL

```typescript
DatabaseModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'mydb',
})
```

## Định nghĩa Schema

```typescript
// schema/users.ts
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## Repository

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { InjectDatabase, Repository } from '@galaxy-stack/orbit-database';
import { users, User, NewUser } from './schema';
import { eq, desc, like } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  constructor(@InjectDatabase() private db: Database) {}

  async findAll(): Promise<User[]> {
    return this.db.select().from(users);
  }

  async findById(id: number): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0];
  }

  async create(data: NewUser): Promise<User> {
    const result = await this.db
      .insert(users)
      .values(data)
      .returning();
    return result[0];
  }

  async update(id: number, data: Partial<NewUser>): Promise<User> {
    const result = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(users).where(eq(users.id, id));
  }

  async search(query: string): Promise<User[]> {
    return this.db
      .select()
      .from(users)
      .where(like(users.name, `%${query}%`))
      .orderBy(desc(users.createdAt));
  }
}
```

## Giao dịch

```typescript
import { Transaction } from '@galaxy-stack/orbit-database';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private inventoryRepository: InventoryRepository,
  ) {}

  @Transaction()
  async createOrder(dto: CreateOrderDto) {
    // Tất cả các thao tác trong cùng một giao dịch
    const order = await this.orderRepository.create(dto);
    await this.inventoryRepository.decrementStock(dto.productId, dto.quantity);
    return order;
  }
}
```

### Giao dịch thủ công

```typescript
async createOrder(dto: CreateOrderDto) {
  return this.db.transaction(async (tx) => {
    const order = await tx.insert(orders).values(dto).returning();
    await tx.update(inventory)
      .set({ stock: sql`stock - ${dto.quantity}` })
      .where(eq(inventory.productId, dto.productId));
    return order[0];
  });
}
```

## Migration

```bash
# Tạo migration
bun run drizzle-kit generate:pg

# Áp dụng migration
bun run drizzle-kit push:pg

# Xóa tất cả bảng
bun run drizzle-kit drop
```

## SQL thô

```typescript
import { sql } from 'drizzle-orm';

async getStats() {
  return this.db.execute(sql`
    SELECT 
      COUNT(*) as total,
      DATE(created_at) as date
    FROM users
    WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `);
}
```

## Xuất khẩu

```typescript
export {
  DatabaseModule,
  InjectDatabase,
  Repository,
  Transaction,
  Database,
};
```