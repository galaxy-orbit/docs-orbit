# Database

Orbit integrates with Drizzle ORM for type-safe database operations.

## Installation

```bash
bun add @galaxy-stack/orbit-database drizzle-orm
```

## Configuration

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

## Supported Databases

- **PostgreSQL** (`type: 'postgresql'`)
- **MySQL** (`type: 'mysql'`)
- **SQLite** (`type: 'sqlite'`)
- **LibSQL/Turso** (`type: 'libsql'`)
- **MongoDB** (`type: 'mongodb'`)

## Defining Schema

```typescript
// schema/user.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## Repository Pattern

```typescript
import { Injectable } from '@galaxy-stack/orbit-core';
import { InjectRepository, Repository } from '@galaxy-stack/orbit-database';
import { users, User, NewUser } from './schema/user';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository extends Repository<typeof users> {
  constructor(@InjectRepository(users) repository: Repository<typeof users>) {
    super(repository);
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
}
```

## Using in Services

```typescript
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.userRepository.findById(id);
  }

  create(data: NewUser) {
    return this.userRepository.create(data);
  }
}
```

## Transactions

```typescript
import { Transaction } from '@galaxy-stack/orbit-database';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private inventoryRepository: InventoryRepository,
  ) {}

  @Transaction()
  async createOrder(data: CreateOrderDto) {
    const order = await this.orderRepository.create(data);
    await this.inventoryRepository.decrementStock(data.productId, data.quantity);
    return order;
  }
}
```

## Migrations

```bash
# Generate migration
bun run drizzle-kit generate

# Push changes to database
bun run drizzle-kit push

# Run migrations
bun run drizzle-kit migrate
```

## Raw Queries

```typescript
@Injectable()
export class ReportService {
  constructor(@InjectDatabase() private db: Database) {}

  async getStats() {
    return this.db.execute(sql`
      SELECT 
        COUNT(*) as total,
        DATE(created_at) as date
      FROM users
      GROUP BY DATE(created_at)
    `);
  }
}
```
