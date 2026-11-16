# Bước 5 — Xuất: render MP4, ảnh tĩnh, sửa lỗi

Bước cuối: xuất video ra file, kiểm tra rồi mới giao.
Chỉ render khi người dùng nói rõ "render" / "xuất video" / "cho anh file MP4".

## Render MP4 bằng dòng lệnh

```bash
# Render composition mặc định (hỏi tên file nếu có nhiều composition)
npx remotion render

# Chỉ rõ composition và file đích
npx remotion render Shorts out/video-01.mp4

# Truyền dữ liệu vào video (ví dụ đổi tiêu đề mà không sửa code)
npx remotion render Shorts out/video-01.mp4 --props='{"tieuDe": "Sao động cơ 110kW lại đấu tam giác?"}'
```

- Lần render đầu tiên, Remotion tự tải trình duyệt riêng của nó
  (cần mạng, chờ vài phút). Những lần sau dùng lại, không tải nữa.
- **Để Remotion tự lo trình duyệt** — không chỉ đường dẫn browser lạ
  bằng `--browser-executable` trừ khi thật sự cần.
- File xuất ra nên đặt tên rõ ràng: `video-01-ten-chu-de.mp4`,
  bỏ vào thư mục `out/`.

## Xuất ảnh tĩnh (kiểm tra một frame)

Trước khi render cả video, xuất vài frame ra ảnh để xem thử —
nhanh hơn render nhiều:

```bash
# Một frame (frame 90 = giây thứ 3)
npx remotion still Shorts out/frame-90.png --frame=90

# Nhiều frame cùng lúc
npx remotion render Shorts out/frames --frames=0,30,90,150 --image-format=png
```

Mở ảnh lên xem: chữ có tràn không, phụ đề có đọc được không,
sơ đồ có đúng không. Sửa xong mới render video.

## Render trên đám mây — Remotion Lambda (ghi chú)

Nếu máy yếu hoặc cần render nhiều video cùng lúc, Remotion có dịch vụ
render trên đám mây gọi là **Lambda** (chạy trên AWS):

- Cần tài khoản AWS + cài đặt Lambda theo hướng dẫn chính thức của Remotion.
- **Lambda là dịch vụ trả phí theo lượng dùng** (tính theo phút render) —
  không phải miễn phí. Chỉ dùng khi đã tính kỹ chi phí.
- Với kênh của Hoai, render local trên máy là đủ cho Shorts 10–60 giây;
  Lambda chỉ cân nhắc khi cần render hàng loạt (ví dụ 50 video một đợt).

## Kiểm tra sau khi render

1. **Phát thử file MP4** từ đầu tới cuối (ít nhất nghe lướt một lần).
2. **Kiểm tra thông số:** đúng 1080×1920, 30fps, có tiếng.
   ```bash
   ffprobe -v error -select_streams v:0 \
     -show_entries stream=width,height,r_frame_rate,codec_name \
     -of default=noprint_wrappers=1 out/video-01.mp4
   ```
3. **Kiểm tra dung lượng:** Shorts 30 giây thường 5–20 MB.
   Nếu to bất thường (>100 MB) thì xem lại bitrate/codec.
4. **Kiểm tra 3 điểm dễ lỗi:** frame đầu (không đen),
   chỗ chuyển cảnh (có mờ dần không), frame cuối (không cắt ngang câu).

## Lỗi hay gặp khi render (và cách sửa)

| Lỗi / hiện tượng | Nguyên nhân thường gặp | Cách sửa |
|---|---|---|
| `Browser not found` / lỗi tải browser | Chưa tải xong trình duyệt của Remotion | Chạy lại lệnh render, để nó tải hết; kiểm tra mạng |
| `No available ports found` (chỉ gặp trên máy ảo Muse) | NAT của máy ảo trả lời mọi kết nối tới địa chỉ `::` / `0.0.0.0`, nên Remotion tưởng mọi cổng đều bận | Patch một lần sau mỗi `npm install`: mở `node_modules/@remotion/renderer/dist/port-config.js`, trong hàm `getHostsToTry` bỏ hai dòng `'::'` và `'0.0.0.0'` (chỉ giữ `'::1'` và `'127.0.0.1'`), rồi chạy lại lệnh render. Chỉ cần làm trên máy ảo này; máy thường không gặp lỗi này |
| Font Google không tải được trong lúc render (`ERR_CONNECTION_RESET` ở `fonts.gstatic.com`) | Trình duyệt của Remotion không qua được proxy của máy ảo | Dùng font local: tải file `.woff2` về `public/fonts/`, nạp bằng `@font-face` (xem `template/public/fonts.css` và `references/02-tao.md`). Template của skill này đã làm sẵn cách này |
| Video xuất ra toàn màu đen | Tài nguyên không nằm trong `public/` hoặc sai đường dẫn | Chuyển file vào `public/`, gọi bằng `staticFile()` |
| Chữ không chuyển động trong video | Dùng CSS transition/animation | Viết lại bằng `interpolate()` (xem bước 3) |
| Phụ đề lệch giọng | `startFrame` tính sai fps | Tính lại bằng `giây * fps`, xem bước 4 |
| Render chậm bất thường | Composition quá nặng (ảnh 4K, nhiều hiệu ứng) | Giảm kích thước ảnh về 1080×1920, bớt hiệu ứng |
| Lỗi `Out of memory` | Máy hết RAM khi render 1080×1920 | Đóng ứng dụng khác, render từng video một |
| Âm thanh mất tiếng | File audio sai định dạng hoặc sai đường dẫn | Dùng MP3/WAV trong `public/`, kiểm tra lại tên file |
| `TypeError` trong code | Lỗi TypeScript (sai tên prop, thiếu import) | Chạy `npx tsc --noEmit` để xem lỗi rồi sửa |

## Kiểm tra TypeScript trước khi render

```bash
npx tsc --noEmit
```

Không báo lỗi thì code sạch. Có lỗi thì sửa hết rồi mới render —
đừng render khi code còn báo đỏ.

## Checklist trước khi giao file

- [ ] `npx tsc --noEmit` không báo lỗi.
- [ ] Đã xem thử ít nhất 3 frame ảnh tĩnh (đầu, giữa, cuối).
- [ ] File MP4 phát được, đúng 1080×1920, 30fps, có tiếng.
- [ ] Phụ đề khớp giọng, nhạc không lấn giọng.
- [ ] Tên file rõ ràng, đã báo cho người dùng: tên file, thời lượng, dung lượng.
