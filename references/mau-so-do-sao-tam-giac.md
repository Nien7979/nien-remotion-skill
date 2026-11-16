# Ví dụ: Sơ đồ sao – tam giác chuyển động từng bước

Ví dụ này dựng cảnh sơ đồ khởi động sao – tam giác (Y-Δ)
cho kênh **Đam Mê Điện Hay** — sơ đồ vẽ bằng SVG, mỗi bước hiện dần
đúng nhịp giọng đọc. Dùng làm mẫu cho mọi video sơ đồ điện khác.

## Kịch bản (15 giây, 30fps = 450 frame)

| Giây | Frame | Lời thoại | Hình trên màn hình |
|---|---|---|---|
| 0–3 | 0–90 | "Động cơ 3 pha khởi động sao, rồi chuyển sang tam giác." | Tiêu đề + sơ đồ mờ (toàn bộ dây xám) |
| 3–6 | 90–180 | "Lúc đầu, contactor sao đóng — động cơ chạy sao, dòng nhỏ." | Contactor sao (K1) đóng lại, 3 dây sao sáng vàng |
| 6–9 | 180–270 | "Động cơ đủ tốc độ, contactor sao mở ra." | K1 mở ra, dây sao tối lại |
| 9–12 | 270–360 | "Contactor tam giác đóng — động cơ chạy đủ tải." | Contactor tam giác (K2) đóng, 3 dây tam giác sáng vàng |
| 12–15 | 360–450 | "Sao để khởi động êm, tam giác để chạy đủ công suất." | Toàn sơ đồ sáng, dòng chữ kết luận |

## Cách vẽ

- **SVG** cho toàn bộ sơ đồ: đường dây là `<line>`, contactor là
  hình chữ nhật nhỏ có khe hở (mở) hoặc khép lại (đóng),
  động cơ là hình tròn có chữ "M" ở giữa.
- **Mỗi bước là một `<Sequence>`** riêng, `from` đúng frame bắt đầu
  của bước đó. Bước nào chưa tới thì chưa vẽ (opacity 0).
- **Dây có điện** đổi màu xám → vàng (`#facc15`), chuyển màu trong
  0.5 giây bằng `interpolate()`.
- **Contactor đóng/mở:** hai nửa tiếp điểm dịch lại gần nhau
  (đóng) hoặc tách ra (mở) — dịch chuyển 12px trong 0.4 giây.

## Code mẫu (rút gọn — chỉ vẽ 1 dây sao + 1 contactor)

```tsx
import {interpolate, useCurrentFrame, useVideoConfig} from "remotion";

// Dây dẫn: xám khi chưa có điện, vàng khi có điện
const DayDan = ({batDau, ketThuc, x1, y1, x2, y2}: {
  batDau: number; ketThuc: number;
  x1: number; y1: number; x2: number; y2: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sang = interpolate(
    frame,
    [batDau * fps, (batDau + 0.5) * fps],
    [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  const mau = sang > 0.5 ? "#facc15" : "#94a3b8";
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={mau} strokeWidth={6} strokeLinecap="round"
      opacity={0.35 + 0.65 * sang}
    />
  );
};

// Contactor: hai tiếp điểm khép lại khi đóng
const Contactor = ({dongLuc, x, y}: {dongLuc: number; x: number; y: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // khe hở từ 14px (mở) về 0px (đóng) trong 0.4 giây
  const kheHo = interpolate(
    frame,
    [dongLuc * fps, (dongLuc + 0.4) * fps],
    [14, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  return (
    <g transform={`translate(${x}, ${y})`}>
      <line x1={-20} y1={-kheHo / 2} x2={20} y2={-kheHo / 2} stroke="#e2e8f0" strokeWidth={6} />
      <line x1={-20} y1={kheHo / 2} x2={20} y2={kheHo / 2} stroke="#e2e8f0" strokeWidth={6} />
      <text y={48} textAnchor="middle" fill="#e2e8f0" fontSize={36}>K1</text>
    </g>
  );
};
```

Ghép vào composition 1080×1920: đặt `<svg width={1080} height={1300}>`
ở vùng giữa màn hình, phụ đề ở 1/3 dưới (xem bước 4).

## Quy tắc cho mọi sơ đồ điện động

1. **Một bước chỉ đổi một thứ.** Người xem theo kịp từng thao tác.
2. **Đổi đúng nhịp lời thoại.** Bước đổi lúc giọng đọc vừa nhắc tới nó,
   không sớm hơn 0.3 giây.
3. **Màu có nghĩa, dùng nhất quán:** vàng = có điện, xám = chưa có điện,
   đỏ = cảnh báo/nguy hiểm, xanh lá = chạy bình thường.
4. **Chữ ghi chú ngắn** (≤ 5 từ), đặt sát phần tử nó chú thích.
5. **Không vẽ chi tiết thừa** — chỉ vẽ phần cần nói trong video này.
   Sơ đồ đầy đủ để trong tài liệu, không nhồi hết vào video.
6. **An toàn điện:** video sơ đồ là minh họa bằng code, không phải
   hướng dẫn đấu điện thật. Nếu video hướng dẫn thao tác thật thì
   luôn nhắc: cắt điện, khóa nguồn, có người giám sát.
