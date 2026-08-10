type SectionHeadingProps = {
  readonly title: string;
};

export function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <h2 className="font-[var(--font-syne),sans-serif] text-5xl text-[#f0f0f0] tracking-tight mb-12">
      {title}
    </h2>
  );
}
