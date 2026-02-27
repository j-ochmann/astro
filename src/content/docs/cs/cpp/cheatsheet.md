---
title: C++ Rychlý Přehled
sidebar:
  label: Tahák
  order: 2
category: programming
tags:
  - cpp
  - programming
content_hash: b14d44716eb57d8573fadba1a56bded6
translation_status: original
---
## Preprocesor

```cpp
                    // Komentář do konce řádku
                    /* Víceřádkový komentář */ 
#include <stdio.h>  // Vloží standardní hlavičkový soubor
#include "myfile.h" // Vloží soubor z aktuálního adresáře
#define X some text // Nahradí X nějakým textem
#define F(a,b) a+b  // Nahradí F(1,2) s 1+2
#define X \
  some text         // Pokračování řádku
#undef X            // Odstraní definici
#if defined(X)      // Podmíněná kompilace (#ifdef X)
#else               // Volitelné (#ifndef X nebo #if !defined(X))
#endif              // Povinné po #if, #ifdef
```

## Literály

```cpp
255, 0377, 0xff             // Celá čísla (desítková, osmičková, šestnáctková)
2147483647L, 0x7fffffffl    // Dlouhá (32bitová) celá čísla
123.0, 1.23e2               // double (reálná) čísla
'a', '\141', '\x61'         // Znak (literál, osmičkový, šestnáctkový)
'\n', '\\', '\'', '"'      // Nový řádek, zpětné lomítko, jednoduchá uvozovka, dvojitá
                            // uvozovka
"string\n"                  // Pole znaků končící novým řádkem a \0
"hello" "world"             // Zřetězené řetězce
true, false                 // bool konstanty 1 a 0
```

## Deklarace

```cpp
int x;                  // Deklaruje x jako celé číslo (hodnota nedefinovaná)
int x=255;              // Deklaruje a inicializuje x na 255
short s; long l;        // Obvykle 16 nebo 32 bitové celé číslo (int může být obojí)
char c='a';             // Obvykle 8 bitový znak
unsigned char u=255; signed char s=-1; // char může být jedno nebo druhé
unsigned long x=0xffffffffL;           // short, int, long jsou znaménkové
float f; double d;      // Reálné číslo s jednoduchou nebo dvojitou přesností (nikdy unsigned)
bool b=true;            // true nebo false, lze také použít int (1 nebo 0)
int a, b, c;            // Vícenásobné deklarace
int a[10];              // Pole 10 intů (a[0] až a[9])
int a[]={0,1,2};        // Inicializované pole (nebo a[3]={0,1,2}; )
int a[2][3]={{1,2,3},{4,5,6}}; // Pole polí intů
char s[]="hello";       // Řetězec (6 prvků včetně '\0')
int* p;                 // p je ukazatel na (adresa) int
char* s="hello";        // s ukazuje na nepojmenované pole obsahující "hello"
void* p=NULL;           // Adresa netypované paměti (NULL je 0)
int& r=x;               // r je reference na (alias) int x
enum weekend {SAT,SUN}; // weekend je typ s hodnotami SAT a SUN
enum weekend day;       // day je proměnná typu weekend
enum weekend {SAT=0,SUN=1}; // Explicitní reprezentace jako int
enum {SAT,SUN} day;     // Anonymní enum
typedef String char*;   // String s; znamená char* s;
const int c=3;          // Konstanty musí být inicializovány, nelze jim přiřadit
const int* p=a;         // Obsah p (prvky a) je konstantní
int* const p=a;         // p (ale ne obsah) je konstantní
const int* const p=a;   // Jak p, tak i jeho obsah jsou konstantní
const int& cr=x;        // cr nelze přiřadit ke změně x
```

## Třídy úložiště

```cpp
int x;          // Auto (paměť existuje pouze v rámci rozsahu)
static int x;   // Globální životnost i při lokálním rozsahu
extern int x;   // Pouze informace, deklarováno jinde
```

## Příkazy

