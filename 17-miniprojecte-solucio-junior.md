![1783166895687](image/17-miniprojecte-solucio-junior/1783166895687.png)

---

# 📝 Gestor de Tasques amb Funcions

---

## 🎯 Objectius

En aquest quadern construirem un petit **gestor de tasques** que funcionarà des de la consola del navegador.

L’objectiu no és només resoldre un problema, sinó aprendre a **estructurar programes més grans** utilitzant funcions petites, clares i reutilitzables.

Amb aquest exercici treballarem:

* Arrays
* Funcions
* Condicions
* Bucles
* Validació de dades
* Mètodes avançats d’arrays:

  * `find()`
  * `forEach()`
  * `filter()`

---

## 1. Anàlisi del problema

El programa ha de permetre a l’usuari:

1. Afegir una tasca
2. Mostrar totes les tasques
3. Marcar una tasca com a completada
4. Eliminar una tasca
5. Mostrar estadístiques
6. Sortir

Cada tasca tindrà dues dades:

* Una descripció
* Un estat: pendent o completada

Abans de programar, és important entendre **què necessita el programa** i **quines dades haurà de gestionar**.

---

## 2. Modelatge de dades

Per guardar la informació utilitzarem dos arrays paral·lels:

```javascript
const tasques = [];
const completades = [];
```

Això significa que **la posició de cada element és important**.

Exemple:

| Índex | Tasca               | Estat |
| ------ | ------------------- | ----- |
| 0      | Comprar pa          | false |
| 1      | Estudiar JavaScript | true  |

Per tant:

```javascript
tasques[0];      // "Comprar pa"
completades[0];  // false
```

Els dos arrays representen la mateixa tasca en el mateix índex.

---

## 3. Arquitectura del programa

Abans d’escriure codi, convé dividir el problema en funcions més petites.

El nostre programa quedarà estructurat així:

```text
Gestor de Tasques
│
├── mostrarMenu()
├── afegirTasca()
├── mostrarTasques()
├── obtenirIndexValid()
├── modificarTasca()
├── mostrarEstadistiques()
└── main()
```

Cada funció tindrà una responsabilitat concreta.

Això fa que el codi sigui:

* més llegible
* més reutilitzable
* més fàcil de mantenir

---

## 4. Mostrar el menú

Primera funció: mostrar les opcions disponibles.

```javascript
function mostrarMenu(){
    return Number(prompt(`
        1. Afegir tasca
        2. Mostrar tasques
        3. Marcar completada
        4. Eliminar tasca
        5. Estadístiques
        6. Sortir
    `));
}
```

### Què fa?

* Mostra el menú amb `prompt()`
* Llegeix la resposta de l’usuari
* Converteix el resultat a número amb `Number()`

---

## 5. Afegir una tasca

Ara implementem la funcionalitat per afegir tasques.

```javascript
function afegirTasca(){
    let novaTasca = prompt('Nova Tasca: ')?.trim() ?? '';

    if (novaTasca === '') return 'La tasca no pot estar buida';

    let duplicada = tasques.find(
        tasca => tasca.toLowerCase() === novaTasca.toLowerCase()
    );

    if (duplicada) return 'Aquesta tasca ja existeix';

    tasques.push(novaTasca);
    completades.push(false);

    return 'Tasca afegida correctament';
}
```

---

### Validació de dades

Primer comprovem que l’usuari no hagi:

* deixat el camp buit
* premut Cancel·lar

```javascript
if (novaTasca === '') return ...
```

---

### Evitar tasques duplicades

Utilitzem `find()`:

```javascript
tasques.find(...)
```

Aquest mètode recorre l’array fins trobar un element que compleixi la condició.

Aquí comprovem si ja existeix una tasca amb el mateix nom.

---

## 6. Mostrar les tasques

```javascript
function mostrarTasques(){
    if (tasques.length === 0) return 'No hi ha tasques';

    let llistatTasques = '==== Llistat de tasques ====\n';

    tasques.forEach((tasca, index) =>{
        let estat = completades[index]
            ? 'Completada'
            : 'Pendent';

        let itemLlistat = `${index + 1}. ${tasca} - ${estat}`;

        llistatTasques += itemLlistat + '\n';
    });

    return llistatTasques;
}
```

---

### `forEach()` i callbacks

Aquí apareix un concepte important.

```javascript
tasques.forEach(...)
```

`forEach()` necessita una **funció callback**.

Un callback és una funció que es passa com a argument a una altra funció perquè aquesta l’executi més tard.

En aquest cas:

```javascript
(tasca, index) => { ... }
```

s’executa una vegada per cada element de l’array.

---

## 7. Validar l’índex d’una tasca

Quan l’usuari vol completar o eliminar una tasca, ha d’introduir un número.

Cal validar que sigui correcte.

```javascript
function obtenirIndexValid(){
    let numero = Number(prompt('Número de tasca')?.trim() ?? '');

    if (isNaN(numero) || numero <= 0) return -1;

    let index = numero - 1;

    if (index < 0 || index >= tasques.length){
        return -1;
    }

    return index;
}
```

---

### Refactor important

Aquesta funció és especialment interessant.

Sense ella, hauríem de repetir la mateixa validació a diferents llocs del programa.

En comptes d’això, extraiem la lògica repetida a una funció independent.

Això és una pràctica molt habitual en desenvolupament professional.

---

## 8. Modificar una tasca

Podem:

* completar una tasca
* eliminar una tasca

En lloc de crear dues funcions diferents, unifiquem la lògica.

