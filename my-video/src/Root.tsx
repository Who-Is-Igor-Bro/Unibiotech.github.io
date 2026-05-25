import { Composition } from "remotion";
import CelestLeagueAd from "./CelestLeagueAd";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="CelestLeagueAd"
        component={CelestLeagueAd}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};