```cpp
x=y;      // Každý výraz je příkaz
int x;    // Deklarace jsou příkazy
;         // Prázdný příkaz

{         // Blok je jeden příkaz
  int x;  // Rozsah x je od deklarace do konce bloku
  a;      // V C musí deklarace předcházet příkazům
}
if (x) a;           // Pokud x je true (není 0), vyhodnotí a
else if (y) b;      // Pokud není x a y (volitelné, může se opakovat)
else c;             // Pokud není x a není y (volitelné)

while (x) a;        // Opakuje 0 nebo vícekrát, dokud je x true

for (x; y; z) a;    // Ekvivalentní k: x; while(y) {a; z;}

do a; while (x);    // Ekvivalentní k: a; while(x) a;

switch (x) {        // x musí být int
  case X1: a;       // Pokud x == X1 (musí být konstanta), skočí sem
  case X2: b;       // Jinak pokud x == X2, skočí sem
  default: c;       // Jinak skočí sem (volitelné)
}
break;              // Vyskočí z cyklu while, do, for nebo switch
continue;           // Skočí na konec cyklu while, do, for
return x;           // Vrátí x z funkce volajícímu
try { a; }
catch (T t) { b; }  // Pokud a vyhodí T, skočí sem
catch (...) { c; }  // Pokud a vyhodí něco jiného, skočí sem
```

## Funkce

```cpp
int f(int x, int);      // f je funkce, která přijímá 2 inty a vrací int
void f();               // f je procedura, která nepřijímá žádné argumenty
void f(int a=0);        // f() je ekvivalentní k f(0)
f();                    // Výchozí návratový typ je int
inline f();             // Optimalizuje pro rychlost
f() { statements; }     // Definice funkce (musí být globální)
T operator+(T x, T y);  // a+b (pokud typu T) volá operator+(a, b)
T operator-(T x);       // -a volá funkci operator-(a)
T operator++(int);      // postfix ++ nebo -- (parametr ignorován)
extern "C" {void f();}  // f() bylo kompilováno v C
```

Parametry funkcí a návratové hodnoty mohou být libovolného typu. Funkce musí být deklarována nebo definována před jejím použitím. Může být deklarována nejprve a definována později. Každý program se skládá ze sady deklarací globálních proměnných a sady definic funkcí (možná v samostatných souborech), z nichž jedna musí být:

```cpp
int main() { statements... }    nebo
int main(int argc, char* argv[]) { statements... }
```

argv je pole argc řetězců z příkazového řádku. Konvenčně, main vrací stav 0, pokud je úspěšná, 1 nebo vyšší pro chyby.

Funkce s různými parametry mohou mít stejný název (přetížení). Operátory kromě `:: . .* ?: ` mohou být přetíženy. Pořadí priority není ovlivněno. Nové operátory nelze vytvářet.

## Výrazy

Operátory jsou seskupeny podle priority, nejvyšší první. Unární operátory a přiřazení se vyhodnocují zprava doleva. Všechny ostatní zleva doprava. Priorita neovlivňuje pořadí vyhodnocování, které je nedefinované. Neexistují žádné kontroly za běhu pro pole mimo hranice, neplatné ukazatele atd.

