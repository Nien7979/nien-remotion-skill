# Bước 3 — Di chuyển: chuyển động và chuyển cảnh

Bước này cho video "sống": chữ hiện dần, nền zoom chậm,
cảnh nối nhau mờ dần, sơ đồ vẽ từng bước.

## Quy tắc cơ bản: mọi chuyển động tính từ frame

```tsx
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

const frame = useCurrentFrame();   // frame hiện tại: 0, 1, 2, …
const {fps} = useVideoConfig();    // fps của composition (30)
```

- Muốn đổi giây sang frame: `giây * fps`.
- Muốn đổi frame sang giây: `frame / fps`.
- **Không dùng CSS `transition` / `animation`** — trình render không chạy
  chúng, video xuất ra sẽ đứng yên.

## Hiện dần (fade) và trượt nhẹ (slide)

Hai hiệu ứng dùng nhiều nhất. Hiện dần trong 0.8 giây, trượt từ dưới lên:

```tsx
const opacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
const y = interpolate(frame, [0, 0.8 * fps], [40, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

`extrapolateLeft/Right: "clamp"` giữ giá trị không vượt quá khoảng đã cho
(trước 0 thì bằng 0, sau 0.8 giây thì bằng 1) — luôn ghi đủ hai dòng này.

## Nảy nhẹ (spring) cho tiêu đề

Tiêu đề bật lên có đà, rồi dừng êm:

```tsx
const scale = spring({
  frame,
  fps,
  config: {damping: 200},   // damping càng lớn càng ít nảy
});
```

`damping: 200` cho cảm giác chắc, không nảy quá đà.
Muốn chữ to dần từ 0.9 lên 1: `interpolate(scale, [0, 1], [0.9, 1])`.

## Zoom chậm + lia nhẹ (Ken Burns)

Nền ảnh zoom rất chậm trong suốt cảnh — mắt người xem thấy "đang chuyển động"
mà không chóng mặt:

```tsx
// Zoom từ 1.0 lên 1.08 trong 8 giây
const zoom = interpolate(frame, [0, 8 * fps], [1, 1.08], {
  extrapolateRight: "clamp",
});
```

Lia ngang nhẹ (pan): dịch ảnh từ -20px sang +20px trong cùng khoảng thời gian.
**Tốc độ chuẩn kênh: zoom tối đa 8–10% trong một cảnh, lia tối đa 40px.**
Nhanh hơn sẽ gây chóng mặt, nhất là trên điện thoại.

## Chuyển cảnh mờ dần (dissolve ~1 giây)

Cảnh sau đè lên cảnh trước, độ mờ tăng dần trong 1 giây:

```tsx
import {Sequence} from "remotion";

// Cảnh 2 bắt đầu ở giây thứ 8, nhưng mờ dần trong 1 giây đầu
<Sequence from={8 * fps} durationInFrames={12 * fps}>
  <CanhHai opacity={interpolate(frame, [8 * fps, 9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })} />
</Sequence>
```

Thực tế hay làm hơn: dùng `<TransitionSeries>` (gói `@remotion/transitions`)
với hiệu ứng `fade` — xem ví dụ trong template nếu cần.
**Không dùng cắt khô** (nhảy cảnh đột ngột) trừ khi cố tình nhấn mạnh.

## Sơ đồ chuyển động bằng code

Sơ đồ điện vẽ bằng **SVG** (đường thẳng, hình tròn, chữ),
mỗi phần tử hiện dần theo đúng bước trong lời thoại:

1. Vẽ khung sơ đồ (dây, contactor, động cơ) ở trạng thái mờ.
2. Tới bước nào trong lời thoại, phần đó sáng lên / đổi màu
   (ví dụ: dây có điện đổi sang màu vàng, contactor đóng lại).
3. Mũi tên dòng điện chạy dọc dây bằng cách cho một chấm tròn
   di chuyển theo đường dây (`interpolate` theo frame).

Ví dụ đầy đủ: sơ đồ sao – tam giác xem
`references/mau-so-do-sao-tam-giac.md`.

Nguyên tắc vẽ sơ đồ:

- Nét vẽ mỏng (2–3px), rõ ràng; không vẽ chi tiết thừa.
- Chữ ghi chú ngắn, 40–48px, đặt cạnh phần tử nó chú thích.
- Mỗi bước chỉ đổi **một thứ** (một dây sáng lên, một contactor đóng)
  để người xem theo kịp.
- Đồng bộ với giọng đọc: bước đổi đúng lúc lời thoại nhắc tới nó.

## Nhịp chuyển động chuẩn kênh

| Loại | Thời gian | Ghi chú |
|---|---|---|
| Chữ hiện dần | 0.6–0.9 giây | Không nhanh hơn 0.5 giây |
| Chuyển cảnh (dissolve) | ~1 giây | Mờ dần, không cắt khô |
| Zoom nền | Cả cảnh (3–8 giây) | Tối đa 8–10% |
| Sơ đồ đổi bước | Đúng nhịp lời thoại | Mỗi bước đổi một thứ |
| Tiêu đề bật lên | spring, damping 200 | Chắc, không nảy loạn |

## Lỗi hay gặp ở bước này

| Hiện tượng | Nguyên nhân | Cách sửa |
|---|---|---|
| Chữ đứng yên, không hiện dần | Dùng CSS transition/animation | Viết lại bằng `interpolate()` |
| Chuyển động giật, nhảy số | Quên `extrapolate: "clamp"` | Thêm clamp cả hai đầu |
| Zoom quá nhanh, chóng mặt | Khoảng zoom quá lớn / thời gian quá ngắn | Giảm xuống ≤10% trong cả cảnh |
| Cảnh sau đè lên cảnh trước | `from` của Sequence chồng nhau | Tính lại `from` = tổng thời lượng các cảnh trước |
