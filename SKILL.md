---
name: nien-remotion-shorts
description: Làm video dọc 9:16 bằng Remotion (React) theo chuẩn kênh của Hoai — từ hướng dẫn, tạo cảnh, chuyển động, sửa phụ đề/âm thanh tới xuất MP4. Dùng khi cần dựng Shorts, sơ đồ điện chuyển động bằng code, hoặc xuất video từ kịch bản có sẵn.
---

# Niên Remotion Shorts — Skill làm video dọc bằng code

Skill này hướng dẫn AI (Claude Code, Codex, Cursor…) dựng video dọc
**1080×1920, 30fps** bằng Remotion — video viết bằng React/TypeScript,
chạy bằng code nên sửa chữ, sửa nhịp, đổi cảnh chỉ cần sửa code rồi render lại.
Chuẩn này phục vụ hai kênh của Hoai: **Đam Mê Điện Hay** (điện) và
**Một Phút Hiểu Nhau** (tâm lý, đời sống).

> Nguyên tắc vàng: **xem trước trong Studio rồi mới render**.
> Chỉ render MP4 khi người dùng nói rõ "render", "xuất video" hoặc "cho anh file MP4".

## Khi nào dùng skill này

- Người dùng muốn làm Shorts/video dọc mới, hoặc sửa một video Remotion có sẵn.
- Cần vẽ sơ đồ (ví dụ: sơ đồ sao – tam giác) chuyển động từng bước bằng code.
- Cần gắn phụ đề tiếng Việt, lồng tiếng, nhạc nền rồi xuất file.
- Cần kiểm tra một frame bất kỳ (xuất ảnh tĩnh) trước khi render cả video.

Không dùng skill này cho: cắt ghép video quay sẵn bằng ffmpeg
(dùng Niên Tool / video-toolbox), hoặc tạo video bằng AI (Flow/Veo).

## Quy trình 5 bước — Hướng dẫn → Tạo → Di chuyển → Sửa → Xuất

Mọi video làm theo đúng 5 bước này, theo thứ tự:

| # | Bước | Việc chính | Tài liệu chi tiết |
|---|------|-----------|-------------------|
| 1 | **Hướng dẫn** | Cài đặt, mở Studio xem trước | `references/01-huong-dan.md` |
| 2 | **Tạo** | Dựng composition 9:16, bố cục, chữ, hình | `references/02-tao.md` |
| 3 | **Di chuyển** | Chuyển động: hiện chữ, zoom, chuyển cảnh, sơ đồ động | `references/03-di-chuyen.md` |
| 4 | **Sửa** | Phụ đề, giọng đọc, nhạc nền, cắt cảnh | `references/04-sua.md` |
| 5 | **Xuất** | Render MP4, xuất ảnh tĩnh, kiểm tra lỗi | `references/05-xuat.md` |

Đọc tài liệu của bước đang làm trước khi viết code cho bước đó.

## Chuẩn kênh (bắt buộc cho mọi video)

- **Khung hình:** 1080×1920 (dọc 9:16), **30fps**.
- **Phụ đề:** chữ trắng, viền đen, cỡ lớn đọc được trên điện thoại,
  đặt ở **1/3 dưới màn hình**, mỗi dòng không quá 8–10 từ,
  hiện đúng nhịp với giọng đọc.
- **Nhịp kể:** chậm, ấm. Chữ hiện dần, không nhấp nháy, không bay loạn.
- **Chuyển cảnh:** mờ dần (dissolve) khoảng 1 giây, không cắt khô.
- **Chuyển động nền:** zoom chậm, lia nhẹ (pan) — không rung, không xoay nhanh.
- **Âm thanh:** giọng đọc là chính; nhạc nền nhỏ hơn giọng khoảng 19dB,
  nhạc nhẹ, không lời, không lấn giọng.
- **Màu sắc:** tươi sáng, thực tế. Không dùng nhân vật hoạt hình méo mó.
- **Thời lượng Shorts:** 10–60 giây, mỗi cảnh 3–8 giây.

## Luật viết code Remotion (nhớ kỹ)

1. **Mọi chuyển động đều tính từ frame.** Lấy frame hiện tại bằng
   `useCurrentFrame()`, lấy fps bằng `useVideoConfig()`.
   Đổi giây sang frame bằng công thức `giây * fps` — không hard-code số frame.
2. **Không dùng CSS transition/animation** — trình render không chạy chúng.
   Mọi chuyển động phải dùng `interpolate()` hoặc `spring()`.
3. **Giữ `useCurrentFrame()` trong component nhỏ nhất cần nó.**
   Tách riêng component chữ, component phụ đề, component nhạc nền —
   đừng để cả composition re-render mỗi frame.
