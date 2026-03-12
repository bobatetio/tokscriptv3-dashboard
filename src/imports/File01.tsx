import svgPaths from "./svg-ng4xphx9on";

export default function File({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[24px]"} data-name="file-01">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 22">
            <path d={svgPaths.p3f28db00} id="Icon" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}