import {useCurrentFrame} from "remotion";
import {captions} from "./captions";

// Component phụ đề: tìm câu đang nói ở frame hiện tại rồi vẽ ở 1/3 dưới màn hình.
// Chữ trắng, viền đen, cỡ lớn — đọc được trên điện thoại, trên mọi nền.
export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const cauDangNoi = captions.find(
    (c) => frame >= c.startFrame && frame < c.endFrame,
  );

  if (!cauDangNoi) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 260,
        display: "flex",
        justifyContent: "center",
        padding: "0 60px",
      }}
    >
      <span
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "white",
          textAlign: "center",
          lineHeight: 1.4,
          textShadow:
            "0 3px 0 #000, 3px 0 0 #000, -3px 0 0 #000, 0 -3px 0 #000, 2px 2px 0 #000, -2px -2px 0 #000",
        }}
      >
        {cauDangNoi.text}
      </span>
    </div>
  );
};
