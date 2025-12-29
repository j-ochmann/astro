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
        {
          label: 'Quick Reference',
          autogenerate: { directory: 'quick_reference' },
          collapsed: true
        },
        {
          label: 'Design Patterns',
          link: 'design_patterns',
          collapsed: true,
          items: [
             { label: 'Creational', slug: 'design_patterns/creational' },
             { label: 'Structural', slug: 'design_patterns/structural' },
             { label: 'Behavioral', slug: 'design_patterns/behavioral' },
          ],
        },
        {
          label: 'External Resources',
          autogenerate: { directory: 'external' },
          collapsed: true
        },
      ],
    }),
  ],
});
