import {Config} from "@remotion/cli/config";

// Ghi đè file cũ khi render lại cùng tên (khỏi phải xóa tay)
Config.setOverwriteOutput(true);

// Ảnh tĩnh xuất ra dạng JPEG cho nhẹ
Config.setVideoImageFormat("jpeg");
