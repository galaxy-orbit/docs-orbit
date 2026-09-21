# Hướng dẫn Deploy orbit/docs lên Vercel

Hướng dẫn chi tiết này sẽ giúp bạn deploy dự án tài liệu orbit/docs lên Vercel một cách dễ dàng.

## Kiểm tra cấu hình hiện tại

Dự án đã có sẵn các file cấu hình cần thiết cho việc deploy lên Vercel:

### package.json
```json
{
  "name": "orbit-docs",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "docs:build": "vitepress build",
    "preview": "vitepress preview"
  },
  "devDependencies": {
    "vitepress": "^1.0.0",
    "vue": "^3.4.0"
  }
}
```

### vercel.json
```json
{
  "buildCommand": "npm run docs:build",
  "outputDirectory": ".vitepress/dist",
  "installCommand": "npm install",
  "framework": "vitepress"
}
```

## Phương pháp 1: Deploy qua giao diện Vercel (Khuyến nghị)

1. Truy cập [vercel.com](https://vercel.com) và đăng nhập vào tài khoản của bạn
2. Click vào nút "New Project"
3. Import repository chứa orbit/docs:
   - Nếu bạn đã kết nối GitHub, chọn repository từ danh sách
   - Nếu chưa, kết nối tài khoản GitHub và chọn repository
4. Trong phần "Configure Project":
   - Framework Preset: Chọn "Other"
   - Build Command: `npm run docs:build`
   - Output Directory: `.vitepress/dist`
   - Install Command: `npm install`
5. Click "Deploy" để bắt đầu quá trình deploy

Quá trình deploy sẽ mất vài phút. Sau khi hoàn tất, bạn sẽ nhận được URL công khai cho trang tài liệu.

## Phương pháp 2: Deploy bằng Vercel CLI

### Cài đặt Vercel CLI

Nếu bạn chưa cài đặt Vercel CLI, hãy chạy lệnh sau:

```bash
npm install -g vercel
```

### Đăng nhập vào Vercel

```bash
vercel login
```

### Deploy dự án

Đi tới thư mục docs và thực hiện deploy:

```bash
cd orbit/docs
vercel
```

Làm theo hướng dẫn trên màn hình để cấu hình dự án. Trong quá trình cấu hình:
- Khi được hỏi "Set up and deploy?", chọn `Y`
- Khi được hỏi "Which scope do you want to deploy to?", chọn scope phù hợp
- Khi được hỏi "Found project "orbit-docs". Link to it?", chọn `Y` nếu đây là lần deploy tiếp theo
- Khi được hỏi các câu hỏi về cấu hình, sử dụng các giá trị:
  - Build Command: `npm run docs:build`
  - Output Directory: `.vitepress/dist`
  - Install Command: `npm install`

## Cấu hình Domain (Tùy chọn)

Sau khi deploy thành công, bạn có thể cấu hình domain tùy chỉnh:

1. Truy cập Dashboard của Vercel
2. Chọn dự án vừa deploy
3. Vào tab "Settings"
4. Chọn "Domains"
5. Thêm domain mong muốn và làm theo hướng dẫn

## Thiết lập Auto-Deploy (Đã được cấu hình)

Dự án sẽ tự động build và deploy mỗi khi bạn push code mới lên repository vì đã có file `vercel.json`.

## Troubleshooting

Nếu gặp lỗi trong quá trình deploy:

1. Kiểm tra lại các script trong `package.json`
2. Đảm bảo rằng `vercel.json` được cấu hình đúng
3. Kiểm tra log build trong Vercel Dashboard để xác định lỗi cụ thể

## Liên kết hữu ích

- [Tài liệu Vercel](https://vercel.com/docs)
- [Tài liệu VitePress](https://vitepress.dev/)