function init() {
    document.getElementById('body').innerHTML = '';
    for (let index = 1; index < 11; index++) {
        fetchPokemon(index);
    }
}

async function fetchPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url);
    const data = await response.json();
    renderCard(data);
}

function renderCard(data) {
    document.getElementById('body').innerHTML += getCardTemplate(
        data.id,
        data.name,
        data.types[0].type.name,
        data.sprites.other.dream_world.front_default);
    for (let index = 0; index < data.types.length; index++) {
        document.getElementById(`type-container-${data.id}`).innerHTML += getTypeTemplate(data.types[index].type.name)
    }
}