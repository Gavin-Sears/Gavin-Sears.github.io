// Schema for portfolio entries. A typo or missing field here is a build error.

type MonthNum = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';

/** 'YYYY-MM', e.g. '2026-09'. */
export type YearMonth = `${number}-${MonthNum}`;

/** work = internships, research, TA, jobs; school = coursework; personal = everything else. */
export type Kind = 'work' | 'school' | 'personal';

export interface Entry {
  /** Unique kebab-case id; also the thumbnail's file name. */
  id: string;
  kind: Kind;
  /** Project name; may include a role, e.g. "Voice Control Agent (Software Intern)". */
  title: string;
  /** Optional subtitle: job, lab, course, or studio, e.g. "Penn CIS 5650". */
  context?: string;
  /** Start month, or the only month for a one-off. */
  date: YearMonth;
  /** End month for a range; 'present' if ongoing. */
  end?: YearMonth | 'present';
  /** Plain text. The first ~2 lines show on the card; the rest is behind "Read more". */
  description: string;
  /** 16:9 image in public/media (800×450 .webp). Omit to show a placeholder. */
  thumbnail?: `/media/${string}`;
  /** Alt text for the thumbnail; defaults to the title. */
  thumbAlt?: string;
  /** Where the thumbnail links. HTTPS only (the site is HTTPS-only), or a root-relative path. */
  link?: `https://${string}` | `/${string}`;
  /** Shown as pills on the card and offered as search filters. */
  keywords: string[];
  /** Searchable but never displayed (synonyms, tools, older names). */
  hiddenKeywords?: string[];
}
