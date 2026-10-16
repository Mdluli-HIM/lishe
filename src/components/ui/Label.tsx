import clsx from "clsx";

export default function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={clsx("label", className)}>{children}</span>;
}
