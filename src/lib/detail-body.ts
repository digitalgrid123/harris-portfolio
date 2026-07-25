import { notFound } from "next/navigation";
import type { PostItem, NoteItem } from "@/config";
import {
  SAMPLE_PACKAGE_JSON,
  SAMPLE_PNPM_WORKSPACE,
  SAMPLE_TSCONFIG,
  SAMPLE_TSX,
  headingWithAnchor,
  shikiHtml,
} from "@/lib";

export type Item = PostItem | NoteItem;

export function buildBodyHtml(item: Item, kind: "post" | "note"): string {
  const title = item.title.toLowerCase();
  const isNote = kind === "note";

  const intro = `
    <p>
      When working on <strong>${
        isNote ? "small, daily improvements" : "medium-to-large features"
      }</strong>, we bump into the same kinds of trade-offs again and again.
      This ${kind === "note" ? "short note" : "post"} is a write-up of the exact
      setup I landed on for <em>${item.title.split(":")[0].split("—")[0].split("(")[0].trim()}</em>,
      why I chose it over alternatives, and what I would do differently the next time around.
    </p>
    <p>
      The short version: take the least magical approach that still scales, pay
      the cost of explicit configuration early, and let the compiler catch as
      many mistakes as it can.
    </p>
  `;

  let middle = "";

  if (title.includes("nextjs") || title.includes("rsc") || title.includes("next")) {
    middle = `
      ${headingWithAnchor(3, "Server Components Are the Default, Not the Exception")}
      <p>
        When a component doesn't need interactivity, I reach for a Server
        Component first. Sending fewer <code>kb</code> of JavaScript to the
        client is almost always a win, and the boundary makes it obvious where
        state lives.
      </p>
      <blockquote>
        <p>
          If a component can render at request time without a single
          <code>useState</code>, ship it as a Server Component — the refactor
          path to make it a Client Component later is mechanical.
        </p>
      </blockquote>
      ${shikiHtml(SAMPLE_TSX)}
    `;
  } else if (title.includes("tailwind") || title.includes("design")) {
    middle = `
      ${headingWithAnchor(3, "CSS Variables Instead of Design Tokens")}
      <p>
        Tailwind v4 pushes a lot of concerns back into CSS — and that's a good
        thing. Instead of spreading theme values across
        <code>tailwind.config</code>, I now declare them as CSS custom
        properties on <code>:root</code> and consume them with a single
        <code>theme()</code> helper.
      </p>
      <ol>
        <li>Define the palette using light/dark tokens.</li>
        <li>Link semantic tokens (<code>--fg</code>, <code>--c-bg</code>) to palette values.</li>
        <li>Reference only semantic tokens from component classes.</li>
      </ol>
    `;
  } else if (title.includes("form") || title.includes("zod") || title.includes("type")) {
    middle = `
      ${headingWithAnchor(3, "Parse, Don't Validate at the Edge")}
      <p>
        The best form libraries are the ones where the submission path looks
        exactly the same in the browser and on the server. Parse once with a
        single <code>z.object({ … })</code> schema, then reuse the inferred
        type everywhere.
      </p>
      ${shikiHtml(SAMPLE_PACKAGE_JSON)}
    `;
  } else if (title.includes("commit") || title.includes("git") || title.includes("github")) {
    middle = `
      ${headingWithAnchor(3, "One Change, One Commit")}
      <p>
        The goal of a smaller commit isn't a smaller diff line-count — it's a
        single, reviewable semantic change. When a commit has one job, it's
        easy to describe, easy to revert, and easy to bisect.
      </p>
      <ul>
        <li>A refactor that doesn't change behaviour — one commit.</li>
        <li>A behaviour change on top of that refactor — next commit.</li>
        <li>Cosmetic formatting — its own commit, labelled clearly.</li>
      </ul>
      <blockquote>
        <p>
          If the commit message needs the word "and", split it.
        </p>
      </blockquote>
    `;
  } else if (title.includes("monorepo") || title.includes("pnpm") || title.includes("catalog")) {
    middle = `
      ${headingWithAnchor(3, "Version Centralisation Beats Duplication")}
      <p>
        Keeping <code>react</code> in sync across a dozen packages is tedious
        until it's expressed once. Catalogs solve exactly that without
        inventing new files.
      </p>
      ${shikiHtml(SAMPLE_PNPM_WORKSPACE)}
    `;
  } else if (title.includes("svg") || title.includes("icon") || title.includes("shiki") || title.includes("favicon")) {
    middle = `
      ${headingWithAnchor(3, "Tighten the viewBox")}
      <p>
        SVGs almost always ship with generous internal padding. Cropping the
        <code>viewBox</code> to the actual path bounding box usually makes a
        16×16 icon feel twice as big without touching a single path.
      </p>
      <ul>
        <li>Measure the bbox of just the visible <code>path</code>/<code>g</code>.</li>
        <li>Replace the top-level <code>viewBox</code> with those numbers.</li>
        <li>Scale stroke-width by the same ratio.</li>
      </ul>
    `;
  } else if (title.includes("config") || title.includes("tsconfig") || title.includes("typescript") || title.includes("noemit")) {
    middle = `
      ${headingWithAnchor(3, "Preserve Module, Preserve Sanity")}
      <p>
        <code>module: preserve</code> is a bigger default than it looks. It
        turns TS into a pure type checker and lets the bundler own the
        transform — which is where the transform already lived.
      </p>
      ${shikiHtml(SAMPLE_TSCONFIG)}
    `;
  } else if (title.includes("prettier") || title.includes("eslint") || title.includes("lint") || title.includes("format")) {
    middle = `
      ${headingWithAnchor(3, "Formatting Is a Constraint, Not a Feature")}
      <p>
        When I stopped caring about formatting, the codebase stopped caring
        too. A linter with opinionated defaults covers the rest of the rules I
        used to spend an afternoon tuning.
      </p>
      ${shikiHtml(SAMPLE_PACKAGE_JSON)}
    `;
  } else if (title.includes("noise") || title.includes("background") || title.includes("canvas")) {
    middle = `
      ${headingWithAnchor(3, "Dots Beat Gradients")}
      <p>
        A subtle noise canvas at <code>-z-10</code> gives the page depth
        without fighting text contrast. Brighten on pointer proximity and
        keep the density just above the "I thought that was a dust spot"
        threshold.
      </p>
      <ol>
        <li>Generate positions using simplex noise, not a regular grid.</li>
        <li>Opacity responds to distance from the cursor, not raw proximity.</li>
        <li>Let dots idle slightly darker than you think — they should feel like texture.</li>
      </ol>
    `;
  } else if (title.includes("server") || title.includes("action") || title.includes("mutation")) {
    middle = `
      ${headingWithAnchor(3, "One Action, One Promise, One Revalidation")}
      <p>
        Server Actions work best when each exported function has exactly one
        responsibility. Tag, revalidate, and throw with a message the UI can
        show — keep the caller thin.
      </p>
      ${shikiHtml(SAMPLE_TSX)}
    `;
  } else if (title.includes("telemetry") || title.includes("disable") || title.includes("security")) {
    middle = `
      ${headingWithAnchor(3, "Opt Out Before You Opt In")}
      <p>
        The time to disable telemetry is <em>before</em> you start a new
        project's dev server, not six months later. Every tool that exposes
        an env var should have it set once at the system level.
      </p>
      <ul>
        <li><code>NEXT_TELEMETRY_DISABLED=1</code></li>
        <li><code>TURBO_TELEMETRY_DISABLED=1</code></li>
        <li><code>ASTRO_TELEMETRY_DISABLED=1</code></li>
      </ul>
    `;
  } else if (title.includes("oss") || title.includes("open source") || title.includes("shipping")) {
    middle = `
      ${headingWithAnchor(3, "Publish v0.0.1 On Day Two")}
      <p>
        The hardest part of any small utility is writing the README someone
        else can follow. Ship a skeleton that works for you, announce it
        quietly, and let issues pull the rest of the feature set.
      </p>
      <blockquote>
        <p>
          A utility with three stars and an honest changelog still beats the
          one that lives on your laptop forever.
        </p>
      </blockquote>
    `;
  } else {
    middle = `
      ${headingWithAnchor(3, "Start With the Boring Version")}
      <p>
        The fastest way to find out what you actually need is to implement
        the plain version first — no abstractions, no indirection, just the
        code that does the thing. The second pass writes itself once the
        real shape is visible.
      </p>
      ${shikiHtml(SAMPLE_TSCONFIG)}
    `;
  }

  const outro = `
    ${headingWithAnchor(3, "Wrapping Up")}
    <p>
      None of this is novel, and half of it I'll disagree with in six months.
      That's the useful part: a working record of the trade-offs I made and
      why. If you're trying a similar setup and something in here feels wrong,
      that's a signal worth following — trust the code that ships, not the
      code that sounds smart.
    </p>
    <p>
      Got a better way? I'd still take it. The next ${
        isNote ? "note" : "post"
      } I write will probably be the correction to this one.
    </p>
  `;

  return `${intro}${middle}${outro}`;
}

export function findItem<T extends Item>(items: readonly T[], slug: string) {
  const match = items.find((i) => i.slug === slug);
  if (!match) notFound();
  return match!;
}
