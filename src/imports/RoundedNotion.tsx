import svgPaths from "./svg-h4kp3a49kl";

export default function RoundedNotion({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[#121212] relative rounded-[20px] size-[92px]"} data-name="Rounded/Notion">
      <div className="absolute inset-[19.57%_20.65%_19.34%_20.65%]" data-name="Group">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54 56.2053">
          <g id="Group">
            <path clipRule="evenodd" d={svgPaths.pe130400} fill="var(--fill-0, #111111)" fillRule="evenodd" id="Vector" />
            <path clipRule="evenodd" d={svgPaths.p30a93c00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_2" />
            <path clipRule="evenodd" d={svgPaths.p3b476f00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector_3" />
          </g>
        </svg>
      </div>
    </div>
  );
}