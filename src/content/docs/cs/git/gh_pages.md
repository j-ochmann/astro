---
title: GitHub Pages
sidebar:
  label: GitHub Pages
  order: 2
translation_status: original
---

1. Vytvořte úložiště
    - název úložiště: username.github.io
    - musí být nastaveno jako veřejné
    - zaškrtněte Přidat soubor README
2. Nahrajte obsah webových stránek
    - index.html (hlavní stránka webu)
    - provést změny a uložit je.
3. Aktivujte stránky GitHub
    - Záložka Nastavení v horní nabídce úložiště
    - "Stránky" v levém panelu v sekci "Kód a automatizace".
    - v "Sestavení a nasazení" v části Zdroj vyberte Nasadit z větve
    - v rozevíracím seznamu pod větví vyberte hlavní (nebo hlavní) větev a složku / (kořenovou).
    - klikněte na tlačítko Uložit.
4. Zveřejněte web
    - Po uložení se v horní části sekce "Stránky" objeví lišta s informacemi o probíhajícím nasazení.
    - Během několika minut (obvykle do 10) se zobrazí potvrzení,
      že je web online spolu s jeho adresou: username.github.io.

## Důležitá omezení

Stránky GitHub podporují pouze statické webové stránky (HTML, CSS, JavaScript, frameworky jako React nebo Angular).
Nepodporuje jazyky na straně serveru jako PHP, Python (Django/Flask) nebo databáze.

## Stránky GitHub můžete vytvářet pomocí Markdown (.md)

   GitHub má integrovaný generátor Jekyll,
   který tyto soubory automaticky převede na webové stránky.

## Zde jsou hlavní způsoby, jak to udělat

1. Rychlá metoda pomocí výběru motivu (nejjednodušší)
Tato metoda nevyžaduje žádné kódování, potřebujete pouze jeden soubor .md:
Vytvořte soubor README.md nebo index.md v úložišti.
Přejděte do Nastavení -> Stránky.
V části „Sestavení a nasazení“ klikněte na tlačítko Vybrat motiv (pokud není zobrazeno, ujistěte se, že máte jako zdroj nastaveno Nasazení z větve).
Vyberte téma a potvrďte. GitHub automaticky vytvoří soubor _config.yml, který propojí Markdown s vybranou šablonou.
2. Vlastní struktura s Jekyllem
Pokud chcete mít nad webem větší kontrolu, můžete si soubory Markdown uspořádat sami:
index.md: Stane se hlavní stránkou (index.html).
kontakt.md: Automaticky se převede na uzivatel.github.io/kontakt.html.
Úvodní látka: Na začátek každého souboru .md můžete přidat metadata (např. název stránky nebo šablonu):

```markdown
---
layout: post
název: Moje první stránka
---
Zde píšete klasický text Markdown...
```

Výhody a omezení v roce 2025:
Automatizace: Kdykoli upravíte soubor .md a uložíte změny (commit), webová stránka se během chvilky automaticky aktualizuje.
Vzhled: Bez vybraného motivu bude web vypadat jako prostý text. Proto se doporučuje vždy vybrat motiv v nastavení stránek.
Pokročilé nástroje: Pro dokumentaci můžete také použít specializované generátory jako mdBook, které také pracují čistě s Markdown a jsou podporovány GitHubem.

## Stránky GitHub

- [j-ochmann.github.io](https://j-ochmann.github.io/)
- používá akce Jekyll a GitHub.
- **docs/index.md** je převeden z Markdown do HTML a zabalen do výchozího motivu Jekyll.

## Jak změnit téma (nejrychlejší způsob)

V kořenovém adresáři úložiště (nebo v /docs) vytvořte nebo upravte soubor:
**📄 _config.yml**

```yaml
název: Jindřich Ochmann
popis: Vývoj, jazyky, projekty
téma: jekyll-theme-hacker
```

Commit → push → hotovo.

Několik použitelných témat:

```txt
jekyll-theme-minimal
jekyll-theme-hacker
jekyll-theme-cayman
jekyll-theme-midnight
jekyll-theme-slate
jekyll-theme-dinky
```

## Obsah

Doporučená struktura:

```text
docs/
├── _config.yml
├── index.md
├── assets/
│ └── img/
└── _layouts/
```

`index.md`

``` md
---
rozložení: výchozí
název: Úvod
---

#Ahoj 👋
Jmenuji se **Jindřich Ochmann**

- programování
- jazyky
- experimenty
```

>⚠️ **YAML** blok **`---`** je důležitý!

## Navigace (horní nabídka)

V `_config.yml`:

```yaml
název: Jindřich Ochmann
téma: jekyll-theme-cayman

navigace:
  - název: Domů
    url: /
  - název: Projekty
    url: /projekty
  - název: O mně
    url: /about
```

A odpovídající soubory:

```text
projekty.md
o.md
```

## Vlastní CSS

1. Vytvořte soubor: `docs/assets/css/style.scss`
2. Obsah:

```scss
---
---

@import "{{ site.theme }}";

tělo {
  font-family: system-ui, sans-serif;
}

h1 {
  barva: #ff6600;
}
```

GitHub Pages rozpozná SCSS a přepíše výchozí styl motivu
