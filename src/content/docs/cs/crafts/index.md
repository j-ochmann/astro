---
title: "⚡ Základy"
description: "Moje poznámky k oprášení elektro – byty, rozvaděče, fotovoltaika"
---
## 🏠 Síť (AC)

- napětí: 230V / 400V  
- frekvence: 50 Hz  
- TN-C / TN-S soustavy  

### ➰ Vodiče

- **L (fáze)** → hnědá / černá → nebezpečné napětí  
- **N (nulák)** → modrá → návrat proudu  
- **PE (zem)** → žlutozelená → ochranný vodič  

### 🔌 Zásuvka

- **L (fáze)** → pravá svorka  
- **N (nulák)** → levá svorka  
- **PE (zem)** → kolík

### 💡 Vypínač

- přerušuje **(L) fázi**  
- nulák se nepřerušuje  

### ⚡ Rozvaděč (základní prvky)

- hlavní jistič  
- **jističe okruhů** → ochrana proti přetížení / zkratu  
- **proudový chránič (RCD)** → ochrana osob
- sběrnice N a PE
- N za chráničem nesmí být spojen s PE
- každý okruh má vlastní jistič

```txt
 L  N  PE
 |  |  |
 |  |  +-------> PE sběrnice
 |  +----------> RCD (chránič) ---> N sběrnice
 +-------------> Jističe ---> okruhy (zásuvky, světla)
```

#### Časté chyby

- špatně zapojený N za chráničem
- propojení N a PE za proudovým chráničem
- nedotažené spoje
- odhalené vodiče

## ☀️ FOTOVOLTAIKA (FVE)

```txt
[ PANELY ]
     │ (DC)
     ▼
[ DC kabely + MC4 ]
     │
     ▼
[ STŘÍDAČ ]
     │ (AC)
     ▼
[ ROZVADĚČ ]
     │
     ▼
[ DŮM / SÍŤ ]
```

### 🔋 DC část

- panely → **stejnosměrný proud (DC)**
  - ⚠️ stále pod napětím i při slabém světle
  - stringy (série)  
  - napětí roste
  - proud zůstává stejný
- kabely → (+)červená, (-)černá  
- konektory → MC4  

⚠️ Pozor:

- při světle jsou panely stále pod napětím  

### 🔌 AC část

- střídač → převod DC → AC  
- napojení do rozvaděče
- synchronizace se sítí

## ⚠️ FVE bezpečnost

- DC nelze „vypnout“ jističem  
- vždy pod napětím při světle  
- pozor na polaritu  
- oblouk při rozpojení, nerozpojovat pod zátěží
- používat správné konektory  

## 🧰 PRAKTICKÉ VĚCI

- tahání kabelů (rovně, přehledně)
- odizolování bez poškození vodiče  
- práce se zkoušečkou  
- označení vodičů  

## ⚠️ BEZPEČNOST

- vypnout jistič před prací  
- ověřit beznapěťový stav  
- nepracovat „naslepo“  
- raději se zeptat než udělat chybu  

## 🧠 ZÁKLADNÍ POJMY

- **AC** = střídavý proud (zásuvky)  
- **DC** = stejnosměrný proud (panely)  
- fáze = vodič pod napětím  
- zem = ochranný vodič  

## 📜 KVALIFIKACE

- Vyhláška 50/1978 Sb. → neplatí  
- aktuálně: Nařízení vlády 194/2022 Sb.  

Úrovně:

- seznámená  
- poučená  
- znalá

Poznámka:

- bez kvalifikace práce pod dohledem  

## 🎯 CÍL

- zopakovat základy
