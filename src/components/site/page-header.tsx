import { Reveal } from "./reveal";

interface PageHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}

/** Kepala halaman untuk halaman turunan (bukan beranda). */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-paper">
      <div className="kawung pointer-events-none absolute inset-0 opacity-[0.05]" />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-36 md:px-8 md:pb-20 md:pt-44">
        <Reveal>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-terracotta">
            <span className="h-px w-8 bg-terracotta" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-forest-deep md:text-6xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
