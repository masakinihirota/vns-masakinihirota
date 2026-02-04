import React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-lg ${className ?? ""}`}
    data-testid="card"
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  // Add default padding for headers so titles/icons are not pressed to the edge
  <div
    className={`px-6 py-4 ${className ?? ""}`}
    data-testid="card-header"
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={className} data-testid="card-title" {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, className, ...props }) => (
  <div className={`${className ?? ""}`} data-testid="card-desc" {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  // Default inner padding for card content; individual callers can adjust via className
  <div
    className={`px-6 py-4 ${className ?? ""}`}
    data-testid="card-content"
    {...props}
  >
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`px-6 py-3 ${className ?? ""}`}
    data-testid="card-footer"
    {...props}
  >
    {children}
  </div>
);

export default Card;
