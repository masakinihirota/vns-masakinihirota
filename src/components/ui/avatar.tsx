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
    className={cn("aspect-square h-full w-full object-cover", className)}
    alt={alt || "Avatar"}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    {...(props as any)}
    data-testid="avatar-image"
  />
);

export const AvatarFallback: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children }) => <div data-testid="avatar-fallback">{children}</div>;

export default Avatar;