```javascript
function modificarTasca(index, accio){
    if (index === -1) return 'Tasca no vàlida';

    if (accio === 'completar'){
        if (completades[index]) {
            return 'La tasca ja estava completada!';
        }

        completades[index] = true;
        return 'Tasca completada!!';
    }

    if (accio === 'esborrar'){
        tasques.splice(index, 1);
        completades.splice(index, 1);
        return 'Tasca eliminada!!';
    }
}
```

---

### Reutilització de codi

Aquesta funció rep:

```javascript
index
accio
```

Segons el valor de `accio`, el comportament canvia.

Exemples:

```javascript
modificarTasca(2, 'completar');
modificarTasca(2, 'esborrar');
```

Aquest patró redueix duplicació.

---

## 9. Mostrar estadístiques

```javascript
function mostrarEstadistiques(){
    if (tasques.length === 0) return 'No hi ha estadístiques!';

    let total = tasques.length;

    let fetes = completades.filter(estat => estat).length;

    let pendents = total - fetes;

    let estadistica = `
        - Total: ${total}
        - Completades: ${fetes}
        - Pendents: ${pendents}
    `;

    return estadistica;
}
```

---

### `filter()`

Aquí utilitzem:

```javascript
completades.filter(...)
```

Aquest mètode crea un nou array amb els elements que compleixen una condició.

La condició:

```javascript
estat => estat
```

només conserva els valors `true`.

Després comptem quants hi ha:

```javascript
.length
```

---

## 10. Funció principal

La funció principal coordina tot el programa.

```javascript
function main(){
    let opcio;

    while(true){
        opcio = mostrarMenu();
        console.clear();

        switch (opcio) {
            case 1:
                console.log(afegirTasca());
                break;

            case 2:
                console.log(mostrarTasques());
                break;

            case 3:
                console.log(mostrarTasques());

                if (tasques.length > 0){
                    console.log(
                        modificarTasca(
                            obtenirIndexValid(),
                            'completar'
                        )
                    );
                }
                break;

            case 4:
                console.log(mostrarTasques());

                if (tasques.length > 0){
                    console.log(
                        modificarTasca(
                            obtenirIndexValid(),
                            'esborrar'
                        )
                    );
                }
                break;

            case 5:
                console.log(mostrarEstadistiques());
                break;

            case 6:
                console.log("Fins aviat");
                return false;

            default:
                console.log("Opció no vàlida");
        }
    }
}
```

Executem el programa:

```javascript
main();
```

---

## 11. 🔍 Repte extra — Mostrar només les tasques pendents

Fins ara, el nostre gestor de tasques és capaç de:

* afegir tasques
* mostrar-les
* marcar-les com a completades
* eliminar-les
* calcular estadístiques

Com a repte extra, podem afegir una nova funcionalitat:

**Mostrar només les tasques pendents**.

---

### Què necessitem?

Per resoldre aquest problema, pensa en les preguntes següents:

1. Com podem saber si una tasca està pendent?
2. Com podem recórrer totes les tasques?
3. Com podem quedar-nos només amb les que no estan completades?

---

### Pista 1 — Revisar l’array d’estats

Recorda que l’array `completades` guarda l’estat de cada tasca:

* `true` → completada
* `false` → pendent

---

### Pista 2 — Pensa en `filter()`

El mètode `filter()` pot ser especialment útil aquí.

Recorda:

* recorre tot l’array
* executa una funció callback
* només conserva els elements que compleixen la condició

---

### Pista 3 — Condició clau

La pregunta clau és:

> Quina condició ha de complir una tasca perquè sigui considerada pendent?

---

### Tancant el repte

💡 Intenta resoldre aquest repte reutilitzant les funcions i patrons que ja has vist al llarg del quadern.

Pensa com un desenvolupador:

1. Entén el problema
2. Divideix-lo en passos petits
3. Escriu una primera solució funcional
4. Refactoritza si cal

---

## 12. Què hem après?

Aquest exercici ens deixa aprenentatges molt importants.

Programar **no és només escriure codi que funcioni**.

També implica:

* dividir problemes grans
* reutilitzar codi
* validar dades
* reduir duplicació
* escriure codi llegible

Això és precisament el que diferencia un codi improvisat d’un codi més professional.

---

## 🚀 Bonus Track — Junior Developer Mindset

En un entorn professional, aquest programa encara es podria millorar més.

Per exemple:

* agrupant cada tasca dins d’un objecte
* separant la lògica de la interfície
* utilitzant mòduls (`import/export`)
* afegint persistència amb `localStorage` o JSON

Però la idea important és aquesta:

> Primer fem que funcioni.
> Després fem que sigui net, modular i mantenible.

---

## Crèdits

![1783167071828](image/17-miniprojecte-solucio-junior/1783167071828.jpg)

Darrera revisió: Juliol 2026

Aquest dossier forma part del curs "Programador Junior de JavaScript amb Intel·ligència Artificial", per Manu Plaza Salas per a CIFO Barcelona La Violeta.

Aquest obra està sota una [llicència](http://creativecommons.org/licenses/by-nc-sa/4.0/)[ de Creative ](http://creativecommons.org/licenses/by-nc-sa/4.0/)[Commons](http://creativecommons.org/licenses/by-nc-sa/4.0/) [Reconeixement-NoComercial-CompartirIgual](http://creativecommons.org/licenses/by-nc-sa/4.0/)[ 4.0 Internacional](http://creativecommons.org/licenses/by-nc-sa/4.0/).
