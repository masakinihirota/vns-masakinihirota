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

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  // Add default padding for headers so titles/icons are not pressed to the edge
  <div className={`px-6 py-4 ${className ?? ""}`} data-testid="card-header" {...props}>
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

export const CardDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
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
  <div className={`px-6 py-4 ${className ?? ""}`} data-testid="card-content" {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={`px-6 py-3 ${className ?? ""}`} data-testid="card-footer" {...props}>
    {children}
  </div>
);

export default Card;
