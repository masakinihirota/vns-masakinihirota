import React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  // Provide sensible default spacing/rounded styling so content within cards
  // isn't flush to the very edge. Consumers can still override by passing className.
  <div className={`rounded-lg overflow-hidden ${className ?? ""}`} data-testid="card" {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  // Add default padding for headers so titles/icons are not pressed to the edge
  <div className={`px-6 py-4 ${className ?? ""}`} data-testid="card-header">
    {children}
  </div>
);

export const CardTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <h3 className={className} data-testid="card-title">
    {children}
  </h3>
);

export const CardDescription: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div className={`${className ?? ""}`} data-testid="card-desc">
    {children}
  </div>
);

export const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  // Default inner padding for card content; individual callers can adjust via className
  <div className={`px-6 py-4 ${className ?? ""}`} data-testid="card-content">
    {children}
  </div>
);

export const CardFooter: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div className={`px-6 py-3 ${className ?? ""}`} data-testid="card-footer">
    {children}
  </div>
);

export default Card;
