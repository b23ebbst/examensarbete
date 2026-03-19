# Examensarbete i informationsteknologi med inriktning mot webbprogrammering
Renderingstid i vektorbaserade interaktiva webbkartor - Påverkan av renderingsteknik och geografisk komplexitet. 

Genomförandet av ett kontrollerat experiment som syftar till att implementera interaktiva webbkartor med vektorgrafik där kartans komplexitet och den bakomliggande 
tekniken tas i beaktning för att se om det förekommer skillnader i renderingstiden utifrån dessa variabler. 

# Installation / Get started
Implementationen bygger på en Node.js-server med nedladdade vektor-tiles från OpenMapTiles (begränsat till Sveriges område)
## Node.js 
Node.js version 24.14.0 (LTS) har laddats ner via [Node.js nedladdningssida](https://nodejs.org/en/download), och installationen har hämtats som .msi-fil för windows

Följ instruktionerna i installationen, och för att sedan bekräfta installationen skriv följande i kommandtolken 
```
node --version
```
Om nuvarande version visas är installationen korrekt genomförd

## TileServer GL
I kommandtolken: 
```
nmp install -g tileserver-gl
```
Invänta att installationen är klar, och bekräfta att den genomförts med följande kommando: 
```
tileserver-gl --version
```
Om nuvarande version visas är installationen genomförd korrekt

För att starta servern navigera via kommandtolken till mappen som TileServer GL ligger i och ange följande kommando: 
```
tileserver-gl
```
I webbläsaren går du sedan till den localhost-adress som tileservern visas på (port 8080), men observera att den data som visas endast är den exempeldata som redan finns inkluderad i installationen 

## Kartplattor
Kartplattor har laddats ner från [OpenMapTiles](https://www.maptiler.com/on-prem-datasets/planet/) och området har begränsats till Sverige för att hålla datamängden tillräckligt stor utan att uppta allt för stor plats på hårddisken

I samma mapp som TileServer GL ligger skapas en mapp som döps till _data_, och i denna mapp namnges datan för sverige till _sweden.mbtiles_ för enklare hantering

Exempel på hierarkins struktur: 
> C:\tileserver\data\sweden.mbtiles

### Överför dataset till TileServern
För att se till att datasetet finns tillgängligt på den egna TileServer GL startas servern om i kommandtolken genom att stänga av servern och sedan åter navigera 
till mappen som innehåller servern och följt av kommando för att starta servern: 
```
cd C:\TileServer
tileserver-gl config.json --port 8080
```

Nu ska datan för Sverige finnas tillgänglig via localhost-adressen i webbläsaren! 

**OBS!** Det går även bra att starta servern med kommandot `tileserver-gl`, men genom att inkludera `config.json --port 8080` säkerställs det att config-filen används och att det serveras på port 8080
