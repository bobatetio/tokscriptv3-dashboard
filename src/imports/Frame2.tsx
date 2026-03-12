import imgImage48 from "../assets/89e906f5c7151ec317a5e2f92b6381961f8aeac8.png";
import imgRectangle1394 from "../assets/0a33a5ecf308780b929d1b3ae9e10f87b1db2c03.png";

function MaskGroup() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Mask group">
      <div className="bg-white col-1 h-[42px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-30px_6px] mask-size-[137.643px_28px] ml-[30px] mt-[-6px] row-1 w-[121px]" style={{ maskImage: `url('${imgRectangle1394}')` }} />
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="col-1 h-[28px] ml-0 mt-0 relative row-1 w-[137.642px]" data-name="image 48">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage48} />
      </div>
      <MaskGroup />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex items-center relative size-full">
      <Group />
    </div>
  );
}