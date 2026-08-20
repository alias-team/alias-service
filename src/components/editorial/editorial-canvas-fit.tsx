"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { EditorialEmail } from "./editorial-email";
import type { EditorialData } from "@/types/editorial-ui";

type EditorialCanvasFitProps = {
  data: EditorialData;
};

type FitState = {
  availableWidth: number;
  height: number | null;
  naturalWidth: number;
  scale: number;
};

const initialFitState: FitState = {
  availableWidth: 0,
  height: null,
  naturalWidth: 1440,
  scale: 1,
};

export function EditorialCanvasFit({ data }: EditorialCanvasFitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<FitState>(initialFitState);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const availableWidth = container.clientWidth;
    const naturalWidth = Math.max(canvas.scrollWidth, canvas.offsetWidth, 1440);
    const naturalHeight = Math.max(canvas.scrollHeight, canvas.offsetHeight);
    const scale = availableWidth > 0 ? Math.min(1, availableWidth / naturalWidth) : 1;
    const height = Math.ceil(naturalHeight * scale);

    setFit((current) => {
      if (
        Math.abs(current.availableWidth - availableWidth) < 1 &&
        Math.abs(current.naturalWidth - naturalWidth) < 1 &&
        Math.abs(current.scale - scale) < 0.001 &&
        current.height === height
      ) {
        return current;
      }

      return { availableWidth, height, naturalWidth, scale };
    });
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    });

    observer.observe(container);
    observer.observe(canvas);
    window.addEventListener("resize", measure);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div
      ref={containerRef}
      data-editorial-fit="container"
      data-editorial-natural-width={Math.round(fit.naturalWidth)}
      data-editorial-available-width={Math.round(fit.availableWidth)}
      data-editorial-scale={fit.scale.toFixed(4)}
      style={{ overflow: "hidden", width: "100%" }}
    >
      <div
        data-editorial-fit="height"
        style={{ height: fit.height === null ? undefined : `${fit.height}px` }}
      >
        <div
          ref={canvasRef}
          data-editorial-fit="canvas"
          style={{
            transform: `scale(${fit.scale})`,
            transformOrigin: "top left",
            width: "max-content",
          }}
        >
          <EditorialEmail data={data} />
        </div>
      </div>
    </div>
  );
}
