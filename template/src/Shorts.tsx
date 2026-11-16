import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Subtitles} from "./Subtitles";
import {staticFile} from "remotion";

// Font Be Vietnam Pro — file font nằm sẵn trong public/fonts/,
// nạp bằng thẻ <link> tới public/fonts.css nên render được cả khi không có mạng.
// (Không import CSS trực tiếp: webpack sẽ cố resolve đường dẫn font và lỗi.)
const fontFamily = "'Be Vietnam Pro', sans-serif";

// Nền gradient zoom rất chậm trong suốt video (tối đa ~8%)
// để khung hình "sống" mà không gây chóng mặt.
const NenZoom: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });
  void fps;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 35%, #1e3a5f 0%, #0f172a 70%)",
        scale: zoom,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Hiện dần trong 0.8 giây + trượt nhẹ từ dưới lên 40px
const HienDan: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [0, 0.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 0.8 * fps], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity,
        translate: `0px ${y}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

// Cảnh 1 (0–5s): tiêu đề bật lên bằng spring, kèm câu mở đầu
const CanhMoDau: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame, fps, config: {damping: 200}});
  const tieuDeScale = interpolate(scale, [0, 1], [0.9, 1]);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
        scale: tieuDeScale,
      }}
    >
      <HienDan>
        <div style={{fontSize: 100, fontWeight: 900, color: "white", textAlign: "center", lineHeight: 1.2}}>
          Một Phút
          <br />
          Hiểu Nhau
        </div>
        <div style={{fontSize: 52, color: "#facc15", marginTop: 40, textAlign: "center"}}>
          Câu chuyện nhỏ, tình lớn
        </div>
      </HienDan>
    </AbsoluteFill>
  );
};

// Cảnh 2 (4–10s): câu chuyện — chữ lớn ở giữa, nền zoom chậm
const CanhNoiDung: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Mờ dần trong 1 giây đầu của cảnh (dissolve từ cảnh 1 sang)
  const opacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{justifyContent: "center", alignItems: "center", fontFamily, opacity}}
    >
      <HienDan>
        <div style={{fontSize: 72, fontWeight: 700, color: "white", textAlign: "center", lineHeight: 1.35, padding: "0 80px"}}>
          Có những câu nói nhỏ,
          <br />
          mà cứu cả một
          <br />
          mối quan hệ.
        </div>
      </HienDan>
    </AbsoluteFill>
  );
};

// Cảnh 3 (9–15s): câu kết + lời kêu gọi
const CanhKet: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{justifyContent: "center", alignItems: "center", fontFamily, opacity}}
    >
      <HienDan>
        <div style={{fontSize: 64, fontWeight: 700, color: "white", textAlign: "center", lineHeight: 1.4, padding: "0 80px"}}>
          Lắng nghe nhau
          <br />
          một phút mỗi ngày.
        </div>
        <div style={{fontSize: 48, color: "#fb7185", marginTop: 36}}>
          ❤ Đăng ký kênh để xem tiếp
        </div>
      </HienDan>
    </AbsoluteFill>
  );
};

// Composition chính: 15 giây, 3 cảnh nối bằng dissolve 1 giây.
// Cảnh sau bắt đầu sớm hơn 1 giây so với cảnh trước kết thúc để mờ dần chồng lên nhau.
export const Shorts: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{fontFamily, backgroundColor: "#0f172a"}}>
      {/* Nạp font local từ public/fonts.css */}
      <link rel="stylesheet" href={staticFile("fonts.css")} />
      <NenZoom>
        <Sequence from={0} durationInFrames={5 * fps} name="Cảnh 1 — Mở đầu">
          <CanhMoDau />
        </Sequence>
        <Sequence from={4 * fps} durationInFrames={6 * fps} name="Cảnh 2 — Nội dung">
          <CanhNoiDung />
        </Sequence>
        <Sequence from={9 * fps} durationInFrames={6 * fps} name="Cảnh 3 — Kết">
          <CanhKet />
        </Sequence>
      </NenZoom>
      {/* Phụ đề chạy suốt video, ở 1/3 dưới màn hình */}
      <Subtitles />
    </AbsoluteFill>
  );
};
