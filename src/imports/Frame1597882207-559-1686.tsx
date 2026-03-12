import imgScreenshot20260309At34143Am1 from "../assets/b3a148853965f0eea6c20b8748026b122bc3fc9c.png";
import imgImage3 from "../assets/9bf39e8d7f131ea242d7146ac4fd23d28eccaa3e.png";

function Button() {
  return (
    <div className="bg-white h-[28px] relative rounded-[10px] shrink-0 w-[171px]" data-name="button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-1/2 not-italic text-[#111] text-[12px] text-center top-[6.5px] whitespace-nowrap">Upgrade now for $10/mo</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3px] items-start left-[27px] top-[23px] w-[707px]">
      <p className="font-['Inter:Bold',sans-serif] font-bold h-[22px] leading-[21px] not-italic relative shrink-0 text-[14px] text-white w-full">Unlock the full Tokscript experience</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal h-[23px] leading-[17.28px] not-italic relative shrink-0 text-[12px] text-white w-full">Unlimited transcriptions · All languages · Bulk scanning · Priority queue · Advanced export</p>
      <Button />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-[#0d0d0d] border border-[#262626] border-solid overflow-clip relative rounded-[10px] size-full">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[271px] left-[calc(50%-29px)] opacity-20 top-[calc(50%+0.5px)] w-[1052px]" data-name="Screenshot 2026-03-09 at 3.41.43 AM 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260309At34143Am1} />
      </div>
      <Frame1 />
      <div className="-translate-y-1/2 absolute h-[291px] left-[529px] top-[calc(50%+92.5px)] w-[194px]" data-name="image 3">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
    </div>
  );
}