---
title: "Nadpis 1 (největší)"
tableOfContents: false
sidebar:
  label: Markdown Tahák
  order: 4
category: markdown
translation_status: original
---

## Nadpis 2

### Nadpis 3

#### Nadpis 4

##### Nadpis 5

###### Nadpis 6 (nejmenší)

1. Nadpisy

    - 1 až 6 # křížků na začátku řádku určuje úroveň:

        ~~~markdown
        # Nadpis 1

        ## Nadpis 2

        ### Nadpis 3

        #### Nadpis 4

        ##### Nadpis 5

        ###### Nadpis 6 (nejmenší)
        ~~~

2. Formátování
    - **tučné** obalte **\*\*hvězdičkami\*\*** nebo __\_\_podtržítky\_\___
    - _kurzívu_ obalte _\*hvězdičkou\*_ nebo _\_podtržítkem\__.
    - ~~přeškrtnutí~~ obalte \~\~vlnovkami\~\~.

3. Seznamy
    - __odrážkový:__ **`-`** nebo **`+`** následované mezerou
    - __číslovaný:__ číslice s tečkou (např. **`1.`** ) a mezerou
4. Odkazy a obrázky
    - **odkaz:** `[Text odkazu](URL adresa)` – např. `[Google](https://www.google.com)`
    - **obrázek:** `![Popis obrázku](URL adresa obrázku)`
5. Kód a citace
    - **blokový kód:** Text obalte trojitými zpětnými apostrofy ` ``` ` na samostatných řádcích.

        ~~~markdown
        ```python
        print("hello")
        ```
        ~~~

        Pokud potřebujete vkládat Markdown do Markdownu, můžete:

        a) přidávat apostrofy

        ~~~~txt
        ````markdown
        ```python
        print("hello")
        ```
        ````
        ~~~~

        b) použít **`~~~`** vlnobití

        ~~~~txt
        ~~~markdown
        ```python
        print("hello")
        ```
        ~~~
        ~~~~

        c) kombinovat

        ~~~~~txt
        ~~~~txt
        ~~~markdown
        ```python
        print("hello")
        ```
        ~~~
        ~~~~
        ~~~~~

    - **inline kód:** Text v řádku obalte jedním zpětným apostrofem `` ` ``. Také můžete obalovat více apostrofy ``` `` ` `` ```.
    > **citace:** Na začátek řádku vložte znak větší než `>`.

6. Tabulky
    - se tvoří pomocí svislic | pro sloupce a pomlček - pro oddělení hlavičky:

        ~~~markdown
        | Záhlaví 1 | Záhlaví 2 |
        | --------- | --------- |
        | Text      | Data      |
        ~~~

        | Záhlaví 1 | Záhlaví 2 |
        | --------- | --------- |
        | Text      | Data      |

Podrobný přehled syntaxe naleznete v [dokumentaci Markdown Guide](www.markdownguide.org).
Pro pohodlné psaní můžete využít online editor [StackEdit](stackedit.io).
>GitHub specifická 'příchuť' Markdown: [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
