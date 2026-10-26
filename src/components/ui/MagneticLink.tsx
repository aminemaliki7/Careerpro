'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface MagneticLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

const MAX_OFFSET = 7;
const ATTRACTION_RADIUS = 56;

export default function MagneticLink({ href, className, children }: MagneticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(false);

  const animate = useCallback(() => {
    frameRef.current = null;
    const offset = offsetRef.current;
    const target = targetRef.current;
    const easing = activeRef.current ? 0.16 : 0.12;

    offset.x += (target.x - offset.x) * easing;
    offset.y += (target.y - offset.y) * easing;

    linkRef.current?.style.setProperty(
      'transform',
      `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`
    );

    if (activeRef.current || Math.abs(offset.x) > 0.05 || Math.abs(offset.y) > 0.05) {
      frameRef.current = window.requestAnimationFrame(animate);
    }
  }, []);

  const scheduleAnimation = useCallback(() => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(animate);
    }
  }, [animate]);

  useEffect(() => {
    const motionDisabled = window.matchMedia(
      '(prefers-reduced-motion: reduce), (pointer: coarse)'
    ).matches;

    if (motionDisabled) return;

    const handlePointerMove = (event: MouseEvent | globalThis.PointerEvent) => {
      if (
        ('pointerType' in event && event.pointerType !== 'mouse') ||
        !linkRef.current
      ) {
        return;
      }

      const bounds = linkRef.current.getBoundingClientRect();
      const closestX = Math.max(bounds.left, Math.min(event.clientX, bounds.right));
      const closestY = Math.max(bounds.top, Math.min(event.clientY, bounds.bottom));
      const distance = Math.hypot(event.clientX - closestX, event.clientY - closestY);
      const strength = Math.max(0, 1 - distance / ATTRACTION_RADIUS);

      activeRef.current = strength > 0;
      targetRef.current = {
        x: ((event.clientX - (bounds.left + bounds.width / 2)) / Math.max(bounds.width / 2, 1)) * MAX_OFFSET * strength,
        y: ((event.clientY - (bounds.top + bounds.height / 2)) / Math.max(bounds.height / 2, 1)) * MAX_OFFSET * strength,
      };
      scheduleAnimation();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      activeRef.current = false;
      targetRef.current = { x: 0, y: 0 };
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [scheduleAnimation]);

  const handlePointerLeave = useCallback(() => {
    activeRef.current = false;
    targetRef.current = { x: 0, y: 0 };
    scheduleAnimation();
  }, [scheduleAnimation]);

  return (
    <div
      className="inline-flex"
      onPointerLeave={handlePointerLeave}
    >
      <a
        ref={linkRef}
        href={href}
        className={className}
        style={{ willChange: 'transform' }}
      >
        {children}
      </a>
    </div>
  );
}
