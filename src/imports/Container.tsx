import svgPaths from "./svg-095ycaiqh2";

function ChromeStoreSvg() {
  return (
    <div className="absolute contents inset-[8.11%_0_5.4%_0]" data-name="chrome-store.svg">
      <div className="absolute inset-[8.11%_-0.01%_5.4%_0.01%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2952 15.8229">
          <path clipRule="evenodd" d={svgPaths.p9df9700} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[44.51%_11.51%_5.42%_13.69%]" data-name="Vector_2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.6838 9.15997">
          <path d={svgPaths.p12053a00} fill="var(--fill-0, #DB4437)" id="Vector_2" />
        </svg>
      </div>
      <div className="absolute inset-[64.4%_68.74%_5.4%_6.82%]" data-name="Vector_3">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.47082 5.52591">
          <path d={svgPaths.p10b301c0} fill="var(--fill-0, #0F9D58)" id="Vector_3" />
        </svg>
      </div>
      <div className="absolute inset-[68.11%_6.81%_5.41%_50.01%]" data-name="Vector_4">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.89994 4.84586">
          <path d={svgPaths.p14bbf600} fill="var(--fill-0, #FFCD40)" id="Vector_4" />
        </svg>
      </div>
      <div className="absolute inset-[68.11%_30.36%_5.41%_30.38%]" data-name="Vector_5">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.18226 4.84586">
          <path d={svgPaths.p1696a380} fill="var(--fill-0, #F1F1F1)" id="Vector_5" />
        </svg>
      </div>
      <div className="absolute inset-[72.05%_34.29%_5.4%_34.3%]" data-name="Vector_6">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.7468 4.12643">
          <path d={svgPaths.p18c9e100} fill="var(--fill-0, #4285F4)" id="Vector_6" />
        </svg>
      </div>
      <div className="absolute inset-[8.11%_-0.01%_48.64%_0.01%]" data-name="Vector_7">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2952 7.91187">
          <path clipRule="evenodd" d={svgPaths.p1e52cc80} fill="var(--fill-0, #212121)" fillRule="evenodd" id="Vector_7" opacity="0.05" />
        </svg>
      </div>
      <div className="absolute inset-[50.78%_-0.01%_48.65%_0.01%]" data-name="Vector_8">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2952 0.104563">
          <path d={svgPaths.p2fa01800} fill="var(--fill-0, #212121)" id="Vector_8" opacity="0.02" />
        </svg>
      </div>
      <div className="absolute inset-[51.34%_-0.01%_48.08%_0.01%]" data-name="Vector_9">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2952 0.104552">
          <path d={svgPaths.pc2e1800} fill="var(--fill-0, white)" id="Vector_9" opacity="0.05" />
        </svg>
      </div>
      <div className="absolute inset-[8.11%_-0.01%_73.11%_0.01%]" data-name="Vector_10">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2952 3.43559">
          <path clipRule="evenodd" d={svgPaths.p3ec5e400} fill="var(--fill-0, #212121)" fillRule="evenodd" id="Vector_10" opacity="0.02" />
        </svg>
      </div>
      <div className="absolute inset-[16.64%_-0.01%_5.41%_0.01%]" data-name="Vector_11">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.2952 14.262">
          <path clipRule="evenodd" d={svgPaths.p3ba75c00} fill="var(--fill-0, #231F20)" fillRule="evenodd" id="Vector_11" opacity="0.1" />
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[18.295px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ChromeStoreSvg />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 overflow-clip size-[18.295px] top-0" data-name="Container">
      <Icon />
    </div>
  );
}

export default function Container() {
  return (
    <div className="relative size-full" data-name="Container">
      <Container1 />
    </div>
  );
}