import svgPaths from "./svg-0z3yc4giqw";

function OutlineCommunicationUserPlus({ className }: { className?: string }) {
  return (
    <div className={className || "relative shrink-0 size-[16.156px]"} data-name="Outline/Communication/User-plus">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute inset-[13.54%_5.21%_15.71%_13.54%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.127 11.4299">
            <g id="Icon">
              <path clipRule="evenodd" d={svgPaths.p1a16800} fill="var(--fill-0, #6B7280)" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p197e0e00} fill="var(--fill-0, #6B7280)" fillRule="evenodd" />
              <path d={svgPaths.p15ef5200} fill="var(--fill-0, #6B7280)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[rgba(0,0,0,0.06)] content-stretch flex items-center justify-center p-[0.642px] relative rounded-[8.989px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.642px] border-solid inset-0 pointer-events-none rounded-[8.989px]" />
      <OutlineCommunicationUserPlus />
    </div>
  );
}