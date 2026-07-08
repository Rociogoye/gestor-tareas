/**
 * Arrays per guardar les tasques i els seus estats
 */
const prompt = require('prompt-sync')();
const tasques = ["tasca1", "tasca2","tasca3"];
const completades = [false,false,false];

/**
 * Mostra el menú principal i retorna l'opció seleccionada
 * @returns {number} Número de l'opció triad pel usuari
 */
function mostrarMenu(){
    console.log(`\n==== Menú de Tasques ====`);
    console.log(`1. Afegir tasca`);
    console.log(`2. Mostrar tasques`);
    console.log(`3. Marcar completada`);
    console.log(`4. Eliminar tasca`);
    console.log(`5. Estadístiques`);
    console.log(`6. Mostrar tascas pendents`);
    console.log(`7. Sortir`);
    return Number(prompt(`Elija una opción: `));
}

/**
 * Afegeix una nova tasca al gestor
 * Valida que no estigui buit ni sigui duplicada
 * @returns {string} Missatge de confirmació o error
 */
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

/**
 * Mostra totes les tasques amb el seu estat
 * @returns {string} Llistat formatetat de tasques
 */
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

/**
 * Obté i valida l'índex d'una tasca de l'usuari
 * @returns {number} Índex vàlid o -1 si no és vàlid
 */
function obtenirIndexValid(){
    let numero = Number(prompt('Número de tasca')?.trim() ?? '');

    if (isNaN(numero) || numero <= 0) return -1;

    let index = numero - 1;

    if (index < 0 || index >= tasques.length){
        return -1;
    }

    return index;
}

/**
 * Modifica una tasca segons l'acció especificada
 * Pot completar o eliminar una tasca
 * @param {number} index - Índex de la tasca
 * @param {string} accio - 'completar' o 'esborrar'
 * @returns {string} Missatge de confirmació o error
 */
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

/**
 * Mostra estadístiques del gestor de tasques
 * Calcula total, completades i pendents
 * @returns {string} Estadístiques formategades
 */
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

/**
 * Mostra únicament les tasques pendents (no completades)
 * Utilitza mètodes avançats d'arrays per filtrar i formatar
 * @returns {string} Llistat formatetat de tasques pendents
 */
function mostrarTasquesPendents(){
    if (tasques.length === 0) return 'No hi ha tasques';

    let llistatPendents = tasques
        .map((tasca, index) => ({ tasca, index, completada: completades[index] }))
        .filter(item => !item.completada)
        .map((item, count) => `${count + 1}. ${item.tasca}`)
        .join('\n');

    if (llistatPendents === '') return 'No hi ha tasques pendents';

    return `==== Tasques Pendents ====\n${llistatPendents}`;
}

/**
 * Funció principal que executa el bucle del programa
 * Gestiona el menú i les opcions de l'usuari
 * @returns {boolean} false quan surt del programa
 */
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
                console.log(mostrarTasquesPendents());
                break;

            case 7:
                console.log("Fins aviat");
                return false;

            default:
                console.log("Opció no vàlida");
        }
    }
}

main();