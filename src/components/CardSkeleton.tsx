import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

export default function App() {
  return (
    <Card className="w-[200px] space-y-5 p-4" radius="lg">
      <Skeleton className="rounded-lg">
        <div className="bg-default-300 h-24 rounded-lg"></div>
      </Skeleton>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="bg-default-200 h-3 w-3/5 rounded-lg"></div>
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="bg-default-200 h-3 w-4/5 rounded-lg"></div>
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="bg-default-300 h-3 w-2/5 rounded-lg"></div>
        </Skeleton>
      </div>
    </Card>
  );
}
