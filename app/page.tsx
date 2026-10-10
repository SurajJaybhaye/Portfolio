import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import Reveal from "@/components/Reveal";
import FadeIn from "@/components/FadeIn";
import CompanyIcon from "@/components/CompanyIcon";
import SectionNav from "@/components/SectionNav";
import AiAssistant from "@/components/AiAssistant";
import {
  LuMail,
  LuExternalLink,
  LuGraduationCap,
  LuArrowUp,
} from "react-icons/lu";
import { FaGithub } from "react-icons/fa6";
import RichText from "@/components/RichText";
import LeetCodeHeatmap from "@/components/LeetCodeHeatmap";
import { hasSkillIcon, projectIcon, skillIcon, socialIcon } from "@/lib/icons";
import {
  profile,
  socials,
  experience,
  education,
  skills,
  skillsNote,
  projects,
} from "@/lib/content";
import { LEETCODE_URL } from "@/lib/leetcode";

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 pb-12 md:pb-16">
      <div className="mb-6 w-full border-t border-on-surface/[0.04] dark:border-on-surface/[0.1] md:mb-8" />
      <Reveal>
        <div className="mb-6">
          <h2 className="mb-2 font-serif text-[2rem] text-on-surface">
            {title}
          </h2>
          <p className="text-sm uppercase leading-loose tracking-widest text-faint">
            {subtitle}
          </p>
        </div>
      </Reveal>
      {children}
    </section>
  );
}

