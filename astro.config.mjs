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
      [rehypeMermaid, {
          strategy: 'img-svg',
          mermaidConfig: {
            theme: 'default', 
          },
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
          collapsed: true,
        },
        {
          label: 'Design Patterns',
          collapsed: true,
          items: [
             { label: 'Overview', link: '/design_patterns/' },
             { label: 'Creational', link: '/design_patterns/creational/' },
             { label: 'Structural', link: '/design_patterns/structural/' },
             { label: 'Behavioral', link: '/design_patterns/behavioral/' },
          ],
        },
        {
          label: 'External Resources',
          autogenerate: { directory: 'external' },
          collapsed: true,
        },
      ],
    }),
  ],
});
