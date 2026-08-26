import { Emphasis } from "./emphasis";
import { PlateViewer } from "./plate-viewer";
import { Reveal } from "./reveal";
import { Container, SectionTitle } from "./ui";

export type Passage = {
  n: string;
  label: string;
  text: string;
  marks?: string[];
  image?: string | null;
};

export function BackgroundStory({
  title,
  intro,
  passages = [],
  zoomLabel,
  closeLabel,
}: {
  title: string;
  intro: string;
  passages?: Passage[];
  zoomLabel: string;
  closeLabel: string;
}) {
  return (
    <Container className="grid gap-10 pt-16 sm:pt-22 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:gap-14">
      {/* Left Column: Section Header */}
      <div className="flex flex-col">
        <SectionTitle>{title}</SectionTitle>
        <p className="mt-5 max-w-[34ch] font-sans text-[0.9375rem] leading-[1.65] text-muted text-pretty">
          {intro}
        </p>

        {/* The frame takes the picture's own ratio rather than a fixed box, so
            a photograph filed at a different shape is not cropped to fit. */}
        <PlateViewer
          src="/image/latar-belakang.jpg"
          ratio="2000 / 1500"
          sizes="(min-width: 1024px) 40vw, 100vw"
          zoomLabel={zoomLabel}
          closeLabel={closeLabel}
          className="mt-8 aspect-[2000/1500] w-full rounded-xl ring-1 ring-ink/8"
        />
      </div>

      {/* Right Column: The 4 Points */}
      <div>
        {passages.length > 0 && (
          <Reveal className="max-w-[64ch]">
            <div className="space-y-9">
              {passages.map((passage, i) => (
                <div
                  key={passage.n || i}
                  data-reveal
                  className={
                    i === 0 ? "" : "border-t border-ink/12 pt-8 sm:pt-9"
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand font-display text-[0.6875rem] font-bold tabular-nums text-white">
                      {i + 1}
                    </span>
                    <h3 className="font-sans text-xs font-semibold tracking-[0.14em] uppercase text-brand">
                      {passage.label}
                    </h3>
                  </div>

                  <p
                    className={
                      i === 0
                        ? "mt-3.5 font-display text-[clamp(1.125rem,1.7vw,1.35rem)] leading-[1.65] font-semibold text-ink text-pretty"
                        : "mt-3.5 font-sans text-[1.03rem] leading-[1.75] text-body text-pretty"
                    }
                  >
                    <Emphasis text={passage.text} marks={passage.marks} />
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </Container>
  );
}
