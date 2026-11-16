// Phụ đề mẫu — mỗi câu có thời gian bắt đầu/kết thúc (tính bằng frame).
// Quy tắc: mỗi câu 8–10 từ, chia theo hơi thở của giọng đọc,
// sai lệch với giọng đọc cho phép dưới 0.2 giây (6 frame ở 30fps).

export type CauPhuDe = {
  text: string;
  startFrame: number;
  endFrame: number;
};

const FPS = 30;

export const captions: CauPhuDe[] = [
  {
    text: "Ngày đầu đi làm, tôi định nghỉ ngay buổi sáng.",
    startFrame: 0 * FPS,
    endFrame: 4 * FPS,
  },
  {
    text: "Nhưng rồi một câu nói đã giữ tôi ở lại.",
    startFrame: 4 * FPS,
    endFrame: 9 * FPS,
  },
  {
    text: "Có những câu nói nhỏ, mà cứu cả một mối quan hệ.",
    startFrame: 9 * FPS,
    endFrame: 14 * FPS,
  },
  {
    text: "Một Phút Hiểu Nhau.",
    startFrame: 14 * FPS,
    endFrame: 15 * FPS,
  },
];
