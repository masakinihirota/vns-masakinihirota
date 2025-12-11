import React from "react";

export const Avatar: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
}) => (
  <div data-testid="avatar" className={className}>
    {children}
  </div>
);

export const AvatarImage: React.FC<{ src?: string; alt?: string }> = ({ src, alt }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} data-testid="avatar-image" />
);

export const AvatarFallback: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children }) => <div data-testid="avatar-fallback">{children}</div>;

export default Avatar;
