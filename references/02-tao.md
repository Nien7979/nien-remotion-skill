# Bước 2 — Tạo: dựng composition 9:16

Bước này dựng khung video: kích thước, bố cục, chữ, hình.
Chưa có chuyển động ở đây — chuyển động làm ở bước 3.

## Composition chuẩn Shorts

Đăng ký trong `src/RemotionRoot.tsx`:

```tsx
import {Composition} from "remotion";
import {Shorts} from "./Shorts";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Shorts"
      component={Shorts}
      durationInFrames={30 * 30}   // 30 giây × 30fps
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
```

- `durationInFrames` luôn tính bằng **giây × fps**, không hard-code.
- Một project có thể có nhiều `<Composition>` (mỗi video một cái),
  hoặc một `<Still>` để xuất ảnh thumbnail.

## Bố cục khung dọc

Khung 1080×1920 hẹp và cao. Chia theo chiều dọc:

- **Trên cùng (0–400px):** tiêu đề / câu hỏi mở đầu.
- **Giữa (400–1300px):** hình minh họa hoặc sơ đồ — vùng nhìn chính.
- **Dưới (1300–1920px):** phụ đề (xem bước 4), để trống cho chữ chạy.

Để chữ không bị cắt trên điện thoại: chừa lề **60–80px** mỗi bên,
và đừng đặt chữ sát mép trên/dưới (vùng đó YouTube/ TikTok che mất
một phần bằng nút bấm).

Dùng `<AbsoluteFill>` làm nền cho mỗi cảnh:

```tsx
import {AbsoluteFill} from "remotion";

<AbsoluteFill style={{backgroundColor: "#0f172a"}}>
  {/* nội dung cảnh */}
</AbsoluteFill>
```

## Chữ (typography)

- **Tiêu đề:** 88–110px, đậm (bold), trắng, căn giữa.
- **Chữ nội dung:** 54–64px, trắng hoặc vàng nhạt.
- **Phụ đề:** 52–58px, trắng, viền đen (xem bước 4).
- **Tối đa 3–4 dòng chữ trên một màn hình**, mỗi dòng 8–10 từ.
- **Font:** có hai cách. **Cách dễ (máy thường):** dùng Google Fonts,
  load bằng `loadFont()` của Remotion — xem ví dụ trong file gốc của
  skill này. **Cách chắc (máy ảo / không có mạng):** tải file `.woff2`
  về bỏ vào `public/fonts/`, nạp bằng `@font-face` trong file CSS
  rồi gắn bằng thẻ `<link>` tới file CSS đó (xem `template/public/fonts.css`
  và cách gắn trong `template/src/Shorts.tsx`).
  Lưu ý: đừng `import` file CSS chứa `@font-face` trực tiếp vào code —
  webpack sẽ cố resolve đường dẫn font và báo lỗi.
  Font chữ Việt tốt: **Be Vietnam Pro** (hiện đại, đọc rõ),
  **Inter** (sạch), **Noto Sans** (an toàn).

## Hình ảnh và video

- File bỏ vào `public/`, gọi bằng `staticFile("ten-file.png")`.
- Ảnh dùng `<Img>` (hoặc `<CanvasImage>` nếu cần hiệu ứng),
  video dùng `<Video>` từ `@remotion/media`.
- Ảnh minh họa nên là ảnh thật, màu tươi sáng; không dùng ảnh méo,
  không dùng nhân vật hoạt hình sai tỷ lệ.
- Ảnh dọc 1080×1920 là vừa khung; ảnh ngang thì cắt hoặc làm mờ nền.

```tsx
import {Img, staticFile} from "remotion";

<Img
  src={staticFile("hinh-minh-hoa.jpg")}
  style={{width: 1080, height: 1920, objectFit: "cover"}}
/>
```

## Màu nền gợi ý

- Video điện: nền xanh đậm `#0f172a`, chữ trắng, điểm nhấn vàng `#facc15`
  (màu dây điện, màu cảnh báo).
- Video tâm lý: nền ấm `#1e293b` hoặc ảnh thật làm mờ, chữ trắng,
  điểm nhấn hồng/đỏ nhẹ `#fb7185`.
- Luôn đảm bảo chữ nổi trên nền: chữ trắng + viền đen, hoặc nền tối
  sau lớp chữ (xem ví dụ trong `template/src/Shorts.tsx`).

## Nhiều cảnh trong một video

Dùng `<Sequence>` để xếp cảnh nối tiếp, mỗi cảnh có `from` và
`durationInFrames` riêng:

```tsx
import {Sequence} from "remotion";

<Sequence from={0} durationInFrames={8 * fps} name="Cảnh 1 — Mở đầu">
  <CanhMoDau />
</Sequence>
<Sequence from={8 * fps} durationInFrames={12 * fps} name="Cảnh 2 — Nội dung">
  <CanhNoiDung />
</Sequence>
```

Đặt `name` cho từng `<Sequence>` để dễ tìm trên timeline của Studio.
Chuyển cảnh mờ dần làm ở bước 3.

## Checklist bước 2

- [ ] Composition đúng 1080×1920, 30fps.
- [ ] Chữ đủ lớn, có lề, không tràn khung.
- [ ] Font đã load đúng subset tiếng Việt (không bị lỗi dấu).
- [ ] Hình nằm trong `public/`, gọi bằng `staticFile()`.
- [ ] Mở Studio xem thử: bố cục nhìn rõ, chữ đọc được.
