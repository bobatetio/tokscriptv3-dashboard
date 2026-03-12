import svgPaths from "./svg-wyskl0liaj";

export default function FilePlay({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[24px]"} data-name="file-play">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 22">
            <g id="Icon">
              <path d={svgPaths.p1b14da40} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
              <path d={svgPaths.p294b0100} stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}