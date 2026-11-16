# Bước 1 — Hướng dẫn: cài đặt và xem trước

Bước này chuẩn bị máy và mở Studio để xem video trước khi làm gì khác.
Chưa xem được thì chưa viết code.

## Cần có gì

- **Node.js 18 trở lên** (khuyên dùng Node 20 hoặc 22). Kiểm tra:
  ```bash
  node --version   # ví dụ: v22.14.0
  npm --version
  ```
- **npm** (đi kèm Node) hoặc `bun` / `pnpm` nếu đã quen.
- **Trình duyệt Chrome** trên máy để mở Studio (Studio chạy trên web).
- **Git** (tùy chọn, để lưu version).

## Tạo project mới

### Cách nhanh nhất: dùng mẫu của skill này

```bash
cp -r nien-remotion-skill/template my-video
cd my-video
npm install
npx remotion studio
```

### Cách tạo từ đầu (project trắng)

```bash
npx create-video@latest --yes --blank --no-tailwind my-video
cd my-video
npm install
```

Lệnh này tạo sẵn cấu trúc Remotion chuẩn: `package.json`,
`remotion.config.ts`, thư mục `src/` với file đăng ký composition.

> Nếu thư mục hiện tại đã có file (ví dụ đã có `.git`),
> tạo vào thư mục con tên khác, đừng tạo đè lên thư mục đang có nội dung.

## Mở Studio xem trước

```bash
npx remotion studio
```

- Studio mở ở `http://localhost:3000` (cổng có thể khác, xem dòng in ra).
- Bên trái là danh sách composition, giữa là khung xem trước,
  dưới là timeline kéo thả xem từng frame.
- **Giữ Studio chạy suốt lúc làm việc** — sửa code là thấy đổi ngay,
  không cần render thử.

Nếu dùng Claude Code / Codex có trình duyệt tích hợp:
mở đúng URL Studio in ra; nếu Studio không mở tự động thì chạy
`npx remotion studio --no-open` rồi mở URL bằng tay.

## Cấu trúc một project Remotion

```
my-video/
├── package.json          Khai báo thư viện (remotion, react…)
├── remotion.config.ts    Cấu hình chung (mặc định đã đủ dùng)
├── public/               Ảnh, nhạc, giọng đọc — gọi bằng staticFile()
└── src/
    ├── RemotionRoot.tsx  Đăng ký composition (tên, kích thước, fps…)
    └── Shorts.tsx        Code của từng cảnh
```

## Kiểm tra cài đặt xong chưa

Chạy lần lượt, cả 3 đều phải không báo lỗi:

```bash
node --version
npx remotion --version
npx remotion studio        # mở được trang Studio là đạt
```

## Lỗi hay gặp ở bước này

| Lỗi | Cách sửa |
|---|---|
| `create-video` báo thư mục không trống | Xóa file rác trong thư mục, hoặc tạo project vào thư mục con mới |
| `npm install` lỗi mạng | Kiểm tra mạng/proxy, chạy lại `npm install` |
| Studio mở ra trắng trơn | Xem log terminal, thường do lỗi cú pháp trong `src/` — sửa rồi tải lại trang |
| Cổng 3000 đã có người dùng | Studio tự đổi cổng khác, mở đúng URL nó in ra |
