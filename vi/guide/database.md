# Cơ sở dữ liệu

Orbit tích hợp với Drizzle ORM để thực hiện các thao tác cơ sở dữ liệu an toàn về kiểu.

## Cài đặt

```bash
bun add @galaxy-stack/orbit-database drizzle-orm
```

## Cấu hình

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

## Cơ sở dữ liệu được hỗ trợ

- **PostgreSQL** (`type: 'postgresql'`)
- **MySQL** (`type: 'mysql'`)
- **SQLite** (`type: 'sqlite'`)
- **LibSQL/Turso** (`type: 'libsql'`)
- **MongoDB** (`type: 'mongodb'`)

## Định nghĩa Schema

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

## Mẫu Repository

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

## Sử dụng trong Service

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
  async createOrder(data: CreateOrderDto) {
    const order = await this.orderRepository.create(data);
    await this.inventoryRepository.decrementStock(data.productId, data.quantity);
    return order;
  }
}
```

## Di chuyển (Migration)

```bash
# Tạo migration
bun run drizzle-kit generate

# Đẩy thay đổi lên cơ sở dữ liệu
bun run drizzle-kit push

# Chạy migration
bun run drizzle-kit migrate
```

## Truy vấn thô

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