```cpp
T::X        // Jméno X definované ve třídě T
N::X        // Jméno X definované v jmenném prostoru N
::X         // Globální jméno X

t.x         // Člen x struktury nebo třídy t
p->x        // Člen x struktury nebo třídy, na kterou ukazuje p
a[i]        // i-tý prvek pole a
f(x,y)      // Volání funkce f s argumenty x a y
T(x,y)      // Objekt třídy T inicializovaný s x a y
x++         // Přidá 1 k x, vyhodnotí na původní x (postfix)
x--         // Odebere 1 od x, vyhodnotí na původní x
typeid(x)   // Typ x
typeid(T)   // Rovná se typeid(x), pokud x je T
dynamic_cast<T>(x)      // Převede x na T, kontrolováno za běhu
static_cast<T>(x)       // Převede x na T, nekontrolováno
reinterpret_cast<T>(x)  // Interpretuje bity x jako T
const_cast<T>(x)        // Převede x na stejný typ T, ale ne const

sizeof x    // Počet bajtů použitých k reprezentaci objektu x
sizeof(T)   // Počet bajtů k reprezentaci typu T
++x         // Přidá 1 k x, vyhodnotí na novou hodnotu (prefix)
--x         // Odebere 1 od x, vyhodnotí na novou hodnotu
~x          // Bitový doplňek x
!x          // true pokud x je 0, jinak false (1 nebo 0 v C)
-x          // Unární mínus
+x          // Unární plus (výchozí)
&x          // Adresa x
*p          // Obsah adresy p (*&x se rovná x)
new T       // Adresa nově alokovaného objektu T
new T(x, y) // Adresa T inicializovaného s x, y
new T[x]    // Adresa alokovaného n-prvkového pole T
delete p    // Zničí a uvolní objekt na adrese p
delete[] p  // Zničí a uvolní pole objektů na p

x * y       // Násobení
x / y       // Dělení (celá čísla zaokrouhlují k 0)
x % y       // Modulo (výsledek má znaménko x)

x + y       // Sčítání, nebo &x[y]
x - y       // Odčítání, nebo počet prvků od *x do *y

x << y      // x posunuto o y bitů doleva (x * pow(2, y))
x >> y      // x posunuto o y bitů doprava (x / pow(2, y))

x < y       // Menší než
x <= y      // Menší nebo rovno
x > y       // Větší než
x >= y      // Větší nebo rovno

x == y      // Rovno
x != y      // Nerovno

x & y       // Bitový AND (3 & 6 je 2)
x ^ y       // Bitový XOR (3 ^ 6 je 5)
x | y       // Bitový OR (3 | 6 je 7)

x && y      // x a pak y (vyhodnocuje y pouze pokud x (není 0))
x || y      // x nebo y (vyhodnocuje y pouze pokud x je false (0))

x = y       // Přiřadí y k x, vrací novou hodnotu x
x += y      // x = x + y, také -= *= /= <<= >>= &= |= ^=

x ? y : z   // y pokud x je true (nenulové), jinak z

throw x     // Vyhodí výjimku, přeruší, pokud není zachycena

x , y       // vyhodnotí x a y, vrátí y (zřídka používané)
```

## Třídy

```cpp
class T {       // Nový typ
private:        // Sekce přístupná pouze členským funkcím T
protected:      // Také přístupná třídám odvozeným od T
public:         // Přístupná všem
  int x;                    // Členská data
  void f();                 // Členská funkce
  void g() {return;}        // Inline členská funkce
  void h() const;           // Nemodifikuje žádné datové členy
  int operator+(int y);     // t+y znamená t.operator+(y)
  int operator-();          // -t znamená t.operator-()
  T(): x(1) {}              // Konstruktor s inicializačním seznamem
  T(const T& t): x(t.x) {}  // Kopírovací konstruktor
  T& operator=(const T& t) {x=t.x; return *this; }  // Přiřazovací operátor
  ~T();                     // Destruktor (automatická rutina pro čištění)
  explicit T(int a);        // Povoluje t=T(3) ale ne t=3
  operator int() const {return x;}                  // Povoluje int(t)
  friend void i();          // Globální funkce i() má privátní přístup
  friend class U;           // Členové třídy U mají privátní přístup
  static int y;             // Data sdílená všemi objekty T
  static void l();          // Sdílený kód. Může přistupovat k y, ale ne k x
  class Z {};               // Vnořená třída T::Z
  typedef int V;            // T::V znamená int
};
void T::f() {   // Kód pro členskou funkci f třídy T
  this->x = x;}
int T::y = 2;   // Inicializace statického členu (vyžadováno)
T::l();         // Volání statického členu

struct T {                // Ekvivalentní k: class T { public: 
  virtual void f();       // Může být přepsáno za běhu odvozenou třídou
  virtual void g()=0; };  // Musí být přepsáno (čistě virtuální)
class U: public T {};     // Odvozená třída U dědí všechny členy základní T
class V: private T {};          // Zděděné členy T se stanou privátními
class W: public T, public U {}; // Vícenásobná dědičnost
class X: public virtual T {};   // Třídy odvozené od X mají základní T přímo
```

