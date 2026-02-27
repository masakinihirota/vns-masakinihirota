import React from "react";

export const Badge: React.FC<
  React.PropsWithChildren<{ variant?: string; className?: string }>
> = ({ children, className }) => (
  <span className={className} data-testid="badge">
    {children}
  </span>
);

export default Badge;
