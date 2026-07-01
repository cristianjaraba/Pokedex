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
        return;
    }
    document.getElementById('cards-container').innerHTML = '';
    let filteredPokemonsList = allPokemons.filter(pokemon => pokemon.name.startsWith(filterWord.toLowerCase()));
    if (filteredPokemonsList.length == 0) {
        document.getElementById('cards-container').innerHTML = 'Keine Pokemons gefunden.'
    }
    else{
        renderCards(filteredPokemonsList);
    }
    if (filterWord != '') {
        hidePlusBtn();
    }
    else {showPlusBtn();}
}

function hidePlusBtn() {
    document.getElementById('btn').style.visibility = 'hidden';
}

function showPlusBtn() {
    document.getElementById('btn').style.visibility = 'visible';
}

async function fetchMorePokemons() {  
    let startId = allPokemons.length + 1;
    let endId = allPokemons.length + 21;
    for (let index = startId; index < endId; index++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${index}`;
        const response = await fetch(url);
        const data = await response.json();
        allPokemons.push(data);
    }
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