let allPokemons = [];

async function init() {
    await fetchAndLoadPokemons();
    renderCards(allPokemons);
}

async function fetchAndLoadPokemons() {
    for (let index = 1; index < 21; index++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${index}`;
        const response = await fetch(url);
        const data = await response.json();
        allPokemons.push(data);
        document.getElementById('loading-spinner').style.display = 'none';
    }
    addLikeProperty();
}

function addLikeProperty() {
    for (let index = 0; index < allPokemons.length; index++) {
        allPokemons[index].liked = false;
    }
}

function renderCards(allPokemons) {
    for (let index = 0; index < allPokemons.length; index++) {
        document.getElementById('cards-container').innerHTML += getCardTemplate(
            allPokemons[index].id,
            allPokemons[index].name,
            allPokemons[index].types[0].type.name,
            allPokemons[index].sprites.other.dream_world.front_default);
        for (let j = 0; j < allPokemons[index].types.length; j++) {
            document.getElementById(`type-container-${allPokemons[index].id}`).innerHTML +=
                getTypeTemplate(allPokemons[index].types[j].type.name)
        }
    }
}

function filterPokemons() {
    const filterWord = document.getElementById('search').value;
    if (filterWord.length < 3 && filterWord != '') {
        document.getElementById('cards-container').innerHTML = 'Enter at least 3 letters.'
        return;
    }
    document.getElementById('cards-container').innerHTML = '';
    let filteredPokemonsList = allPokemons.filter(pokemon => pokemon.name.startsWith(filterWord.toLowerCase()));
    if (filteredPokemonsList.length == 0) {
        document.getElementById('cards-container').innerHTML = 'No Pokemons found.'
    }
    else {
        renderCards(filteredPokemonsList);
    }
    if (filterWord != '') {
        hidePlusBtn();
    }
    else { showPlusBtn(); }
}

function hidePlusBtn() {
    document.getElementById('btn').style.visibility = 'hidden';
}

function showPlusBtn() {
    document.getElementById('btn').style.visibility = 'visible';
}

async function fetchMorePokemons() {
    document.getElementById('loading-spinner').style.display = 'flex';
    document.getElementById('btn').style.display = 'none';
    let startId = allPokemons.length + 1;
    let endId = allPokemons.length + 21;
    for (let index = startId; index < endId; index++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${index}`;
        const response = await fetch(url);
        const data = await response.json();
        data.liked = false;
        allPokemons.push(data);
    }
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('btn').style.display = 'flex';
}

async function showMorePokemons() {
    await fetchMorePokemons();
    renderCards(allPokemons.slice(-20));
}

function openTable(tabName) {
    let tabsList = document.getElementsByClassName("tab");

    for (let i = 0; i < tabsList.length; i++) {
        tabsList[i].style.display = "none";
    }

    document.getElementById(tabName).style.display = "block";
}

async function openDialog(id) {
    document.getElementById('dialog').showModal();
    await renderAbout(id);
    renderStates(id);
    checkLikedOrNot(id);
    resetOpenedTabs();
    changeBgColorDialog(id);
    getEvolutionChain(id);
}

function changeBgColorDialog(id) {
    document.getElementById('pokemon-basic-data-container').classList = 'pokemon-basic-data-container';
    document.getElementById('dialog').classList = '';
    let newClass;
    for (let index = 0; index < allPokemons.length; index++) {
        if (allPokemons[index].id == id) {
            newClass = allPokemons[index].types[0].type.name;
        }
    }
    document.getElementById('pokemon-basic-data-container').classList.add(`${newClass}`);
    document.getElementById('dialog').classList.add(`${newClass}`);
}

function resetOpenedTabs() {
    let tabsList = document.getElementsByClassName("tab");

    for (let i = 0; i < tabsList.length; i++) {
        tabsList[i].style.display = "none";
    }

    document.getElementById('about').style.display = "block";
}

