# Giao dịch

Xử lý giao dịch cơ sở dữ liệu một cách an toàn với `@galaxy-stack/orbit-database`.

## Giao dịch cơ bản

```typescript
import { Injectable } from '@galaxy-stack/orbit-common';
import { DatabaseService, Transaction } from '@galaxy-stack/orbit-database';

@Injectable()
export class OrdersService {
  constructor(private readonly db: DatabaseService) {}

  async createOrder(userId: number, items: OrderItem[]) {
    return this.db.transaction(async (tx) => {
      const order = await tx.insert(orders).values({ userId }).returning();
      
      for (const item of items) {
        await tx.insert(orderItems).values({
          orderId: order[0].id,
          ...item,
        });
        
        await tx
          .update(products)
          .set({ stock: sql`stock - ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }
      
      return order[0];
    });
  }
}
```

## Decorator giao dịch

```typescript
import { Transactional } from '@galaxy-stack/orbit-database';

@Injectable()
export class PaymentService {
  @Transactional()
  async processPayment(orderId: number, amount: number) {
    await this.deductBalance(amount);
    await this.updateOrderStatus(orderId, 'paid');
    await this.createPaymentRecord(orderId, amount);
  }
}
```

## Giao dịch lồng nhau

```typescript
async complexOperation() {
  return this.db.transaction(async (tx) => {
    await this.step1(tx);
    
    await tx.transaction(async (nestedTx) => {
      await this.step2(nestedTx);
      await this.step3(nestedTx);
    });
    
    await this.step4(tx);
  });
}
```

## Xử lý rollback

```typescript
async transferFunds(from: number, to: number, amount: number) {
  try {
    return await this.db.transaction(async (tx) => {
      const sender = await this.getBalance(from, tx);
      
      if (sender.balance < amount) {
        throw new Error('Không đủ tiền');
      }
      
      await this.deduct(from, amount, tx);
      await this.credit(to, amount, tx);
      
      return { success: true };
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```