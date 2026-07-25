type ShikiSpan = { text: string; c?: string };
type ShikiLine = ShikiSpan[];

const darkFg = "#dbd7caee";
const lightFg = "#393a34";
const muted = { dark: "#666666", light: "#999999" };
const keyName = { dark: "#B8A965", light: "#998418" };
const keyNameSoft = { dark: "#B8A96577", light: "#99841877" };
const str = { dark: "#C98A7D", light: "#B56959" };
const strSoft = { dark: "#C98A7D77", light: "#B5695977" };
const comment = { dark: "#758575DD", light: "#A0ADA0" };
const tagName = { dark: "#4C9A91", light: "#2F798A" };

function span(text: string, color?: { dark: string; light: string }) {
  if (!color) return { text };
  const style = `--s-dark: ${color.dark}; --s-light: ${color.light};`;
  return { text, c: style };
}

function spans(parts: [string, { dark: string; light: string } | undefined][]): ShikiLine {
  return parts.map(([t, c]) => span(t, c));
}

function lineStyle(line: ShikiLine): string {
  return line
    .map(
      (s) =>
        s.c
          ? `<span style="${s.c}">${s.text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`
          : s.text.replace(/&/g, "&amp;").replace(/</g, "&lt;"),
    )
    .join("");
}

export type ShikiCodeBlock = {
  lang: "json" | "yaml" | "ts" | "bash" | "tsx";
  lines: ShikiLine[];
};

export function shikiHtml(block: ShikiCodeBlock): string {
  const theme = `--s-dark: ${darkFg}; --s-light: ${lightFg}; --s-dark-bg: #121212; --s-light-bg: #ffffff;`;
  const inner = block.lines.map((l) => `<span class="line">${lineStyle(l)}</span>`).join("");
  return `<pre class="shiki shiki-themes vitesse-dark vitesse-light" tabindex="0" style="${theme}"><code class="language-${block.lang}">${inner}</code></pre>`;
}

export const SAMPLE_PACKAGE_JSON: ShikiCodeBlock = {
  lang: "json",
  lines: [
    spans([["{", muted]]),
    spans([
      ['  "', keyNameSoft],
      ["name", keyName],
      ['"', keyNameSoft],
      [":", muted],
      [' "', strSoft],
      ["my-cool-nextjs-site", str],
      ['"', strSoft],
      [",", muted],
    ]),
    spans([
      ['  "', keyNameSoft],
      ["dependencies", keyName],
      ['"', keyNameSoft],
      [":", muted],
      [" {", muted],
    ]),
    spans([
      ['    "', keyNameSoft],
      ["next", keyName],
      ['"', keyNameSoft],
      [":", muted],
      [' "', strSoft],
      ["^16.2.0", str],
      ['"', strSoft],
    ]),
    spans([["  },", muted]]),
    spans([
      ['  "', keyNameSoft],
      ["devDependencies", keyName],
      ['"', keyNameSoft],
      [":", muted],
      [" {", muted],
    ]),
    spans([
      ['    "', keyNameSoft],
      ["typescript", keyName],
      ['"', keyNameSoft],
      [":", muted],
      [' "', strSoft],
      ["^5.8.0", str],
      ['"', strSoft],
    ]),
    spans([["  }", muted]]),
    spans([["}", muted]]),
  ],
};

export const SAMPLE_PNPM_WORKSPACE: ShikiCodeBlock = {
  lang: "yaml",
  lines: [
    spans([["# pnpm-workspace.yaml", comment]]),
    spans([["catalogs", keyName], [":", muted]]),
    spans([["  frontend", keyName], [":", muted]]),
    spans([["    next", keyName], [":", muted], [" ^16.2.0", str]]),
    spans([["    react", keyName], [":", muted], [" 19.1.0", tagName]]),
    spans([["  prod", keyName], [":", muted]]),
    spans([["    zod", keyName], [":", muted], [" ^3.24.0", str]]),
  ],
};

export const SAMPLE_TSCONFIG: ShikiCodeBlock = {
  lang: "json",
  lines: [
    spans([["{", muted]]),
    spans([
      ['  "', keyNameSoft],
      ["compilerOptions", keyName],
      ['"', keyNameSoft],
      [":", muted],
      [" {", muted],
    ]),
    spans([
      ['    "', keyNameSoft],
      ["module", keyName],
      ['"', keyNameSoft],
      [":", muted],
      [' "', strSoft],
      ["preserve", str],
      ['"', strSoft],
      [",", muted],
    ]),
    spans([
      ['    "', keyNameSoft],
      ["strict", keyName],
      ['"', keyNameSoft],
      [":", muted],
      [" true", tagName],
    ]),
    spans([["  }", muted]]),
    spans([["}", muted]]),
  ],
};

export const SAMPLE_TSX: ShikiCodeBlock = {
  lang: "tsx",
  lines: [
    spans([["type", undefined], [" Props", undefined], [" = {", muted]]),
    spans([["  slug:", undefined], [" string", tagName], [";", muted]]),
    spans([["  title:", undefined], [" string", tagName], [";", muted]]),
    spans([["};", muted]]),
    spans([]),
    spans([["export async function", undefined], [" Page(", undefined], ["{ slug }:", undefined], [" Props", tagName], [") {", muted]]),
    spans([["  return", undefined], [" <h1>", muted], ["{slug}", undefined], ["</h1>;", muted]]),
    spans([["}", muted]]),
  ],
};

export function anchorLinkFor(heading: string) {
  const id = heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `<a class="header-anchor" href="#${id}" aria-hidden="true">#</a>`;
}

export function headingWithAnchor(level: 2 | 3 | 4, text: string) {
  const id = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `<h${level} id="${id}" tabindex="-1">${text} ${anchorLinkFor(text)}</h${level}>`;
}
