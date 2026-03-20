interface SectionHeaderProps {
  section: {
    label?: string | null;
    sectionHeadingHeadline: string;
  };
  labelAttributes?: object;
  headlineAttributes?: object;
}

export default function SectionHeader({
  section,
  labelAttributes,
  headlineAttributes,
}: SectionHeaderProps) {
  const { label, sectionHeadingHeadline } = section;

  return (
    <section className="border-b border-primary">
      <div className="p-8 md:p-12 lg:px-16 lg:py-12">
        {label && (
          <p
            {...labelAttributes}
            className="uppercase tracking-[0.2em] text-muted mb-3"
            style={{ fontSize: "0.65rem", fontWeight: 700 }}
          >
            {label}
          </p>
        )}
        <h2 {...headlineAttributes}>
          {sectionHeadingHeadline?.replace(/\.$/, "")}
          <span className="text-brand">.</span>
        </h2>
      </div>
    </section>
  );
}
