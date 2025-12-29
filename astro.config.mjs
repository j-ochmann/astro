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
          link: '/design_patterns/',
          items: [
            {
              label: 'Creational',
              autogenerate: { directory: 'design_patterns/creational/' },
              collapsed: true,
            },
            { label: 'Structural',
              autogenerate: { directory: 'design_patterns/structural/' },
              collapsed: true,
            },
            { label: 'Behavioral',
              autogenerate: { directory: 'design_patterns/behavioral' },
              collapsed: true,
            },
          ],
        },
        {
          label: 'External Resources',
          link: '/external_resources/',
        },
      ],
    }),
  ],
});
