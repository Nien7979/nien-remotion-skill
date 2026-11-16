# Template — Project Remotion mẫu (chạy được ngay)

Project tối giản để thử skill **Niên Remotion Skill**:
một video dọc 9:16 dài 15 giây — tiêu đề động, 3 cảnh nối bằng dissolve,
phụ đề tiếng Việt chạy suốt video.

## Chạy thử

```bash
npm install
npx remotion studio    # mở xem trước trên trình duyệt
npx remotion render Shorts out/video-mau.mp4   # xuất MP4
```

## Có gì trong này

- `src/RemotionRoot.tsx` — đăng ký composition `Shorts`
  (1080×1920, 30fps, 15 giây).
- `src/Shorts.tsx` — 3 cảnh: mở đầu (tiêu đề spring) → nội dung →
  kết (lời kêu gọi), nền gradient zoom chậm, chuyển cảnh mờ dần 1 giây.
- `src/Subtitles.tsx` — component phụ đề: chữ trắng viền đen,
  ở 1/3 dưới màn hình.
- `src/captions.ts` — dữ liệu phụ đề mẫu (4 câu tiếng Việt).
- Font **Be Vietnam Pro** (Google Fonts, có subset tiếng Việt).
- `out/` — video mẫu đã render sẵn để xem thử:
  `video-mau-15s.mp4` (15 giây, 1080×1920, 30fps) và 2 ảnh frame mẫu.
  Render lại sau khi sửa code thì file mới sẽ ghi đè lên.

## Đổi nội dung thành video của mình

1. Sửa chữ trong `src/Shorts.tsx` (tiêu đề, câu chuyện, câu kết).
2. Sửa phụ đề trong `src/captions.ts` (khớp với giọng đọc của mình).
3. Muốn thêm ảnh/nhạc/giọng đọc: bỏ file vào `public/`,
   gọi bằng `staticFile("ten-file.mp3")` (xem `references/04-sua.md`).
4. Mở Studio xem thử, rồi render khi ưng ý.

Giấy phép: MIT — Lê Hữu Niên (Hoai).
