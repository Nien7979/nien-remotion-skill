# Bước 4 — Sửa: phụ đề, giọng đọc, nhạc nền

Bước này "thổi hồn" vào video: chữ phụ đề chạy đúng nhịp giọng đọc,
giọng đọc rõ, nhạc nền nhẹ không lấn giọng.

## Phụ đề tiếng Việt (burned-in)

Phụ đề **cháy thẳng vào video** (không phải file .srt rời):
người xem mở video là thấy chữ ngay, không cần bật phụ đề.

### Dữ liệu phụ đề

Một mảng các câu, mỗi câu có thời gian bắt đầu/kết thúc (tính bằng frame):

```ts
// captions.ts
export type CauPhuDe = {
  text: string;
  startFrame: number;   // frame bắt đầu
  endFrame: number;     // frame kết thúc
};

const fps = 30;
export const captions: CauPhuDe[] = [
  {text: "Ngày đầu đi làm, tôi định nghỉ ngay buổi sáng.", startFrame: 0 * fps, endFrame: 4 * fps},
  {text: "Nhưng rồi một câu nói đã giữ tôi ở lại.", startFrame: 4 * fps, endFrame: 8 * fps},
];
```

Quy tắc chia câu:

- **Mỗi câu 8–10 từ**, tối đa 2 dòng trên màn hình.
- Chia câu theo **hơi thở của giọng đọc** (chỗ người đọc ngừng thì ngắt câu),
  không chia theo dấu chấm máy móc.
- Câu hiện đúng lúc giọng đọc bắt đầu nói câu đó
  (sai lệch cho phép dưới 0.2 giây ≈ 6 frame).

### Hiển thị phụ đề

```tsx
import {useCurrentFrame} from "remotion";
import {captions} from "./captions";

const frame = useCurrentFrame();
const cauDangNoi = captions.find(
  (c) => frame >= c.startFrame && frame < c.endFrame,
);
// Vẽ cauDangNoi?.text ở 1/3 dưới màn hình, chữ trắng viền đen
```

Kiểu chữ phụ đề chuẩn kênh:

```tsx
{
  fontSize: 54,
  fontWeight: 700,
  color: "white",
  textAlign: "center",
  // Viền đen quanh chữ để đọc được trên mọi nền
  textShadow: "0 2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 -2px 0 #000",
  padding: "0 60px",
}
```

> Xem component hoàn chỉnh trong `template/src/Subtitles.tsx`.

### Lấy thời gian phụ đề từ đâu

- **Cách chính xác nhất:** file giọng đọc đã có sẵn thì đo bằng tai
  (nghe và ghi thời gian từng câu) hoặc dùng công cụ nhận dạng giọng nói
  (Whisper) để lấy timestamp rồi sửa lại bằng tay.
- **Cách nhanh:** ước lượng 3 từ/giây với giọng kể chậm, rồi xem lại
  trong Studio và chỉnh từng câu lệch.
- **Không đoán mò rồi render luôn** — phụ đề lệch giọng là lỗi lộ nhất
  của video.

## Giọng đọc (voiceover)

- File giọng đọc (`.mp3` / `.wav`) bỏ vào `public/`, gọi bằng
  `<Audio src={staticFile("giong-doc.mp3")} />` từ `@remotion/media`.
- Giọng đọc là **âm thanh chính** — để âm lượng 1 (mặc định).
- Giọng kể chậm, ấm; tốc độ khoảng 150–170 từ/phút cho video tâm lý,
  130–150 từ/phút cho video kỹ thuật (người xem cần thời gian hiểu sơ đồ).
- Nếu giọng đọc dài hơn cảnh: kéo dài cảnh theo giọng, không cắt giọng.
- Nếu giọng đọc ngắn hơn cảnh: để cảnh trống thêm 0.5–1 giây cuối
  (người xem kịp đọc hết phụ đề).

## Nhạc nền

- Nhạc nhẹ, **không lời**, bỏ vào `public/`, phát bằng `<Audio>` riêng.
- **Âm lượng nhạc ≈ 0.08–0.12** (giọng đọc để 1) — tức nhỏ hơn giọng
  khoảng 19dB, nghe thoang thoảng, không lấn giọng.
- Nhạc bắt đầu cùng video, kết thúc cùng video; không để nhạc dừng
  đột ngột giữa chừng.
- Nhạc phải **không bản quyền** hoặc có giấy phép dùng (nhạc CC0,
  nhạc thư viện miễn phí). Ghi nguồn nhạc vào phần mô tả khi đăng video.

```tsx
import {Audio, staticFile} from "@remotion/media";

// Giọng đọc: âm lượng mặc định (1)
<Audio src={staticFile("giong-doc.mp3")} />
// Nhạc nền: nhỏ, lặp lại nếu ngắn hơn video
<Audio src={staticFile("nhac-nen.mp3")} volume={0.1} loop />
```

## Cắt cảnh theo nhịp (multi-scene)

- Mỗi cảnh 3–8 giây, nối bằng dissolve 1 giây (xem bước 3).
- Cảnh đổi đúng lúc ý trong kịch bản đổi (hết một câu chuyện nhỏ thì đổi cảnh).
- Xem lại toàn bộ trong Studio: nếu thấy cảnh nào dài lê thê thì tách làm đôi,
  cảnh nào thoáng qua thì gộp lại.

## Checklist bước 4

- [ ] Phụ đề khớp giọng đọc (sai lệch < 0.2 giây).
- [ ] Mỗi câu phụ đề ≤ 10 từ, ≤ 2 dòng, không tràn viền.
- [ ] Chữ phụ đề đọc được trên mọi nền (trắng + viền đen).
- [ ] Nhạc nền nhỏ (volume ~0.1), không lấn giọng.
- [ ] Giọng đọc không bị cắt ngang, không bị nhạc đè.
- [ ] Nghe thử toàn bộ trong Studio ít nhất một lần.