Všechny třídy mají výchozí kopírovací konstruktor, přiřazovací operátor a destruktor, které provádějí odpovídající operace na každém datovém členu a každé základní třídě, jak je uvedeno výše. Existuje také výchozí konstruktor bez argumentů (vyžadovaný pro vytváření polí), pokud třída nemá žádné konstruktory. Konstruktory, přiřazení a destruktory se nedědí.

## Šablony

```cpp
template <class T> T f(T t);            // Přetížení f pro všechny typy
template <class T> class X {            // Třída s typovým parametrem T
X(T t); };                              // Konstruktor
template <class T> X<T>::X(T t) {}      // Definice konstruktoru
X<int> x(3);                            // Objekt typu "X z int"
template <class T, class U=T, int n=0>  // Šablona s výchozími hodnotami
```

## Jmenné prostory

```cpp
namespace N {class T {};} // Skryje jméno T
N::T t;                   // Použije jméno T v jmenném prostoru N
using namespace N;        // Zpřístupní T bez N::
```

## Standardní knihovna C/C++

Jsou uvedeny pouze nejčastěji používané funkce. Hlavičkové soubory bez .h jsou v jmenném prostoru std. Názvy souborů jsou ve skutečnosti malými písmeny.

## STDIO.H, CSTDIO (Vstup/výstup)

```cpp
FILE* f=fopen("filename", "r");   // Otevře pro čtení, NULL (0) pokud chyba
  // Režim může být také "w" (zápis) "a" připojení, "a+" aktualizace, "rb" binární
fclose(f);              // Uzavře soubor f
fprintf(f, "x=%d", 3);  // Vytiskne "x=3" Další konverze:
  "%5d %u %-8ld"        // int šířka 5, unsigned int, long zarovnaný vlevo
  "%o %x %X %lx"        // osmičkový, hex, HEX, long hex
  "%f %5.1f"            // float nebo double: 123.000000, 123.0
  "%e %g"               // 1.23e2, použijte f nebo g
  "%c %s"               // char, char*
  "%%"                  // %
sprintf(s, "x=%d", 3);  // Vytiskne do pole znaků s
printf("x=%d", 3);      // Vytiskne na stdout (obrazovka, pokud není přesměrováno)
fprintf(stderr, ...     // Vytiskne na standardní chybu (není přesměrováno)
getc(f);                // Přečte jeden znak (jako int) nebo EOF z f
ungetc(c, f);           // Vrátí jeden c na f
getchar();              // getc(stdin);

putc(c, f)              // fprintf(f, "%c", c);
putchar(c);             // putc(c, stdout);
fgets(s, n, f);         // Přečte řádek do char s[n] z f. NULL pokud EOF
gets(s)                 // fgets(s, INT_MAX, f); bez kontroly hranic
fread(s, n, 1, f);      // Přečte n bajtů z f do s, vrátí počet přečtených
fwrite(s, n, 1, f);     // Zapíše n bajtů s do f, vrátí počet zapsaných
fflush(f);              // Vynutí bufferované zápisy do f
fseek(f, n, SEEK_SET);  // Pozicuje binární soubor f na n
ftell(f);               // Pozice v f, -1L pokud chyba
rewind(f);              // fseek(f, 0L, SEEK_SET); clearerr(f);
feof(f);                // Je f na konci souboru?
ferror(f);              // Chyba v f?
perror(s);              // Vytiskne char* s a chybovou zprávu
clearerr(f);            // Vymaže chybový kód pro f
remove("filename");     // Smaže soubor, vrátí 0 pokud OK
rename("old", "new"); // Přejmenuje soubor, vrátí 0 pokud OK
f = tmpfile();          // Vytvoří dočasný soubor v režimu "wb+"
tmpnam(s);              // Umístí unikátní název souboru do char s[L_tmpnam]
```

## STDLIB.H, CSTDLIB (Různé funkce)

