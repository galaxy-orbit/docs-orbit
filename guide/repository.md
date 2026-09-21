# Repository Pattern

Orbit provides a Repository pattern for clean database access through `@galaxy-stack/orbit-database`.

## Basic Repository

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { Repository, InjectRepository } from '@galaxy-stack/orbit-database';
import { User, users } from './schema';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(@InjectRepository(users) repo: Repository<User>) {
    super(repo);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findActive(): Promise<User[]> {
    return this.findMany({ where: { isActive: true } });
  }
}
```

## Repository Methods

```typescript
interface Repository<T> {
  findOne(options: FindOptions<T>): Promise<T | null>;
  findMany(options?: FindOptions<T>): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(data: InsertType<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<void>;
  count(options?: FindOptions<T>): Promise<number>;
}
```

## Using in Services

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async getUser(id: number) {
    return this.usersRepo.findById(id);
  }

  async createUser(data: CreateUserDto) {
    return this.usersRepo.create(data);
  }
}
```

## Custom Queries

```typescript
@Injectable()
export class UsersRepository extends Repository<User> {
  async searchUsers(query: string): Promise<User[]> {
    return this.db
      .select()
      .from(users)
      .where(like(users.name, `%${query}%`))
      .execute();
  }
}
```