const contactLinks = [
  ...(profile.email
    ? [{ label: "Mail Me", href: `mailto:${profile.email}`, icon: LuMail }]
    : []),
  ...socials.map((x) => ({
    label: x.label,
    href: x.href,
    icon: socialIcon(x.label),
  })),
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-12">
      <ThemeToggle />
      <SectionNav />
      <AiAssistant />

      {/* Hero: fills the first screen; Experience and the rest come on scroll. */}
      <section
        id="home"
        className="relative flex min-h-svh flex-col justify-center pb-16 pt-24 md:min-h-screen md:pb-28 md:pt-40"
      >
        <FadeIn>
          <div className="mb-6 flex items-center gap-5 sm:mb-8">
            <Image
              src={profile.photo}
              alt={profile.name}
              width={64}
              height={64}
              priority
              className="ambient-shadow h-16 w-16 shrink-0 -rotate-6 rounded-md object-cover"
            />
            <div className="space-y-0.5">
              <h2 className="text-sm font-semibold tracking-wide text-on-surface">
                {profile.name}
              </h2>
              <p className="text-xs uppercase tracking-widest text-faint">
                {profile.city}
              </p>
            </div>
          </div>
        </FadeIn>

        {profile.availability && (
          <FadeIn delay={0.1} className="w-fit">
            <p className="mb-6 inline-flex w-fit sm:mb-8 items-center gap-2 rounded-full border border-on-surface/[0.08] dark:border-on-surface/[0.14] bg-container-low px-3 py-1.5 text-xs text-mid">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-heat-3 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-heat-3" />
              </span>
              {profile.availability}
            </p>
          </FadeIn>
        )}

        <FadeIn delay={0.2}>
          <h1 className="mb-7 text-balance whitespace-pre-line font-serif text-[2.15rem] leading-[1.15] tracking-tight text-on-surface sm:mb-10 sm:text-[2.5rem] md:text-[3rem]">
            {/* Keep each side of the "|" together so a wrap never splits a phrase. */}
            {profile.headline.split(" | ").map((part, i, all) => (
              <span key={part}>
                {i > 0 && " "}
                <span className="whitespace-nowrap">
                  {part}
                  {i < all.length - 1 && " |"}
                </span>
              </span>
            ))}
          </h1>
        </FadeIn>

        <div className="space-y-6 text-[0.95rem] leading-relaxed text-on-surface/70">
          <FadeIn delay={0.3}>
            <p className="max-w-xl">{profile.summary}</p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="neumorphic group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-on-surface/[0.03] bg-surface px-7 py-3.5 sm:w-auto text-[0.85rem] font-bold tracking-wide text-on-surface/80"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-on-surface/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10">View Resume</span>
                <span className="relative z-10 opacity-40">→</span>
              </a>
              <a
                href={profile.email ? `mailto:${profile.email}` : "#contact"}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-on-surface/[0.12] dark:border-on-surface/[0.2] px-6 py-3.5 sm:w-auto text-[0.85rem] font-bold tracking-wide text-on-surface/80 transition-colors hover:border-primary/40 hover:bg-container-low hover:text-primary"
              >
                <LuMail aria-hidden className="text-base" />
                Get in touch
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Section id="experience" title="Experience" subtitle="Recent roles">
        <div className="text-on-surface/80">
          {experience.map((e, i) => (
            <Reveal key={e.company + e.dates} delay={i * 0.1}>
              <div className="group">
                <div className="flex items-start gap-4 py-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <div className="neumorphic-badge flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-on-surface/[0.03] bg-surface transition-transform duration-300 group-hover:scale-105">
                    <CompanyIcon
                      name={e.icon}
                      fallback={e.company[0]}
                      className="h-7 w-7"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[0.95rem] font-semibold leading-tight text-on-surface transition-colors duration-300 group-hover:text-primary">
                      {e.role}
                    </h3>
                    <p className="mt-1 text-sm text-mid transition-colors duration-300 group-hover:text-on-surface/80">
                      {e.company}
                      <span className="text-faint"> · {e.location}</span>
                    </p>
                    <p className="mt-1.5 text-xs uppercase tracking-wider text-faint">
                      {e.dates}
                    </p>
                    <div className="mt-5 space-y-6">
                      {e.work.map((w) => (
                        <div key={w.name}>
                          <h4 className="text-sm font-semibold text-on-surface">
                            {w.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-faint">{w.tech}</p>
                          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-on-surface/70 marker:text-on-surface/30">
                            {w.points.map((pt) => (
                              <li key={pt}>
                                <RichText text={pt} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {i < experience.length - 1 && (
                  <div className="w-full border-b border-dashed border-on-surface/[0.03] dark:border-on-surface/[0.09]" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="education" title="Education" subtitle="Where I studied">
        <div className="text-on-surface/80">
          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 0.1}>
              <div className="group">
                <div className="flex items-start gap-4 py-5 transition-transform duration-300 group-hover:-translate-y-0.5">
                  <div className="neumorphic-badge flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-on-surface/[0.03] bg-surface text-xl text-mid transition-transform duration-300 group-hover:scale-105">
                    <LuGraduationCap aria-hidden />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[0.95rem] font-semibold leading-tight text-on-surface transition-colors duration-300 group-hover:text-primary">
                      {e.school}
                    </h3>
                    <p className="mt-1.5 text-sm text-on-surface/70">
                      {e.degree}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-faint">
                      {e.dates}
                    </p>
                    <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-relaxed text-on-surface/70 marker:text-on-surface/30">
                      {e.points.map((pt) => (
                        <li key={pt}>
                          <RichText text={pt} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {i < education.length - 1 && (
                  <div className="w-full border-b border-dashed border-on-surface/[0.03] dark:border-on-surface/[0.09]" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="skills" title="Skills" subtitle="Tech stack">
        <div className="space-y-6">
          {Object.entries(skills).map(([group, items], gi) => (
            <Reveal key={group} delay={Math.min(gi * 0.08, 0.3)}>
              <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-6">
                <h3 className="pt-2 text-xs uppercase tracking-widest text-faint">
                  {group}
                </h3>
                <ul className="flex flex-wrap gap-2.5">
                  {items.map((name) => {
                    const Icon = skillIcon(name);
                    return (
                      <li
                        key={name}
                        className="inline-flex cursor-default select-none items-center gap-2 rounded-lg border border-on-surface/[0.08] bg-container-low px-4 py-2 text-sm text-on-surface/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-container-high hover:text-on-surface dark:border-on-surface/[0.14]"
                      >
                        <Icon aria-hidden className="text-base" />
                        {name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <p className="mt-6 text-sm text-faint">{skillsNote}</p>
        </Reveal>
      </Section>

      <Section id="projects" title="Projects" subtitle="Selected work">
        <div className="text-on-surface/80">
          {projects.map((p, i) => {
            const ProjectIcon = projectIcon(p.name);
            const title = (
              <h3 className="text-[0.95rem] font-semibold leading-tight text-on-surface transition-colors duration-300 group-hover:text-primary">
                {p.name}
              </h3>
            );
            return (
              <Reveal key={p.name} delay={Math.min(i * 0.1, 0.3)}>
                <div className="group">
                  <div className="-mx-3 flex items-start gap-5 rounded-xl px-3 py-6 transition-[transform,background-color] duration-300 group-hover:-translate-y-0.5 group-hover:bg-on-surface/[0.018] dark:group-hover:bg-on-surface/[0.04]">
                    <div className="neumorphic-badge mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-on-surface/[0.03] bg-surface text-xl text-mid transition-transform duration-300 group-hover:scale-105">
                      <ProjectIcon aria-hidden />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-3">
                        {p.live ? (
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2"
                          >
                            {title}
                            <LuExternalLink
                              aria-hidden
                              className="text-faint transition-colors group-hover:text-primary"
                            />
                          </a>
                        ) : (
                          title
                        )}
                        {p.repo && (
                          <a
                            href={p.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${p.name} source code`}
                            className="text-lg text-faint transition-colors hover:text-on-surface"
                          >
                            <FaGithub aria-hidden />
                          </a>
                        )}
                      </div>
                      <ul className="mt-2.5 list-disc space-y-2 pl-4 text-sm leading-relaxed text-mid marker:text-on-surface/30">
                        {p.points.map((pt) => (
                          <li key={pt}>
                            <RichText text={pt} />
                          </li>
                        ))}
                      </ul>
                      <ul className="mt-4 flex flex-wrap gap-4">
                        {p.tech.filter(hasSkillIcon).map((t) => {
                          const Icon = skillIcon(t);
                          return (
                            <li
                              key={t}
                              title={t}
                              aria-label={t}
                              className="text-lg text-faint transition-colors duration-300 hover:text-on-surface"
                            >
                              <Icon aria-hidden />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  {i < projects.length - 1 && (
                    <div className="w-full border-b border-dashed border-on-surface/[0.03] dark:border-on-surface/[0.09]" />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section id="activity" title="Coding activity" subtitle="LeetCode">
        <Reveal>
          <p className="mb-6 text-[0.95rem] leading-relaxed text-on-surface/70">
            250+ DSA problems solved across{" "}
            <a
              href={LEETCODE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              LeetCode
            </a>{" "}
            and{" "}
            {profile.gfg ? (
              <a
                href={profile.gfg}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                GeeksforGeeks
              </a>
            ) : (
              "GeeksforGeeks"
            )}
          </p>
        </Reveal>
        <Reveal>
          <LeetCodeHeatmap />
        </Reveal>
      </Section>

      <Section id="contact" title="Contact" subtitle="Get in touch">
        <div className="space-y-8">
          <Reveal>
            <p className="max-w-lg text-[0.95rem] leading-relaxed text-on-surface/70">
              {profile.openToWork}
            </p>
          </Reveal>
          <div className="flex flex-col gap-5">
            {contactLinks.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.label} delay={i * 0.08}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-fit items-center gap-6 transition-transform duration-300 hover:translate-x-1"
                  >
                    <div className="neumorphic-badge flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-on-surface/[0.03] bg-surface text-xl text-mid transition-transform duration-300 group-hover:scale-105">
                      <Icon aria-hidden />
                    </div>
                    <span className="pb-0.5 text-[0.95rem] font-semibold text-on-surface/80 transition-colors group-hover:text-primary">
                      {c.label}
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      <footer className="flex items-center justify-between border-t border-on-surface/[0.04] pt-8 text-xs text-faint dark:border-on-surface/[0.1]">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a
          href="#"
          className="group inline-flex items-center gap-1.5 transition-colors hover:text-primary"
        >
          Back to top
          <LuArrowUp
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </a>
      </footer>
    </main>
  );
}
