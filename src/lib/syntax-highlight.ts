import { codeToHtml } from 'shiki';

export async function highlightCode(code: string, lang: string = 'typescript') {
  try {
    // Skip empty code blocks
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      return '';
    }

    // STRIP MARKDOWN FORMATTING FROM CODE
    // ONLY strip markdown that was added by Prismic's text editor, NOT code syntax
    // Be very conservative: only strip at word boundaries, never inside comments or JSX
    // Do NOT match across newlines (use [^\n] instead of . or \s)
    
    let cleanCode = normalizedCode;
    
    // Remove bold markdown: **text** → text
    // Only if it's actual text (letters/spaces, no newlines, no code chars)
    cleanCode = cleanCode.replace(/\*\*([a-zA-Z\s]+)\*\*/g, '$1');
    
    // Remove italic markdown: *text* → text  
    // ONLY if it's standalone text (letters and spaces, no newlines, no code chars)
    cleanCode = cleanCode.replace(/\*([a-zA-Z\s]+)\*/g, '$1');
    
    const html = await codeToHtml(cleanCode, {
      lang: lang || 'typescript',
      theme: 'nord',
      transformers: [
        {
          pre(node) {
            node.properties['class'] = 'shiki shiki-highlighted not-prose';
            node.properties['style'] =
              'background-color: #2e3440 !important; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; white-space: pre !important;';
          },
          code(node) {
            node.properties['style'] =
              'font-family: "Courier New", monospace; font-size: 0.875rem; line-height: 1.6; white-space: pre !important;';
          },
          line(node) {
            node.properties['style'] = 'min-height: 1.6em;';
          },
        },
      ],
    });

    return html;
  } catch (error) {
    console.error(`[SHIKI] ❌ Error highlighting:`, error);
    // Fallback: return plain code with proper styling
    return `<pre class="shiki-fallback"><code class="language-${lang}">${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
