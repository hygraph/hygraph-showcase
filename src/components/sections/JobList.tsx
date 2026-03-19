import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GetPageQuery } from "@/types/hygraph-generated";
import { GetJobsDocument, type GetJobsQuery } from "@/types/hygraph-generated";
import { createPreviewAttributes } from "@hygraph/preview-sdk/core";
import SectionHeader from "@/components/sections/SectionHeader";
import { hygraphRequest } from "@/lib/hygraph/client";

type JobListSection = Extract<
  GetPageQuery["pages"][0]["sections"][0],
  { __typename?: "JobList" }
>;

interface JobListProps {
  section: JobListSection;
  pageId: string;
  locale: string;
}

export default async function JobList({
  section,
  pageId,
  locale,
}: JobListProps) {
  const data = await hygraphRequest<GetJobsQuery>(GetJobsDocument);
  const jobs = data?.jobs ?? [];
  const cta = section.cta;

  return (
    <div>
      <SectionHeader
        pageId={pageId}
        section={{
          __typename: "SectionHeader",
          id: section.id,
          label: section.label,
          sectionHeadingHeadline: `${jobs.length} Roles`,
        }}
      />
      {/* Job listings */}
      <section className="border-b border-primary">
        <div>
          {jobs.map((job, i) => (
            <Link
              key={job.id}
              href={`/${locale}/careers/${job.slug}`}
              className={`grid grid-cols-12 items-center group hover:bg-primary hover:text-secondary transition-colors ${
                i < jobs.length - 1 ? "border-b border-primary" : ""
              }`}
            >
              <div className="col-span-2 sm:col-span-1 p-6 md:p-8 border-r border-primary group-hover:border-secondary/20 self-stretch flex items-center">
                <span
                  className="text-brand"
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.5rem)",
                    fontWeight: 900,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="col-span-10 sm:col-span-11 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3
                    {...createPreviewAttributes({
                      entryId: job.id,
                      fieldApiId: "title",
                    })}
                    className="mb-2"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                    }}
                  >
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <span
                      {...createPreviewAttributes({
                        entryId: job.id,
                        fieldApiId: "department",
                      })}
                      className="uppercase tracking-[0.15em] text-muted group-hover:text-secondary/50"
                      style={{ fontSize: "0.65rem", fontWeight: 700 }}
                    >
                      {job.department}
                    </span>
                    <span
                      {...createPreviewAttributes({
                        entryId: job.id,
                        fieldApiId: "location",
                      })}
                      className="uppercase tracking-[0.15em] text-muted group-hover:text-secondary/50"
                      style={{ fontSize: "0.65rem", fontWeight: 700 }}
                    >
                      {job.location}
                    </span>
                    <span
                      {...createPreviewAttributes({
                        entryId: job.id,
                        fieldApiId: "jobType",
                      })}
                      className="uppercase tracking-[0.15em] text-muted group-hover:text-secondary/50"
                      style={{ fontSize: "0.65rem", fontWeight: 700 }}
                    >
                      {job.jobType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-brand uppercase tracking-widest shrink-0 group-hover:gap-3 transition-all">
                  <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    {cta || "View role"}
                  </span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="p-16 text-center">
            <p className="text-muted">
              {section.emptyStatePlaceholder ||
                "No open positions at this time."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
