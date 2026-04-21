import React, { useEffect, useState, useCallback, useContext } from 'react';
import ReactDOM from 'react-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTour, TOUR_STEPS } from '../context/TourContext';
import { ThemeContext } from '../context/ThemeContext';

type Rect = { top: number; left: number; width: number; height: number };

const PAD = 10;
const TOOLTIP_WIDTH = 288;

function findVisibleElement(selector: string): HTMLElement | null {
  const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
  return els.find(el => el.getBoundingClientRect().width > 0) ?? null;
}

export function TourGuide() {
  const { isActive, currentStep, next, prev, skip, steps } = useTour();
  const { isDark } = useContext(ThemeContext);
  const [rect, setRect] = useState<Rect | null>(null);

  const step = steps[currentStep];
  const isCentered = !step.target;

  const updateRect = useCallback(() => {
    if (!step.target) { setRect(null); return; }
    const el = findVisibleElement(step.target);
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
  }, [step]);

  useEffect(() => {
    if (!isActive) return;
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [isActive, currentStep, updateRect]);

  if (!isActive) return null;

  // Design tokens
  const cardBg   = isDark ? '#181818' : '#ffffff';
  const border   = isDark ? '#2e2e2e' : '#e5e7eb';
  const text     = isDark ? '#ffffff' : '#111827';
  const muted    = isDark ? '#888888' : '#6b7280';
  const shadow   = isDark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 24px 64px rgba(0,0,0,0.14)';

  // Tooltip position: right of spotlight, vertically centered
  const tooltipLeft = rect ? rect.left + rect.width + 14 : 0;
  const tooltipTop  = rect ? rect.top + rect.height / 2 : 0;

  const isLast  = currentStep === TOUR_STEPS.length - 1;
  const isFirst = currentStep === 0;

  const Dots = () => (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {steps.map((_, i) => (
        <div
          key={i}
          style={{
            width: i === currentStep ? 18 : 6,
            height: 6,
            borderRadius: 3,
            background: i === currentStep ? '#00b8b2' : (isDark ? '#383838' : '#d1d5db'),
            transition: 'width 0.25s ease, background 0.25s ease',
          }}
        />
      ))}
    </div>
  );

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }}>

      {/* ── Overlay ── */}
      {isCentered ? (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', pointerEvents: 'auto' }}
          onClick={skip}
        />
      ) : rect ? (
        <>
          <div style={{ position: 'fixed', top: 0,                          left: 0, right: 0,                       height: rect.top,                    background: 'rgba(0,0,0,0.62)' }} />
          <div style={{ position: 'fixed', top: rect.top + rect.height,     left: 0, right: 0,                       bottom: 0,                           background: 'rgba(0,0,0,0.62)' }} />
          <div style={{ position: 'fixed', top: rect.top,                   left: 0, width: rect.left,               height: rect.height,                 background: 'rgba(0,0,0,0.62)' }} />
          <div style={{ position: 'fixed', top: rect.top,                   left: rect.left + rect.width, right: 0,  height: rect.height,                 background: 'rgba(0,0,0,0.62)' }} />
          {/* Spotlight ring */}
          <div style={{
            position: 'fixed',
            top: rect.top, left: rect.left,
            width: rect.width, height: rect.height,
            borderRadius: 14,
            border: '2px solid rgba(0,184,178,0.55)',
            boxShadow: '0 0 0 1px rgba(0,184,178,0.18), 0 0 20px rgba(0,184,178,0.12)',
            transition: 'all 0.2s ease',
          }} />
        </>
      ) : null}

      {/* ── Centered welcome card ── */}
      {isCentered && (
        <div style={{
          position: 'fixed', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, pointerEvents: 'none',
        }}>
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 22,
            padding: '36px 40px',
            maxWidth: 420, width: '90%',
            pointerEvents: 'auto',
            boxShadow: shadow,
          }}>
            {/* Icon */}
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(0,184,178,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 22,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00b8b2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>

            <h2 style={{ color: text, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.025em', marginBottom: 10 }}>
              {step.title}
            </h2>
            <p style={{ color: muted, fontSize: '0.8125rem', lineHeight: 1.75, marginBottom: 32 }}>
              {step.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Dots />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={skip}
                  style={{ color: muted, fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 6px', fontFamily: 'inherit' }}
                >
                  Skip tour
                </button>
                <button
                  onClick={next}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: '#00b8b2', color: '#fff',
                    border: 'none', borderRadius: 10,
                    padding: '9px 18px',
                    fontSize: '0.8125rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Start tour <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Spotlight tooltip ── */}
      {!isCentered && rect && (
        <div style={{
          position: 'fixed',
          top: tooltipTop,
          left: tooltipLeft,
          transform: 'translateY(-50%)',
          width: TOOLTIP_WIDTH,
          zIndex: 9999,
          pointerEvents: 'auto',
          transition: 'top 0.2s ease, left 0.2s ease',
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            left: -7, top: '50%',
            transform: 'translateY(-50%)',
            width: 0, height: 0,
            borderTop: '7px solid transparent',
            borderBottom: '7px solid transparent',
            borderRight: `7px solid ${isDark ? '#2e2e2e' : '#e5e7eb'}`,
          }} />
          <div style={{
            position: 'absolute',
            left: -6, top: '50%',
            transform: 'translateY(-50%)',
            width: 0, height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderRight: `6px solid ${cardBg}`,
            zIndex: 1,
          }} />

          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 16,
            padding: '20px 22px',
            boxShadow: shadow,
          }}>
            <p style={{
              color: '#00b8b2',
              fontSize: '0.69rem', fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              marginBottom: 7,
            }}>
              Step {currentStep} of {TOUR_STEPS.length - 1}
            </p>
            <h3 style={{ color: text, fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.015em', marginBottom: 8 }}>
              {step.title}
            </h3>
            <p style={{ color: muted, fontSize: '0.79rem', lineHeight: 1.65, marginBottom: 20 }}>
              {step.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Dots />
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {!isFirst && (
                  <button
                    onClick={prev}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 3,
                      background: 'none',
                      border: `1px solid ${border}`,
                      borderRadius: 8, padding: '6px 11px',
                      fontSize: '0.75rem', fontWeight: 500,
                      cursor: 'pointer', color: text, fontFamily: 'inherit',
                    }}
                  >
                    <ChevronLeft style={{ width: 12, height: 12 }} /> Back
                  </button>
                )}
                <button
                  onClick={skip}
                  style={{ color: muted, fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px', fontFamily: 'inherit' }}
                >
                  Skip
                </button>
                <button
                  onClick={next}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: '#00b8b2', color: '#fff',
                    border: 'none', borderRadius: 8,
                    padding: '7px 14px',
                    fontSize: '0.75rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {isLast ? 'Done' : 'Next'}
                  {!isLast && <ChevronRight style={{ width: 12, height: 12 }} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
