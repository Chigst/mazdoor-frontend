import React from "react";

// Utility function to conditionally join class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

function Skeleton(props) {
  const { className, ...rest } = props;

  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...rest}
    />
  );
}

export { Skeleton };
