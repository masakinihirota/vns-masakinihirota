import React from "react";

export const Avatar: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({
  children,
  className,
}) => (
  <div data-testid="avatar" className={className}>
    {children}
  </div>
);

export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  className,
  alt,
  ...props
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className={className} alt={alt} {...props} data-testid="avatar-image" />
);

export const AvatarFallback: React.FC<
  React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children }) => <div data-testid="avatar-fallback">{children}</div>;

export default Avatar;