```cpp
atof(s); atol(s); atoi(s);  // Převede char* s na float, long, int
rand(), srand(seed);        // Náhodné int 0 až RAND_MAX, resetuje rand()
void* p = malloc(n);        // Alokuje n bajtů. Zastaralé: použijte new
free(p);                    // Uvolní paměť. Zastaralé: použijte delete
exit(n);                    // Ukončí program, vrátí stav n
system(s);                  // Spustí OS příkaz s (závislé na systému)
getenv("PATH");             // Proměnná prostředí nebo 0 (závislé na systému)
abs(n); labs(ln);           // Absolutní hodnota jako int, long
```

## STRING.H, CSTRING (Funkce pro manipulaci s polem znaků)

Řetězce jsou typu char[] s '\0' v posledním použitém prvku.

```cpp
strcpy(dst, src);           // Zkopíruje řetězec. Bez kontroly hranic
strcat(dst, src);           // Zřetězí k dst. Bez kontroly hranic
strcmp(s1, s2);             // Porovná, <0 pokud s1<s2, 0 pokud s1==s2, >0 pokud s1>s2
strncpy(dst, src, n);       // Zkopíruje až n znaků, také strncat(), strncmp()
strlen(s);                  // Délka s bez započítání \0
strchr(s,c); strrchr(s,c);  // Adresa prvního/posledního znaku c v s nebo 0
strstr(s, sub);             // Adresa prvního podřetězce v s nebo 0
// mem... funkce jsou pro jakékoli typy ukazatelů (void*), délka n bajtů
memmove(dst, src, n);       // Zkopíruje n bajtů z src do dst
memcmp(s1, s2, n);          // Porovná n bajtů jako v strcmp
memchr(s, c, n);            // Najde první bajt c v s, vrátí adresu nebo 0
memset(s, c, n);            // Nastaví n bajtů s na c
```

## CTYPE.H, CCTYPE (Typy znaků)

```cpp
isalnum(c);             // Je c písmeno nebo číslice?
isalpha(c); isdigit(c); // Je c písmeno? Číslice?
islower(c); isupper(c); // Je c malé písmeno? Velké písmeno?
tolower(c); toupper(c); // Převede c na malé/velké písmeno
```

## MATH.H, CMATH (Matematika s plovoucí desetinnou čárkou)

```cpp
sin(x); cos(x); tan(x);     // Trigonometrické funkce, x (double) je v radiánech
asin(x); acos(x); atan(x);  // Inverzní
atan2(y, x);                // atan(y/x)
sinh(x); cosh(x); tanh(x);  // Hyperbolické
exp(x); log(x); log10(x);   // e na x, logaritmus o základu e, logaritmus o základu 10
pow(x, y); sqrt(x);         // x na y, druhá odmocnina
ceil(x); floor(x);          // Zaokrouhlí nahoru nebo dolů (jako double)
fabs(x); fmod(x, y);        // Absolutní hodnota, x modulo y
```

## TIME.H, CTIME (Hodiny)

```cpp
clock()/CLOCKS_PER_SEC; // Čas v sekundách od spuštění programu
time_t t=time(0);       // Absolutní čas v sekundách nebo -1 pokud neznámý
tm* p=gmtime(&t);       // 0 pokud UCT nedostupné, jinak p->tm_X kde X je:
//    sec, min, hour, mday, mon (0-11), year (-1900), wday, yday, isdst
asctime(p);             // "Den Měs dd hh:mm:ss rrrr\n"
asctime(localtime(&t)); // Stejný formát, lokální čas
```

## ASSERT.H, CASSERT (Pomocník pro ladění)

```cpp
assert(e);      // Pokud e je false, vytiskne zprávu a přeruší
#define NDEBUG  // (před #include <assert.h>), vypne assert
```

## NEW.H, NEW (Handler pro nedostatek paměti)

```cpp
set_new_handler(handler); // Změní chování při nedostatku paměti
void handler(void) {throw bad_alloc();}
```

## IOSTREAM.H, IOSTREAM (Nahrazuje stdio.h)

