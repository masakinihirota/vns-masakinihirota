"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Table({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"table">) {
  return (
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  );
}

function TableHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"thead">) {
  return (
    <thead className={cn("text-muted-foreground", className)} {...props} />
  );
}

function TableBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"tbody">) {
  return <tbody className={cn("bg-transparent", className)} {...props} />;
}

function TableRow({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"tr">) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"th">) {
  return (
    <th
      className={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"td">) {
  return (
    <td className={cn("p-2 align-middle leading-4", className)} {...props} />
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };

export default Table;
