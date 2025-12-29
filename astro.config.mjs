// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://j-ochmann.github.io',
  base: '/astro', 

  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [
      [  rehypeMermaid,
        {
          // Tímto vynutíte světlé téma pro všechny diagramy
          mermaidConfig: {
            theme: 'default', 
          },
          // Pokud chcete, aby pozadí SVG bylo vždy bílé (ne průhledné)
          dark: false 
        }
      ],
    ]
  },
  integrations: [
    starlight({
      title: 'DevBook',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/j-ochmann' }
      ],
      sidebar: [
        /*{
          label: 'Guides',
          items: [
            { label: 'Example Guide', slug: 'guides/example' },
          ],
        },*/
        {
          label: 'Design Patterns',
          autogenerate: { directory: 'design_patterns' },
          collapsed: true // Sekce bude v menu defaultně zavřená
        },
      ],
    }),
  ],
});
