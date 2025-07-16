'use client';
import { useEffect, useState, useMemo } from 'react';
import LogoReveal from './LogoReveal';

interface LogoPreviewProps {
  svg: {
    viewBox: string;
    paths: string;
    animation?: {
      duration: number;
      delayMultiplier: number;
    };
    size: number;
  };
  animationTrigger?: number;
  className?: string;
}

export default function LogoPreview({
  svg,
  animationTrigger = 0,
  className = ''
}: LogoPreviewProps) {
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{
    viewBox: string;
    paths: any[];
    animation?: {
      duration: number;
      delayMultiplier: number;
    };
  } | null>(null);
  // Parse paths and create a stable reference
  useEffect(() => {
    try {
      const parsedPaths = JSON.parse(svg.paths);
      if (!Array.isArray(parsedPaths)) {
        throw new Error('Paths must be an array');
      }
      setPreviewData({
        viewBox: svg.viewBox,
        paths: parsedPaths,
        animation: svg.animation
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid configuration');
      setPreviewData(null);
    }
  }, [svg.viewBox, svg.paths, svg.animation]);

  return (
    <div className={`flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50 ${className}`}>
      {error ? (
        <div className="text-center text-red-500 p-4">
          <p className="font-medium">Preview Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : previewData ? (
        <>
          <LogoReveal
            key={animationTrigger} // This will force re-render when trigger changes
            size={svg.size || 150}
            initialData={previewData}
          />
          <div className="text-xs text-gray-500 text-center">
            <p>Live Preview</p>
            <p className="mt-1">{previewData.paths.length} paths</p>
            {previewData.animation && (
              <p className="mt-1">
                Animation: {previewData.animation.duration}s,
                Delay: {previewData.animation.delayMultiplier}x
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-gray-400 text-center p-4">
          <p>Loading preview...</p>
        </div>
      )}
    </div>
  );
}