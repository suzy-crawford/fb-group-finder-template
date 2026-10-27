import React from "react";
import { cn } from "@/lib/utils";

// Brand loading state: placeholders shaped like the content that's coming, never a spinner.
export function SkeletonLine({ className }) {
  return <div className={cn("sf-skel h-3", className)} />;
}

export function PageSkeleton({ className }) {
  return (
    <div className={cn("w-full max-w-2xl mx-auto px-4 py-10 space-y-4", className)} aria-busy="true" aria-label="Loading">
      <SkeletonLine className="h-3 w-24" />
      <SkeletonLine className="h-7 w-2/3" />
      <div className="pt-4 space-y-3">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-11/12" />
        <SkeletonLine className="w-4/5" />
      </div>
      <div className="pt-6 space-y-3">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-3/4" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 3, className }) {
  return (
    <div className={cn("border-t border-app-border", className)} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="py-5 border-b border-app-border space-y-2">
          <SkeletonLine className="h-4 w-1/2" />
          <SkeletonLine className="w-4/5" />
        </div>
      ))}
    </div>
  );
}
