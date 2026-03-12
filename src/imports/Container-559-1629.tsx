import imgScreenshot20260309At33842Am1 from "../assets/ad9c0482dcac9cb102e3083cdd68a90c0bd9c4dc.png";
import imgImg from "../assets/9bf39e8d7f131ea242d7146ac4fd23d28eccaa3e.png";

function Container1() {
  return <div className="absolute h-[666.258px] left-[-70.83px] top-[-421.63px] w-[935.656px]" data-name="Container" />;
}

function P() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[246.68px]" data-name="p">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[21px] left-0 not-italic text-[#111] text-[14px] top-0 whitespace-nowrap">Unlock the full Tokscript experience</p>
    </div>
  );
}

function P1() {
  return (
    <div className="absolute h-[17.281px] left-0 top-[24px] w-[505.453px]" data-name="p">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[17.28px] left-0 not-italic text-[#888] text-[12px] top-0 whitespace-nowrap">Unlimited transcriptions · All languages · Bulk scanning · Priority queue · Advanced export</p>
    </div>
  );
}

function Span() {
  return (
    <div className="h-[16px] relative shrink-0 w-[142.633px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[71.5px] not-italic text-[12px] text-center text-white top-[0.5px] whitespace-nowrap">Upgrade now for $10/mo</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#111] content-stretch flex h-[28px] items-center justify-center left-0 pr-[0.008px] rounded-[10px] top-[47.28px] w-[171px]" data-name="button">
      <Span />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[75.281px] left-[27px] top-[23px] w-[707px]" data-name="Container">
      <P />
      <P1 />
      <Button />
    </div>
  );
}

function Img() {
  return (
    <div className="absolute h-[291px] left-[529px] top-[9px] w-[194px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg} />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white border border-[#e5e7eb] border-solid overflow-clip relative rounded-[10px] size-full" data-name="Container">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[297px] left-[calc(50%-0.5px)] top-[calc(50%-50.28px)] w-[896px]" data-name="Screenshot 2026-03-09 at 3.38.42 AM 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgScreenshot20260309At33842Am1} />
      </div>
      <Container1 />
      <Container2 />
      <Img />
    </div>
  );
}