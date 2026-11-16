import {Composition} from "remotion";
import {Shorts} from "./Shorts";

// Video mẫu: 15 giây, 30fps, dọc 1080x1920
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Shorts"
      component={Shorts}
      durationInFrames={15 * 30}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
