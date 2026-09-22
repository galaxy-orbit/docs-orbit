# Bảo mật GraphQL

Module GraphQL tích hợp sẵn các luật bảo vệ truy vấn. Mọi luật chạy trong bước kiểm tra truy vấn, trước khi resolver nào thực thi — truy vấn độc hại bị trả về `400` và không bao giờ chạm tới tầng dữ liệu.

## Cấu hình

```ts
import { GraphQLModule } from '@galaxy-stack/orbit-graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      introspection: false,        // tắt __schema/__type trên production
      security: {
        maxDepth: 10,              // độ sâu selection tối đa
        maxComplexity: 1000,       // độ phức tạp tích lũy tối đa
        maxAliases: 30,            // số alias tối đa mỗi truy vấn
        fieldCosts: { posts: 5 },  // chi phí theo field
        listFactors: { posts: 10 } // hệ số nhân của list
      },
    }),
  ],
})
export class AppModule {}
```

## Các luật bảo vệ

| Luật | Mặc định | Chống lại |
|------|----------|-----------|
| Giới hạn độ sâu | 10 | Truy vấn lồng sâu làm cạn resolver stack |
| Giới hạn độ phức tạp | 1000 | Truy vấn đắt tiền; field dạng list nhân chi phí theo hệ số fan-out |
| Giới hạn alias | 30 | Alias bombing (alias cùng field hàng trăm lần) |
| Chặn introspection | tắt trừ khi `introspection: false` | Rò rỉ schema trên production |

## Giới hạn độ sâu

Đếm mỗi tầng field được chọn (bao gồm fragment). `__typename` không tính. Truy vấn vượt `maxDepth` sẽ bị từ chối:

```graphql
# Với maxDepth: 3, truy vấn này bị chặn (5 tầng)
{ post { author { posts { author { posts { title } } } } } }
```

## Phân tích độ phức tạp

Mỗi field mặc định tốn 1 điểm. Selection bên trong field list được nhân với hệ số list (mặc định 10) để mô hình hoá N+1. Gán chi phí cao cho các field gốc đắt tiền:

```ts
security: {
  maxComplexity: 500,
  fieldCosts: { search: 20 },
  listFactors: { posts: 15 },
}
```

## Tắt introspection trên production

```ts
GraphQLModule.forRoot({
  introspection: process.env.NODE_ENV !== 'production',
});
```

Với `introspection: false`, mọi truy vấn chạm vào `__schema` hoặc `__type` trả về:

```json
{ "errors": [{ "message": "GraphQL introspection is disabled." }] }
```

Playground chỉ được phục vụ trên `GET /graphql` khi `playground: true` — hãy tắt cả hai trên production.
