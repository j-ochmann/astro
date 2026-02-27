---
title: "Git na Linuxu: Od instalace po propojení s GitHubem"
sidebar:
  label: Git (Linux)
  order: 1
content_hash: 4b292a895a9d5dd88aba53e8d3ff85cc
translation_status: original
---

## Instalace (Debian)

```txt
sudo apt update
sudo apt install git

```

## Vytvoření lokálního repozitáře

Přejděte do adresáře vašeho projektu:

```txt
cd /cesta/k/vasemu/projektu
git init  # Inicializuje Git v projektu
git add . # Přidá všechny soubory do "staging" oblasti
git commit -m "Počáteční commit projektu"
```

## Vytvoření repozitáře na GitHubu

Přihlaste se na GitHub. Klikněte na nový repozitář „New repository“ a pojmenujte ho.

### Propojení a nahrání na GitHub

Zkopírujte a přidejte URL vašeho GitHub repozitáře.

```txt
git remote add origin github.com:uživatel/repozitář.git
```

Pushněte (nahrajte) lokální kód na GitHub:

```txt
git push -u origin main # nebo master, záleží na názvu hlavní větve
```

Pokud název větve neodpovídá, může se oběvit chyba:

```txt
error: src refspec main does not match any
error: failed to push some refs to 'github.com:uživatel/repozitář.git'
```

Opravte přejmenováním aktuální věteve master na main:

```txt
git branch -M main
```

Všimněte si varování u commitu.

- Git automaticky nastavil e-mail.
- Pokud chcete, aby se u commitů na GitHubu zobrazovala vaše správná vizitka a profilový obrázek, opravte to:
  
```txt
git config --global user.name "vaše jméno"
git config --global user.email "vas@email.com"
git commit --amend --reset-author
```

## Krok 5: Nastavení SSH (Doporučeno)

Vygenerujte SSH klíč:

```txt
ssh-keygen -t ed25519 -C "váš@email.com".
```

- Zkopírujte obsah souboru ~/.ssh/id_ed25519.pub.
- Vložte klíč do nastavení GitHub (Settings -> SSH and GPG keys).
- Po nastavení SSH můžete používat `git@github.com:uživatel/repozitář.git` místo HTTPS.
