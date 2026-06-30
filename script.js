let allPokemons = [];

function init() {
    document.getElementById('cards-container').innerHTML = '';
    for (let index = 1; index < 41; index++) {
        fetchPokemon(index);
    }
}

async function fetchPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url);
    const data = await response.json();
    document.getElementById('loading-spinner').style.display = 'none';
    renderCard(data);
    allPokemons.push(data);
}

function renderCard(data) {
    document.getElementById('cards-container').innerHTML += getCardTemplate(
        data.id,
        data.name,
        data.types[0].type.name,
        data.sprites.other.dream_world.front_default);
    for (let index = 0; index < data.types.length; index++) {
        document.getElementById(`type-container-${data.id}`).innerHTML += getTypeTemplate(data.types[index].type.name)
    }
}

function filterPokemons() {
    const filterWord = document.getElementById('search').value; 
    if (filterWord.length < 3 && filterWord != '') {
        return;
    }
    document.getElementById('cards-container').innerHTML = '';
    for (let index = 0; index < allPokemons.length; index++) {
       if (allPokemons[index].name.startsWith(filterWord.toLowerCase())) {
        renderCard(allPokemons[index])
       }
    }
    if ( document.getElementById('cards-container').innerHTML == '') {
         document.getElementById('cards-container').innerHTML = 'Keine Pokemons gefunden.'
    }
    disAbleBtn(filterWord);
}

function disAbleBtn(filterWord) {
    if (filterWord == '') {
        document.getElementById('btn').disabled = false;
    } else {
        document.getElementById('btn').disabled = true;
    }  
}

function showMorePokemons() {
    for (let index = allPokemons.length + 1; index < allPokemons.length + 21; index++) {
        fetchPokemon(index);
    }
}