import svgPaths from "./svg-867zpg4725";
import imgScreenshot20260309At34143Am1 from "../assets/b3a148853965f0eea6c20b8748026b122bc3fc9c.png";

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[3px] items-center left-0 top-0">
      <div className="relative shrink-0 size-[16px]" data-name="Solid/Status/Lock">
        <div className="absolute inset-[9.49%_19.87%_11%_19.87%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.64237 12.7216">
            <path clipRule="evenodd" d={svgPaths.p14548200} fill="var(--fill-0, white)" fillRule="evenodd" id="Icon" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[21px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Upgrade to PRO</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[21px] relative shrink-0 w-[121px]">
      <Frame1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0">
      <Frame />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[17.28px] not-italic opacity-80 relative shrink-0 text-[10px] text-white whitespace-nowrap">Unlimited transcriptions · All languages · Bulk scanning · Priority queue · Advanced export</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[28px] relative rounded-[10px] shrink-0 w-[125px]" data-name="button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-1/2 not-italic text-[#111] text-[12px] text-center top-[6.5px] whitespace-nowrap">Upgrade Now</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center justify-between left-1/2 top-[7px] w-[688px]">
      <Frame4 />
      <Button />
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="relative size-full">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[271px] left-1/2 opacity-20 top-[calc(50%-29.5px)] w-[1052px]" data-name="Screenshot 2026-03-09 at 3.41.43 AM 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260309At34143Am1} />
      </div>
      <Frame3 />
    </div>
  );
}