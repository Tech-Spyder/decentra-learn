import { Skeleton } from "@/modules/app/skeleton";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";

type CourseCardProps = {
  slug: string;
  title: string;
  description?: string;
  src: string;
  stats: number;
  /** overall completion as a decimal 0–1 */
  progress?: number | null;
  /** number of segments to show (defaults to 4) */
  segments?: number;
  /** if user is signed in */
  isSignedIn?: boolean;
};

export default function CourseCard({
  title,
  slug,
  src,
  stats,
  progress = null,
  segments = 4,
  // isSignedIn = false,
}: CourseCardProps) {
  const clamped = progress !== null ? Math.max(0, Math.min(progress, 1)) : 0;
  const segSize = 1 / segments;

  const fills = Array.from({ length: segments }, (_, i) => {
    const start = i * segSize;
    const segProgress = (clamped - start) / segSize;
    return Math.max(0, Math.min(segProgress, 1));
  });

  const { authenticated } = usePrivy();
  const isSignedIn = authenticated;


  return (
    <Link
      href={`/learning/${slug}`}
      passHref
      className="w-full min-h-[305px] cursor-pointer bg-tertiary rounded-3xl overflow-hidden flex flex-col gap-4 group"
    >
      <div className="relative max-h-[190px] h-full overflow-hidden">
        <Image
          src={src || "/courses/1.png"}
          alt={`${title}-thumbnail`}
          width={262}
          height={190}
          className="w-full object-contain group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
        <div className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white z-20">
          {stats.toLocaleString()}+
        </div>
        <div className="absolute inset-0 bg-black/60 z-10 max-h-[190px] h-full"></div>
      </div>

      <div className="p-4 relative">
        <h3 className="text-lg font-medium leading-tight text-white group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
      </div>

      <div
        className="mt-auto flex items-center gap-1 sticky bottom-4 px-4"
        aria-label="course progress"
      >
        {fills.map((f, i) => (
          // <div
          //   key={i}
          //   className="flex-1 h-1.5 rounded-full bg-muted-foreground overflow-hidden"
          // >
          //   <div
          //     className={`h-full transition-[width] duration-300 ${
          //       isSignedIn && progress !== null ? "bg-accent" : "bg-muted"
          //     }`}
          //     style={{
          //       width: `${isSignedIn && progress !== null ? f * 100 : 100}%`,
          //     }}
          //   />
          // </div>
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full bg-muted-foreground overflow-hidden"
          >
            <div
              className={`h-full transition-[width] duration-300 ${
                isSignedIn && progress !== null ? "bg-accent" : "bg-muted"
              }`}
              style={{
                width: `${isSignedIn && progress !== null ? f * 100 : 0}%`,
              }}
            />
          </div>
        ))}
        {isSignedIn && progress !== null && (
          <span className="sr-only">{Math.round(clamped * 100)}% complete</span>
        )}
      </div>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="w-full min-h-[305px] cursor-pointer bg-tertiary rounded-3xl overflow-hidden flex flex-col gap-4">
      <div className="relative h-[190px] w-full">
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="p-4 relative">
        <Skeleton className="h-6 w-full" />
      </div>

      <div
        className="mt-auto flex items-center gap-1 sticky bottom-4 px-4"
        aria-label="course progress"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded-full bg-muted-foreground overflow-hidden"
          >
            <Skeleton className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
