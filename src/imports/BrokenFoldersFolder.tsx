import svgPaths from "./svg-zoygilgncg";

export default function BrokenFoldersFolder({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[24px]"} data-name="Broken / Folders / Folder">
      <div className="absolute bottom-[58.33%] left-[54.17%] right-1/4 top-[41.67%]" data-name="Vector">
        <div className="absolute inset-[-0.75px_-15%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 1.5">
            <path d="M5.75 0.75H0.75" id="Vector" stroke="var(--stroke-0, #1C274C)" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-3.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 21.5">
            <path d={svgPaths.pbf03000} id="Vector" stroke="var(--stroke-0, #1C274C)" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}