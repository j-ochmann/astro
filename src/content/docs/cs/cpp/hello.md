---
title: "Jak na C v Linuxu: První program krok za krokem"
sidebar:
  label: První program
  order: 1
translation_status: original
---

## 1️⃣ Nainstalujte C kompilátor (gcc)

Otevřete terminál a zadejte:

```txt
sudo apt update
sudo apt install build-essential
```

Balík build-essential obsahuje:

- gcc (C kompilátor)
- make
- základní knihovny a hlavičky
  
Ověřte:

```txt
gcc --version
```

## 2️⃣ Vytvořte zdrojový soubor

Např. soubor hello_world.c:

```txt
nano hello_world.c
```

Do něj napište:
<!-- file: hello_world.c -->
```c
#include <stdio.h>

int main(void) {
    printf("Hello, world!\n");
    return 0;
}
```

Uložte:

- Ctrl + O
- Enter
- Ctrl + X
  
## 3️⃣ Přeložte program

V tom samém adresáři spusťte:

```txt
gcc hello_world.c -o hello_world
```

Co se stalo:

- hello_world.c → zdroják
- -o hello_world → výsledný spustitelný soubor hello_world

Zkontrolujte:

```txt
ls
```

Měl by tam být soubor hello_world

## 4️⃣ Spusťte program

```txt
./hello_world
```

Výstup:

```txt
Hello, world!
```

## 5️⃣ (Volitelné) Překlad s varováními – doporučeno

Pro správné návyky:

```txt
gcc -Wall -Wextra -Werror hello_world.c -o hello_world
```

To Vás donutí psát čistý a bezpečný C kód.

## 6️⃣ Co je dobré vědět hned od začátku

- main vždy vrací int
- `return 0;` = program skončil OK
- `stdio.h` je standardní knihovna pro vstup/výstup
- `./` říká shellu „spusť soubor z aktuálního adresáře“

```txt
nano read_number.c
```

<!-- file: read_number.c -->
```c
#include <stdio.h>
int main (void)
{
    int cislo;
    printf("Zadejte cele cislo: ");
    scanf("%d",&cislo);
    printf("Zadal jste: %d\n", cislo);
    return 0;
}
```

## Doporučená struktura projektu

Pokud chcete mít projekt organizovaný:

```text
projekt/
├── src/             # Váš zdrojový kód (.c, .cpp)
├── include/         # Vaše hlavičkové soubory (.h)
├── external/        # Cizí knihovny (např. md4c)
│   └── md4c/
│       ├── md4c.h
│       └── md4c.c
└── build/           # Výstupy kompilace (ignore v gitu)
```

__*Tip:*__
>Pro názvy složek používejte vždy malá písmena a místo mezer podtržítka nebo pomlčky,
>abyste se vyhnuli problémům s kompatibilitou na různých operačních systémech.

### YOLO workflow

vyčištění obrazovky, kompilace s kontrolou a spuštění

```txt
clear &&
gcc -Wall -Wextra -Werror hello.c -o hello &&
./hello
```
