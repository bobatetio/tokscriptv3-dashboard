import svgPaths from "./svg-dryrzs8s7b";

function Icon() {
  return (
    <div className="relative shrink-0 size-[12.842px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8421 12.8421">
        <g id="Icon">
          <path d="M2.6778 6.42183H10.169" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07018" />
          <path d="M6.42257 2.67706V10.1683" id="Vector_2" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07018" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.06)] content-stretch flex inset-[12.21%_27.97%_45.69%_29.92%] items-center justify-center p-[0.642px] rounded-[8.989px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.642px] border-solid inset-0 pointer-events-none rounded-[8.989px]" />
      <Icon />
    </div>
  );
}

function Empty() {
  return (
    <div className="relative shrink-0 size-[61px]" data-name="empty 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-[18.31%_6.06%_2.18%_8%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52.4265 48.501">
            <path d={svgPaths.p3e3aac00} fill="var(--fill-0, #C6C6C6)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[1.78%_11.19%_27.05%_13.13%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46.1608 43.417">
            <path d={svgPaths.p19cf2500} fill="var(--fill-0, #F9F9F9)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[1.78%_11.8%_27.66%_13.13%]" data-name="Vector">
          <div className="absolute inset-[0_1.88%_2.01%_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.9267 42.183">
              <path d={svgPaths.p39cffb80} fill="url(#paint0_linear_679_2474)" id="Vector" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_679_2474" x1="24.5" x2="-6.1175" y1="23.1255" y2="-7.49225">
                  <stop stopColor="white" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <Container2 />
        <div className="absolute inset-[39.08%_55.64%_48.08%_31.53%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.82775 7.828">
            <path d="M0 0L7.82775 7.828H0V0Z" fill="url(#paint0_linear_679_2472)" id="Vector" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_679_2472" x1="5.17175" x2="-4.29" y1="9.084" y2="-0.377503">
                <stop stopColor="#C2CECE" stopOpacity="0" />
                <stop offset="0.179" stopColor="#AFBCBC" stopOpacity="0.179" />
                <stop offset="1" stopColor="#5B6A6A" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[18.31%_6.06%_47.03%_88.81%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.13275 21.1437">
            <path d={svgPaths.p23535e00} fill="var(--fill-0, #C6C6C6)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[37.36%_0_1.78%_0]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.0002 37.1273">
            <path d={svgPaths.p19345310} fill="url(#paint0_linear_679_2478)" id="Vector" />
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_679_2478" x1="30.5" x2="30.5" y1="0" y2="37.1273">
                <stop stopColor="#EEF0F4" />
                <stop offset="0.927" stopColor="#E4E4E4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute inset-[72.29%_17.59%_19.25%_19.53%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38.3583 5.16475">
            <path d={svgPaths.p1aed67f2} fill="var(--fill-0, #D5D5D5)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#f9f9f9] flex-[1_0_0] min-h-px min-w-px relative w-[214.797px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Empty />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-0 not-italic text-[#111827] text-[12px] top-[0.5px] whitespace-nowrap">Start a new collection</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[27.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[13.75px] left-0 not-italic text-[#6b7280] text-[10px] top-[-0.5px] w-[153px]">Group related transcripts into an organised collection.</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[65.5px] relative shrink-0 w-[214.797px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[4px] px-[14px] relative size-full">
        <Paragraph />
        <Paragraph1 />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white relative rounded-[16px] size-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[1.5px] relative rounded-[inherit] size-full">
        <Container1 />
        <Container3 />
      </div>
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(0,0,0,0.13)] border-dashed inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}