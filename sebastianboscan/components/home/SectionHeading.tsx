type SectionHeadingProps = {
  readonly prefix: string;
  readonly accent: string;
};

export function SectionHeading({ prefix, accent }: SectionHeadingProps) {
  return (
    <h2 className="font-[var(--font-syne),sans-serif] text-5xl text-[#f0f0f0] tracking-tight mb-12">
      {prefix}
      <span className="text-blue-500">{accent}</span>
    </h2>
  );
}
