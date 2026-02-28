---
title: 'Publish to GitHub'
sidebar:
  label: VS Code
  order: 1
translation_status: original
---
Je nejrychlejší způsob, jak vytvořit nový repozitář přímo z prostředí VS Code na Debianu.

**Postup:**

1. Ve VS Code otevřete složku se svým projektem.

2. Přejděte do sekce Source Control (ikona větvení v levém panelu nebo zkratka Ctrl + Shift + G).

3. Klikněte na modré tlačítko Publish to GitHub.

    >**Tip:** Pokud tlačítko nevidíte, stiskněte `F1` (nebo `Ctrl + Shift + P`) a napište příkaz `Publish to GitHub`.

4. Zvolte, zda má být repozitář Public (veřejný) nebo Private (soukromý).

5. Vyberte soubory, které chcete zahrnout do prvního commitu, a potvrďte.

**VS Code** za vás automaticky inicializuje lokální Git, vytvoří repozitář na vašem GitHub účtu, nastaví vzdálený přístup (remote) a odešle (push) první commit.

```bash
sudo apt update
sudo apt upgrade
sudo apt install git nodejs npm
git --version
```

`cd /cesta/k/vasemu/projektu`

```bash
mkdir dockerized-ts-pg   # Vytvoří složku projektu
cd dockerized-ts-pg      # Přesunete se do složky projektu
git init                 # Inicializuje Git v projektu
echo "### Jazyky a frameworky ###
node_modules/            # Závislosti pro JavaScript/Node.js
__pycache__/             # Kompilovaný Python kód
*.py[cod]                # Python soubory
.venv/                   # Virtuální prostředí Pythonu
venv/
target/                  # Buildy pro Rust/Java

### Bezpečnost (NEPUSHLOVAT!) ###
.env                     # API klíče, hesla a tajné proměnné
*.pem                    # Soukromé klíče
auth.json                # Autentizační tokeny

### Operační systém a IDE ###
.DS_Store                # MacOS smetí
Thumbs.db                # Windows smetí
.vscode/                 # Nastavení VS Code (pokud ho nechceš sdílet)
.idea/                   # Nastavení JetBrains (PyCharm, IntelliJ)
*.swp                    # Dočasné soubory editoru Vim
dist/                    # Výsledné buildy
build/
*.log                    # Logy aplikací" > .gitignore
cat .gitignore
```

 Dockerfile docker-compose.yml

```bash
git add .      # Přidá všechny soubory do "staging" oblasti
git commit -m "Počáteční commit projektu"

npm init -y    #vytvoří package.json

# Instalace TypeScriptu a vývojových nástrojů
npm install typescript ts-node nodemon @types/node prisma --save-dev

npx tsc --init  #vytvoří tsconfig.json
# npx prisma init #vytvoří schema.prisma
npx prisma init --datasource-provider postgresql
```