async function renderAbout(id) {
    let currentPokemon = getCurrentPokemon(id);
    let specie = await fetchSpecie(currentPokemon);
    let englishSpecieName = getSpecieName(specie);
    let abilities = [];
    getAbilities(currentPokemon, abilities);
    let eggGroups = [];
    getEggGroups(specie, eggGroups);
    renderAbout1(currentPokemon);
    renderAbout2(currentPokemon, specie, englishSpecieName, abilities, eggGroups);
}

function renderStates(id) {
    let currentPokemon = getCurrentPokemon(id);
    let hp = Number(((currentPokemon.stats[0].base_stat / 255) * 100).toFixed(0));
    let attack = Number(((currentPokemon.stats[1].base_stat / 255) * 100).toFixed(0));
    let defense = Number(((currentPokemon.stats[2].base_stat / 255) * 100).toFixed(0));
    let specialAttack = Number(((currentPokemon.stats[3].base_stat / 255) * 100).toFixed(0));
    let specialDefense = Number(((currentPokemon.stats[4].base_stat / 255) * 100).toFixed(0));
    let speed = Number(((currentPokemon.stats[5].base_stat / 255) * 100).toFixed(0));

    let sum = hp + attack + defense + specialAttack + specialDefense + speed;

    let total = ((sum / 600) * 100).toFixed(0);

    document.getElementById('hp').innerHTML = hp;
    updateProgressBar('hp-progress-bar', hp, 'green');
    document.getElementById('attack').innerHTML = attack;
    updateProgressBar('attack-progress-bar', attack, 'red');
    document.getElementById('defense').innerHTML = defense;
    updateProgressBar('defense-progress-bar', defense, 'green');
    document.getElementById('sp-attack').innerHTML = specialAttack;
    updateProgressBar('sp-attack-progress-bar', specialAttack, 'red');
    document.getElementById('sp-def').innerHTML = specialDefense;
    updateProgressBar('sp-def-progress-bar', specialDefense, 'green');
    document.getElementById('speed').innerHTML = speed;
    updateProgressBar('speed-progress-bar', speed, 'red');
    document.getElementById('total').innerHTML = total;
    updateProgressBar('total-progress-bar', total, 'green');
}

function updateProgressBar(id, value, color) {
    document.getElementById(id).style.background = `
    linear-gradient(
        to right,
        ${color} 0%,
        ${color} ${value}%,
        rgb(37 37 208 / 18%) ${value}%,
        rgb(37 37 208 / 18%) 100%
    )
    `;
}

function renderAbout2(currentPokemon, specie, englishSpecieName, abilities, eggGroups) {
    document.getElementById('species').innerHTML = englishSpecieName;
    document.getElementById('height').innerHTML = currentPokemon.height * 10 + ' cm';
    document.getElementById('weight').innerHTML = currentPokemon.weight / 10 + ' kg';
    document.getElementById('abilities').innerHTML = abilities.join(", ") + "."
    document.getElementById('female').innerHTML = ((specie.gender_rate / 8) * 100) + '%';
    document.getElementById('male').innerHTML = 100 - ((specie.gender_rate / 8) * 100) + '%';
    document.getElementById('egg-groups').innerHTML = eggGroups.join(", ") + ".";
}

function getEggGroups(specie, eggGroups) {
    specie.egg_groups.forEach(item => eggGroups.push(item.name[0].toUpperCase() + item.name.slice(1)));
}

function getAbilities(currentPokemon, abilities) {
    currentPokemon.abilities.forEach(item => abilities.push(item.ability.name[0].toUpperCase() + item.ability.name.slice(1)));

}

function getSpecieName(specie) {
    for (let index = 0; index < specie.genera.length; index++) {
        if (specie.genera[index].language.name == 'en') {
            let englishSpecieName = specie.genera[index].genus;
            return englishSpecieName;
        }
    }

}

function getCurrentPokemon(id) {
    for (let index = 0; index < allPokemons.length; index++) {
        if (allPokemons[index].id == id) {
            let currentPokemon = allPokemons[index];
            return currentPokemon;
        }
    }
}

