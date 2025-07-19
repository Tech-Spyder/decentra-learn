import Image from "next/image";
import React from "react";

type CourseCardProps = {
  title: string;
  description?: string;
  src: string;
  stats: number;
  /** overall completion as a decimal 0–1 */
  progress?: number;
  /** number of segments to show (defaults to 4) */
  segments?: number;
};

export default function CourseCard({
  title,
  src,
  stats,
  progress = 0,
  segments = 4,
}: CourseCardProps) {
  const clamped = Math.max(0, Math.min(progress, 1)); // safety
  const segSize = 1 / segments;

  // Calculate fill for each segment
  const fills = Array.from({ length: segments }, (_, i) => {
    const start = i * segSize;
    const segProgress = (clamped - start) / segSize;
    return Math.max(0, Math.min(segProgress, 1));
  });

  return (
    <div className="max-w-[262px] w-full min-h-[305px] bg-tertiary rounded-3xl overflow-hidden flex flex-col gap-4">
      <div className="relative h-[190px]">
        <Image
          src={src}
          alt={`${title}-thumbnail`}
          width={262}
          height={190}
          className="w-full object-contain"
          priority={false}
        />
        <div className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white">
          {stats.toLocaleString()}+
        </div>
      </div>

      <div className="p-4 relative">
        <h3 className="text-lg font-medium leading-tight text-white">
          {title}
        </h3>
      </div>
      <div
        className="mt-auto flex items-center gap-1 sticky bottom-4 px-4"
        aria-label="course progress"
      >
        {fills.map((f, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full bg-muted-foreground overflow-hidden"
          >
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${f * 100}%` }}
            />
          </div>
        ))}
        <span className="sr-only">{Math.round(clamped * 100)}% complete</span>
      </div>
    </div>
  );
}
