import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

export const Avatar: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children, className }) => (
  <div data-testid="avatar" className={className}>
    {children}
  </div>
);

export const AvatarImage: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
> = ({ className, alt, ...props }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <Image
    className={cn("aspect-square h-full w-full", className)}
    alt={alt || "Avatar"}
    width={40}
    height={40}
    {...props}
    data-testid="avatar-image"
  />
);

export const AvatarFallback: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children }) => <div data-testid="avatar-fallback">{children}</div>;

export default Avatar;