4. **Tính thời gian bằng giây rồi nhân fps** ngay trong JSX
   (ví dụ `from={2 * fps}`), để đổi fps không sai nhịp.
5. **Tài nguyên để trong `public/`, gọi bằng `staticFile()`.**
   Font chữ: dùng Google Fonts (xem `references/02-tao.md`).
6. **Không ghi đè thay đổi của người dùng.** Nếu thấy code đã bị sửa khác
   với lần trước, hỏi trước khi viết đè.
7. **Đừng render khi chưa xem trước.** Mở Studio, xem thử vài frame,
   rồi mới render.

## Ví dụ nhanh — tiêu đề hiện dần + phụ đề

```tsx
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

export const TieuDe = ({text}: {text: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Hiện dần trong 0.8 giây, giữ nguyên sau đó
  const opacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Trượt nhẹ từ dưới lên 40px
  const translateY = interpolate(frame, [0, 0.8 * fps], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        translate: `0px ${translateY}px`,
      }}
    >
      <h1 style={{fontSize: 96, color: "white", textAlign: "center"}}>
        {text}
      </h1>
    </AbsoluteFill>
  );
};
```

Phụ đề theo giọng đọc (dữ liệu mẫu xem `template/src/captions.ts`):

```tsx
// Tìm câu phụ đề đang nói ở frame hiện tại
const cauDangNoi = captions.find(
  (c) => frame >= c.startFrame && frame < c.endFrame,
);
```

## Ví dụ theo kênh

**Video điện — sơ đồ sao–tam giác chuyển động từng bước:**
xem `references/mau-so-do-sao-tam-giac.md`. Sơ đồ vẽ bằng SVG,
mỗi bước (đóng contactor sao → chạy sao → chuyển tam giác) hiện dần
đúng nhịp giọng đọc, dây dẫn đổi màu khi có điện.

**Video tâm lý — kể chuyện 30 giây:**
3 cảnh nối bằng dissolve 1 giây. Cảnh 1: tiêu đề + câu mở.
Cảnh 2: hình minh họa zoom chậm + phụ đề theo giọng đọc.
Cảnh 3: câu kết + lời kêu gọi. Nhạc nền nhẹ suốt video.

## Quy trình làm việc với người dùng

1. Hỏi (hoặc đọc) kịch bản: chủ đề, số cảnh, giọng đọc có sẵn chưa.
2. Mở Studio xem trước ngay khi project chạy được.
3. Làm từng cảnh một, cho người dùng xem thử từng cảnh.
4. Gắn phụ đề + âm thanh, xem lại toàn bộ.
5. Chỉ render MP4 khi người dùng đồng ý. Xuất xong báo tên file,
   thời lượng, dung lượng — và mở thử vài frame kiểm tra.

## Kiểm tra trước khi giao (checklist)

- [ ] Video đúng 1080×1920, 30fps, không bị méo khung.
- [ ] Chữ đủ lớn, không tràn viền, không bị cắt trên điện thoại.
- [ ] Phụ đề khớp giọng đọc (sai lệch dưới 0.2 giây).
- [ ] Chuyển cảnh mờ dần ~1 giây, không cắt khô.
- [ ] Nhạc nền không lấn giọng đọc.
- [ ] Không có frame đen, frame trắng bất ngờ giữa video.
- [ ] File MP4 phát được, đúng thời lượng kịch bản.
- [ ] Tên file rõ ràng: `video-XXX-ten-chu-de.mp4`.

## Lỗi thường gặp (xem chi tiết ở `references/05-xuat.md`)

| Hiện tượng | Nguyên nhân thường gặp | Cách sửa |
|---|---|---|
| Chữ không chuyển động | Dùng CSS transition/animation | Viết lại bằng `interpolate()` |
| Phụ đề lệch giọng | Tính frame sai fps | Dùng `giây * fps`, kiểm tra lại `startFrame` |
| Video đen khi render | Tài nguyên không nằm trong `public/` | Chuyển file vào `public/`, gọi bằng `staticFile()` |
| Render báo thiếu trình duyệt | Remotion chưa tải browser | Để Remotion tự tải, không chỉ đường dẫn browser lạ |
| Chữ bị cắt ở mép | Chữ quá lớn hoặc không có padding | Giảm cỡ chữ, thêm padding 60–80px hai bên |

## Cài đặt nhanh (xem `references/01-huong-dan.md`)

```bash
# Tạo project mới từ mẫu có sẵn trong skill này
npx create-video@latest --yes --blank --no-tailwind my-video
cd my-video
npm install
npx remotion studio        # xem trước
npx remotion render        # xuất MP4 (chỉ khi người dùng yêu cầu)
```

Hoặc dùng thẳng mẫu trong `template/` của skill này
(đã có sẵn composition 9:16 + tiêu đề động + phụ đề mẫu).
