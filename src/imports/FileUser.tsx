import svgPaths from "./svg-qluk1jjzqe";

export default function FileUser({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[24px]"} data-name="file-user">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 22">
            <path d={svgPaths.p3e949f00} id="Icon" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}