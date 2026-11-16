# Niên Remotion Skill — Làm video dọc 9:16 bằng code

Skill này giúp AI (Claude Code, Codex, Cursor…) dựng video dọc
**1080×1920, 30fps** bằng [Remotion](https://www.remotion.dev/)
— viết video bằng React/TypeScript, sửa chữ sửa nhịp chỉ cần sửa code.

Làm ra cho hai kênh YouTube của Lê Hữu Niên (Hoai):

- **Đam Mê Điện Hay** — video điện: sơ đồ sao–tam giác, tủ điện, mẹo nghề.
- **Một Phút Hiểu Nhau** — video tâm lý, đời sống: kể chuyện ngắn, bài học nhỏ.

> Đây là skill **viết mới hoàn toàn** (code và nội dung là của Hoai,
> giấy phép MIT — xem file `LICENSE`). Nó học hỏi ý tưởng tổ chức
> từ skill chính thức của Remotion, nhưng không copy nội dung của họ,
> đồng thời bổ sung những thứ bản gốc không có: chuẩn Shorts 9:16,
> phụ đề tiếng Việt, sơ đồ điện chuyển động, nhạc nền, và quy trình
> 5 bước **Hướng dẫn → Tạo → Di chuyển → Sửa → Xuất**.

## Cài đặt

### Cách 1 — Dùng với Claude Code / Codex (khuyên dùng)

Copy thư mục này vào thư mục skill của AI:

```bash
# Claude Code
cp -r nien-remotion-skill ~/.claude/skills/nien-remotion-shorts

# Codex
cp -r nien-remotion-skill ~/.codex/skills/nien-remotion-shorts
```

Sau đó trong Claude Code / Codex, chỉ cần nói:

> "Làm video Shorts bằng Niên Remotion Skill: …"

### Cách 2 — Dùng mẫu project có sẵn

Thư mục `template/` là một project Remotion tối giản, chạy được ngay:

```bash
cd template
npm install
npx remotion studio    # mở xem trước trên trình duyệt
npx remotion render    # xuất MP4 (chỉ khi cần)
```

Yêu cầu: Node.js 18 trở lên, npm. Lần render đầu tiên Remotion
sẽ tự tải trình duyệt riêng của nó (cần mạng).

## Cấu trúc thư mục

```
nien-remotion-skill/
├── LICENSE                 Giấy phép MIT — tác giả Lê Hữu Niên (Hoai)
├── README.md               File này
├── SKILL.md                Skill chính (AI đọc file này trước)
├── references/             Tài liệu chi tiết từng bước
│   ├── 01-huong-dan.md     Bước 1 — Hướng dẫn: cài đặt, mở Studio
│   ├── 02-tao.md           Bước 2 — Tạo: composition 9:16, bố cục, chữ
│   ├── 03-di-chuyen.md     Bước 3 — Di chuyển: hiệu ứng, chuyển cảnh
│   ├── 04-sua.md           Bước 4 — Sửa: phụ đề, giọng đọc, nhạc nền
│   ├── 05-xuat.md          Bước 5 — Xuất: render, ảnh tĩnh, lỗi hay gặp
│   └── mau-so-do-sao-tam-giac.md   Ví dụ: sơ đồ sao–tam giác động
└── template/               Project mẫu chạy được ngay
    ├── package.json
    ├── tsconfig.json
    ├── remotion.config.ts
    └── src/
        ├── RemotionRoot.tsx   Đăng ký composition
        ├── Shorts.tsx         Cảnh mẫu: tiêu đề động + phụ đề
        ├── Subtitles.tsx      Component phụ đề
        └── captions.ts        Dữ liệu phụ đề mẫu (tiếng Việt)
```

## Quy trình 5 bước

Mọi video làm theo đúng thứ tự:

1. **Hướng dẫn** — Cài đặt, mở Studio xem trước.
2. **Tạo** — Dựng composition 1080×1920, bố cục, chữ, hình.
3. **Di chuyển** — Chữ hiện dần, zoom chậm, chuyển cảnh mờ dần, sơ đồ động.
4. **Sửa** — Gắn phụ đề tiếng Việt, giọng đọc, nhạc nền nhỏ hơn giọng ~19dB.
5. **Xuất** — Render MP4, kiểm tra frame, giao file.

Chi tiết từng bước xem trong `SKILL.md` và `references/`.

## Chuẩn kênh (áp cho mọi video)

- Khung hình **1080×1920, 30fps**; Shorts dài 10–60 giây.
- Phụ đề chữ trắng viền đen, cỡ lớn, ở 1/3 dưới màn hình.
- Nhịp kể chậm, ấm; chuyển cảnh mờ dần ~1 giây.
- Nền zoom chậm, lia nhẹ; không rung, không xoay nhanh.
- Nhạc nền nhẹ, không lời, không lấn giọng đọc.

## Giấy phép

MIT — xem file `LICENSE`. Tác giả: **Lê Hữu Niên (Hoai)**.
Dùng tự do cho video của mình; giữ lại dòng tác giả khi chia sẻ.
