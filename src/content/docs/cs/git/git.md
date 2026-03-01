---
title: "Git na Linuxu: Od instalace po propojení s GitHubem"
sidebar:
  label: Git (Linux)
  order: 1
translation_status: original
---

## Instalace (Debian)

```bash
sudo apt update
sudo apt install git

```

- Git se pokusí odhadnout Váš e-mail podle hostname systému (např. uzivatel@linux-pc), což asi nechcete, protože se Vám pak commit nespáruje s profilem.
opravte to:
  
```bash
git config --global user.name "vaše jméno"
git config --global user.email "vas@email.com"
```

## Vytvoření lokálního repozitáře

Přejděte do adresáře vašeho projektu:

```bash
cd /cesta/k/vasemu/projektu
git init  # Inicializuje Git v projektu
```

> **Tip:** Tenhle kousek kódu doporučuji vložit hned po `git init`, ještě než poprvé napíšete `git add .`. V terminálu zadejte ve složce repozitáře `nano .gitignore`, vložte tento obsah a uložte `(Ctrl+O, Enter, Ctrl+X)`:

```bash
### Jazyky a frameworky ###
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
*.log                    # Logy aplikací
```

### Proč je ten univerzální .gitignore „bezpečnostní balíček“ důležitý?

- `git add .` do světa vypustí i věci, které tam nepatří
- **zpomalení:** Nahrávat tisíce souborů v node_modules trvá věčnost.
- **bezpečnost:** Pokud omylem pushnete .env s heslem k databázi, může ho kdokoli zneužít.
- **nepořádek:** Ostatním v týmu by se Vaše osobní nastavení editoru (např. z .vscode/) pletlo do jejich práce.

>**Tip:** Pokud jste již něco pushli a pak to přidal do .gitignore, Git to bude dál sledovat. Musí se to „vymazat z paměti“ příkazem: `git rm -r --cached .` a pak znovu `git add .`

## Můžete pokračovat tvorbou lokálního repozitáře

```bash
git add . # Přidá všechny soubory do "staging" oblasti
git commit -m "Počáteční commit projektu"
```

## Vytvoření repozitáře na GitHubu

Přihlaste se na GitHub. Klikněte na nový repozitář „New repository“ a pojmenujte ho.

## Nastavení SSH

Vygenerujte SSH klíč:

```bash
ssh-keygen -t ed25519 -C "váš@email.com"
cat ~/.ssh/id_ed25519.pub
```

- Zkopírujte obsah souboru ~/.ssh/id_ed25519.pub.
- Vložte klíč do nastavení GitHub (Settings -> SSH and GPG keys).
- Po nastavení SSH můžete používat `git@github.com:uživatel/repozitář.git` místo HTTPS.

### Propojení a nahrání na GitHub

Zkopírujte a přidejte URL vašeho GitHub repozitáře.

```bash
git remote add origin git@github.com:uživatel/repozitář.git
```

Přejmenujte aktuální větev master na main:

```bash
git branch -M main
```

Pushněte (nahrajte) lokální kód na GitHub:

```bash
git push -u origin main # nebo master, záleží na názvu hlavní větve
```

### YOLO workflow

```bash
clear &&
git add . &&
git commit -m "gc" &&
git push
```

Pokud si chcete zjednodušit život, přidejte si to do Git Aliases nebo do .bashrc jako funkci.

```bash
# Přidejte do ~/.bashrc nebo ~/.zshrc
function gcp() {
  clear && git add . && git commit -m "${1:-gc}" && git push origin $(git rev-parse --abbrev-ref HEAD)
}
```

Pak stačí psát jen `gcp "whatever fix... "` a pokud zprávu zapomenete, použije se "gc".

> **Tip:** Pokud chcete být ultra-líní, pojmenujte funkci jen p (jako push).

Po vložení do ~/.bashrc nezapomeňte spustit source ~/.bashrc (nebo restartovat terminál), ať se změny načtou.

**Zabezpečení:** Pokud pracujete v týmu, dejte si pozor na git add ., ať omylem nepushnete .env soubory nebo node_modules (pokud je nemáte v .gitignore).
