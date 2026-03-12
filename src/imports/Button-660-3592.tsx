import svgPaths from "./svg-tsuh6c7j02";

function SolidStatusLightningAlt({ className }: { className?: string }) {
  return (
    <div className={className || "relative shrink-0 size-[20px]"} data-name="Solid/Status/Lightning-alt">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute inset-[10.42%_22.92%_10.42%_18.75%]" data-name="Icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 15.8334">
            <path d={svgPaths.p12818980} fill="var(--fill-0, #0D0D0D)" id="Icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Button() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[10px] size-full" data-name="Button" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 28 28\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(1.4 1.4 -2.8 2.8 14 14)\\'><foreignObject x=\\'-190\\' y=\\'-190\\' width=\\'380\\' height=\\'380\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgb(49, 230, 231) 0%, rgb(75, 233, 234) 6.25%, rgb(101, 236, 237) 12.5%, rgb(152, 243, 243) 25%, rgb(204, 249, 249) 37.5%, rgb(255, 255, 255) 50%, rgb(250, 191, 215) 62.5%, rgb(245, 128, 175) 75%, rgb(242, 96, 154) 81.25%, rgb(239, 64, 134) 87.5%, rgb(237, 32, 114) 93.75%, rgb(235, 16, 104) 96.875%, rgb(234, 0, 94) 100%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')" }}>
      <SolidStatusLightningAlt />
    </div>
  );
}