function renderAbout1(currentPokemon) {
    document.getElementById('dialog-pokemon-id').innerHTML = '#' + currentPokemon.id;
    document.getElementById('dialog-pokemon-name').innerHTML = currentPokemon.name;
    document.getElementById('dialog-type-container').innerHTML = '';
    for (let index = 0; index < currentPokemon.types.length; index++) {
        document.getElementById('dialog-type-container').innerHTML += getTypeTemplateDialog(currentPokemon.types[index].type.name);
    }
    document.getElementById('dialog-img').src = currentPokemon.sprites.other.dream_world.front_default;
}

async function fetchSpecie(currentPokemon) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${currentPokemon.id}`;
    const response = await fetch(url);
    const specie = await response.json();
    return specie;
}

function showNext() {
    let id = Number(document.getElementById('dialog-pokemon-id').innerHTML.slice(1));
    if (id == allPokemons.length) {
        id = 1;
        openDialog(id);

    }
    else {
        openDialog(id + 1);
    }
    resetOpenedTabs();

}

function showPrevious() {
    let id = Number(document.getElementById('dialog-pokemon-id').innerHTML.slice(1));
    if (id == 1) {
        id = allPokemons.length;
        openDialog(id);
    }
    else {
        openDialog(id - 1);
    }
    resetOpenedTabs();
}

function like() {
    document.getElementById('not-liked').style.display = 'none';
    document.getElementById('liked').style.display = 'flex';
    let id = Number(document.getElementById('dialog-pokemon-id').innerHTML.slice(1));
    for (let index = 0; index < allPokemons.length; index++) {
        if (allPokemons[index].id == id) {
            allPokemons[index].liked = true;
        }
    }
}

function dislike() {
    document.getElementById('liked').style.display = 'none';
    document.getElementById('not-liked').style.display = 'flex';
    let id = Number(document.getElementById('dialog-pokemon-id').innerHTML.slice(1));
    for (let index = 0; index < allPokemons.length; index++) {
        if (allPokemons[index].id == id) {
            allPokemons[index].liked = false;
        }
    }
}

function checkLikedOrNot(id) {
    if (allPokemons[id - 1].liked == false) {
        document.getElementById('liked').style.display = 'none';
        document.getElementById('not-liked').style.display = 'flex';
    }
    else {
        document.getElementById('liked').style.display = 'flex';
        document.getElementById('not-liked').style.display = 'none';
    }
}

function closeDialog() {
    document.getElementById('dialog').close();
}


async function getEvolutionChain(id) {
    let specie = await fetchSpecie(allPokemons[id - 1]);
    const url = specie.evolution_chain.url;
    const response = await fetch(url);
    const data = await response.json();
    const evolution1 = data.chain.species.name;
    const evolution2 = data.chain.evolves_to[0]?.species?.name;
    const evolution3 = data.chain.evolves_to[0]?.evolves_to[0]?.species?.name ?? null;
    renderEvolution(evolution1, evolution2, evolution3);
}

function renderEvolution(evolution1, evolution2, evolution3) {
    let evo1Img, evo2Img, evo3Img, id1, id2, id3;

    for (let index = 0; index < allPokemons.length; index++) {
        if (allPokemons[index].name === evolution1) {
            evo1Img = allPokemons[index].sprites.other.dream_world.front_default;
            id1 = allPokemons[index].id;
        }
        if (allPokemons[index].name === evolution2) {
            evo2Img = allPokemons[index].sprites.other.dream_world.front_default;
            id2 = allPokemons[index].id;
        }
        if (allPokemons[index].name === evolution3) {
            evo3Img = allPokemons[index].sprites.other.dream_world.front_default;
            id3 = allPokemons[index].id;
        }
    }
    document.getElementById('evo-container').innerHTML = getEvotemplate(id1, id2, id3, evo1Img, evo2Img, evo3Img);
}