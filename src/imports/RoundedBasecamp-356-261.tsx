import svgPaths from "./svg-stt0y6bx5k";
import { imgGroup } from "./svg-xkph0";

function Group() {
  return (
    <div className="absolute inset-[0.75%_0_0.86%_0] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-0.352px] mask-size-[61px_47px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61 46.246">
        <g id="Group">
          <path d={svgPaths.p39c42a80} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-0" data-name="Clip path group">
      <Group />
    </div>
  );
}

function DiscordColorSeeklogo() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[47px] left-[calc(50%+0.5px)] overflow-clip top-[calc(50%+0.5px)] w-[61px]" data-name="discord-color-seeklogo 1">
      <ClipPathGroup />
    </div>
  );
}

export default function RoundedBasecamp() {
  return (
    <div className="bg-[#5865f2] relative rounded-[20px] size-full" data-name="Rounded/Basecamp">
      <DiscordColorSeeklogo />
    </div>
  );
}