```cpp
cin >> x >> y;              // Přečte slova x a y (libovolného typu) ze stdin
cout << "x=" << 3 << endl;  // Zapíše řádek na stdout
cerr << x << y << flush;    // Zapíše na stderr a vyprázdní buffer
c = cin.get();              // c = getchar();
cin.get(c);                 // Přečte znak
cin.getline(s, n, '\n');    // Přečte řádek do char s[n] po '\n' (výchozí)
if (cin)                    // Dobrý stav (není EOF)?
                            // Pro čtení/zápis libovolného typu T:
istream& operator>>(istream& i, T& x) {i >> ...; x=...; return i;}
ostream& operator<<(ostream& o, const T& x) {return o << ...;}
```

## FSTREAM.H, FSTREAM (Souborový I/O funguje jako cin, cout výše)

```cpp
ifstream f1("filename");  // Otevře textový soubor pro čtení
if (f1)                   // Testuje, zda je otevřen a vstup je k dispozici
f1 >> x;                  // Přečte objekt ze souboru
f1.get(s);                // Přečte znak nebo řádek
f1.getline(s, n);         // Přečte řádek do řetězce s[n]
ofstream f2("filename");  // Otevře soubor pro zápis
if (f2) f2 << x;          // Zapíše do souboru
```

## IOMANIP.H, IOMANIP (Formátování výstupu)

```cpp
cout << setw(6) << setprecision(2) << setfill('0') << 3.1; // vytiskne "003.10"
```

## STRING (Pole znaků proměnné velikosti)

```cpp
string s1, s2="hello";    // Vytvoří řetězce
s1.size(), s2.size();     // Počet znaků: 0, 5
s1 += s2 + ' ' + "world"; // Zřetělení
s1 == "hello world"       // Porovnání, také <, >, != atd.
s1[0];                    // 'h'
s1.substr(m, n);          // Podřetězec velikosti n začínající na s1[m]
s1.c_str();               // Převede na const char*
getline(cin, s);          // Přečte řádek končící '\n'
```

## VECTOR (Pole/zásobník proměnné velikosti s vestavěnou alokací paměti)

```cpp
vector<int> a(10);                  // a[0]..a[9] jsou int (výchozí velikost je 0)
a.size();                           // Počet prvků (10)
a.push_back(3);                     // Zvětší velikost na 11, a[10]=3
a.back()=4;                         // a[10]=4;
a.pop_back();                       // Zmenší velikost o 1
a.front();                          // a[0];
a[20]=1;                            // Pád: bez kontroly hranic
a.at(20)=1;                         // Jako a[20], ale vyhodí out_of_range()
for (vector<int>::iterator p=a.begin(); p!=a.end(); ++p)
*p=0;                               // Nastaví všechny prvky a na 0
vector<int> b(a.begin(), a.end());  // b je kopie a
vector<T> c(n, x);                  // c[0]..c[n-1] inicializováno na x
T d[10]; vector<T> e(d, d+10);      // e je inicializováno z d
```

## DEQUE (pole/zásobník/fronta)

```cpp
deque<T> je jako vector<T>, ale také podporuje:
a.push_front(x);  // Umístí x na a[0], posune prvky směrem k zadní části
a.pop_front();    // Odstraní a[0], posune směrem k přední části
```

## UTILITY (Pár)

```cpp
pair<string, int> a("hello", 3);  // 2-prvková struktura
a.first;                          // "hello"
a.second;                         // 3
```

## MAP (Asociativní pole)

```cpp
map<string, int> a;                   // Mapa z řetězce na int
a["hello"]=3;                         // Přidá nebo nahradí prvek a["hello"]
for (map<string, int>::iterator p=a.begin(); p!=a.end(); ++p)
  cout << (*p).first << (*p).second;  // Vytiskne hello, 3
a.size();                             // 1
```

## ALGORITHM (Kolekce 60 algoritmů na sekvencích s iterátory)

```cpp
min(x, y); max(x, y);     // Menší/větší z x, y (libovolný typ definující <)
swap(x, y);               // Vymění hodnoty proměnných x a y
sort(a, a+n);             // Seřadí pole a[0]..a[n-1] podle <
sort(a.begin(), a.end()); // Seřadí vektor nebo deque
```
