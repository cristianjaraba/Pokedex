function getCardTemplate(id, name, type, img) {
    return `
<div class="card ${type}">

    <div class="id-container">
        <span id="pokemon-id">#${id}</span>
    </div>

    <div class="name-container">
        <span id="pokemon-name">${name}</span>
    </div>

    <div class="type-and-img-container">

        <div id="type-container-${id}" class="type-container">
        </div>

        <img id="pokemon-img" class="pokemon-img" src=${img} alt="Bulbasaur">
    
    </div>

</div>`;
}

function getTypeTemplate(type) {
    return`
<div class="type">
    <span>${type}</span>
</div>
    `;
}