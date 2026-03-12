import { useContext } from 'react';
import imgImage48 from "../../assets/89e906f5c7151ec317a5e2f92b6381961f8aeac8.png";
import imgRectangle1394 from "../../assets/0a33a5ecf308780b929d1b3ae9e10f87b1db2c03.png";
import { ThemeContext } from '../context/ThemeContext';

interface AppLogoProps {
  /** Height in px — width scales automatically to preserve aspect ratio */
  height?: number;
  /** Legacy square size prop — if provided and height is not, sets height */
  size?: number;
}

export function AppLogo({ height, size }: AppLogoProps) {
  const { isDark } = useContext(ThemeContext);

  // Original Figma dimensions: 137.642 × 28
  const h = height ?? size ?? 28;
  const scale = h / 28;
  const logoW  = 137.642 * scale;

  // Mask overlay original dimensions / offsets
  const maskH    = 42   * scale;
  const maskW    = 121  * scale;
  const maskML   = 30   * scale;
  const maskMT   = -6   * scale;
  const maskSizeW = 137.643 * scale;
  const maskSizeH = 28  * scale;
  const maskPosX  = -30 * scale;
  const maskPosY  =  6  * scale;

  return (
    <div
      style={{
        display: 'inline-block',
        position: 'relative',
        width: logoW,
        height: h,
        lineHeight: 0,
        flexShrink: 0,
        userSelect: 'none',
        verticalAlign: 'middle',
      }}
    >
      {/* Base logo image (icon + wordmark shape) */}
      <img
        alt="Tokscript"
        src={imgImage48}
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          maxWidth: 'none',
        }}
      />

      {/* Colour mask — white in dark mode, near-black in light mode */}
      <div
        style={{
          position: 'absolute',
          left: maskML,
          top: maskMT,
          background: isDark ? '#ffffff' : '#0f0f0f',
          width:  maskW,
          height: maskH,
          maskImage:         `url('${imgRectangle1394}')`,
          WebkitMaskImage:   `url('${imgRectangle1394}')`,
          maskSize:          `${maskSizeW}px ${maskSizeH}px`,
          WebkitMaskSize:    `${maskSizeW}px ${maskSizeH}px`,
          maskPosition:      `${maskPosX}px ${maskPosY}px`,
          WebkitMaskPosition:`${maskPosX}px ${maskPosY}px`,
          maskRepeat:        'no-repeat',
          WebkitMaskRepeat:  'no-repeat',
        }}
      />
    </div>
  );
}