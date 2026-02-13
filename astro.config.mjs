import tailwindcss from "@tailwindcss/vite";
import path from 'path';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import icon from 'astro-icon';
import rehypeMermaid from 'rehype-mermaid';
import d2 from 'astro-d2';
import react from '@astrojs/react';
import '@fontsource/syne/700.css';

import { locales } from './src/content/config/i18n.ts';

export default defineConfig({
  site: 'https://j-ochmann.github.io',
  base: '/', 
  redirects: {
    '/': '/en/',
  },
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid', 'd2'],
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
    react(), 
    d2(), 
    icon(), 
    starlight({
      title: 'Jindřich Ochmann - Software Engineer',
      favicon: '/favicon.png', 
      customCss: [
        '@fontsource/syne/400.css',
        '@fontsource/syne/700.css',
        './src/styles/globals.scss',
      ],
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'google-site-verification',
            content: 'Ckax2z86O63zqfKByYNbkFo2q0C-rmFhUQnvEZxo0qM',
          },
        },
      ],
      defaultLocale: 'en',
      locales: locales,
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/j-ochmann' },
        { icon: 'rss', label: 'RSS', href: '/rss.xml' },
      ],
      components: {
        ThemeSelect: './src/components/starlight/ThemeSelect.astro',
        LanguageSelect: './src/components/starlight/LanguageSelect.astro',
        Search: './src/components/Search.astro',
        Header: './src/components/starlight/Empty.astro',
        MobileMenuToggle: './src/components/starlight/Empty.astro',
        RightSidebar: './src/components/starlight/Empty.astro',
        MobileTableOfContents: './src/components/starlight/Empty.astro',
        Sidebar: './src/components/starlight/Sidebar.astro'
      },
      sidebar: [
        { 
          label: 'Dev',
          translations: { cs: 'Dev' },
          collapsed: true,
          items: [
            { label: 'Quick Reference',
              translations: { cs: 'Taháky' },
              autogenerate: { directory: 'quick_reference' },
              collapsed: true },
            { label: 'Tutorials',
              translations: { cs: 'Tutorialy' },
              autogenerate: { directory: 'tutorials' },
              collapsed: true },
            { label: 'Design Patterns',
              translations: { cs: 'Návrhové vzory' },
              collapsed: true,
              items: [
                { label: 'Overview',
                  translations: { cs: 'Přehled' },
                  link: '/design_patterns/' },
                { label: 'Creational',
                  translations: { cs: 'Tvůrčí' },
                  autogenerate: { directory: 'design_patterns/creational/' },
                  collapsed: true },
                { label: 'Structural',
                  translations: { cs: 'Strukturální' },
                  autogenerate: { directory: 'design_patterns/structural/' },
                  collapsed: true },
                { label: 'Behavioral',
                  translations: { cs: 'Behaviorální' },
                  autogenerate: { directory: 'design_patterns/behavioral' },
                  collapsed: true },
              ], },
            { label: 'External Resources',
              translations: { cs: 'Externí materiály' },
              link: '/external_resources/', },
            { label: 'Courses',
              translations: { cs: 'Kurzy' },
              link: '/courses/',
              badge: 'Free', },
            { label: 'Artificial Intelligence',
              translations: { cs: 'Umělá inteligence' },
              link: '/ai/', },
            { label: 'Examples',
              translations: { cs: 'Ukázky' },
              autogenerate: { directory: 'examples/' },
              collapsed: true }
          ],
        },
        { 
          label: 'Geo',
          translations: { cs: 'Geo' },
          collapsed: true,
          items: [
            { 
              label: 'World Atlas', 
              translations: { cs: 'Atlas světa' },
              link: '/countries/' 
            },
            { 
              label: 'Languages', 
              translations: { cs: 'Jazyky' },
              link: '/countries/languages/' 
            },
            { 
              label: 'Currencies', 
              translations: { cs: 'Měny' },
              link: '/countries/currencies/' 
            },
            { 
              label: 'Notes & Articles',
              translations: { cs: 'Poznámky a články' },
              autogenerate: { directory: 'geo' } 
            }
          ]
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src')
      },
    },
  },
});