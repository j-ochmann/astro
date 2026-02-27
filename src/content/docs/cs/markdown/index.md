---
title: D2 - Declarative Diagramming
tableOfContents: false
sidebar:
  label: D2
  order: 2
category: Markdown
translation_status: original
---

- je moderní deklarativní jazyk pro tvorbu diagramů, který převádí text na vizuální schémata. Funguje podobně jako Mermaid.js nebo Graphviz – napíšete kód a nástroj z něj vygeneruje diagram (SVG, PNG nebo PDF).
- **Deklarativní přístup:** Popisujete co má v diagramu být (tvary, propojení), nikoliv jak se to má přesně vykreslit.
- **Použití v Markdownu:** V podporovaných editorech (např. VS Code s příslušným rozšířením) lze D2 diagramy vkládat přímo do Markdown souborů pomocí bloků kódu:

  ~~~markdown
  ```d2
  informatika: {
    umělá inteligence: {
      strojové učení: {
        hluboké učení
      }
    }
  }
  datová věda: {
    strojové učení: {
      hluboké učení
    }
  }
  ```
  ~~~

~~~d2
informatika: {
  umělá inteligence: {
    strojové učení: {
      hluboké učení
    }
  }
}
datová věda: {
  strojové učení: {
    hluboké učení
  }
}
~~~
