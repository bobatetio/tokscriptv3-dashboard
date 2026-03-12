import svgPaths from "./svg-121rymnpiz";

export default function RoundedAirtable({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[#f3f3f3] relative rounded-[20px] size-[92px]"} data-name="Rounded/Airtable">
      <div className="absolute bottom-[24.08%] left-[19.57%] right-[19.57%] top-1/4" data-name="Group">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55.9989 46.8473">
          <g id="Group">
            <path d={svgPaths.p32c701c0} fill="var(--fill-0, #FCB400)" id="Vector" />
            <path d={svgPaths.p16ec0652} fill="var(--fill-0, #18BFFF)" id="Vector_2" />
            <path d={svgPaths.p366825ec} fill="var(--fill-0, #F82B60)" id="Vector_3" />
            <path d={svgPaths.p1698ec00} fill="var(--fill-0, black)" fillOpacity="0.25" id="Vector_4" />
          </g>
        </svg>
      </div>
    </div>
  );
}