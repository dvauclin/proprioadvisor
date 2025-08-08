
import React from 'react';
import { Skeleton } from "@/components/ui-kit/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui-kit/card";

const ConciergerieCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="p-4 border-b">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex justify-end pt-4">
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </CardContent>
  </Card>
);

const ConciergerieListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <ConciergerieCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ConciergerieListSkeleton;

