function getCardTemplate(id, name, type, img) {
    return `
<div onclick="openDialog(${id})" class="card ${type}">

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
    return `
<div class="type">
    <span>${type}</span>
</div>
    `;
}

function getTypeTemplateDialog(type) {
    return `
    <div class="dialog-type">
                    <span>${type}</span>
                </div>`;
}

function getEvotemplate(id1, id2, id3, img1, img2, img3) {

    return `
        <div class="evo1" onclick="openDialog(${id1})">
            <img id="evo1" src="${img1}" alt="">
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"
            stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 18l-6-6 6-6" />
            <path d="M19 18l-6-6 6-6" />
        </svg>

        <div class="evo2" onclick="openDialog(${id2})">
            <img id="evo2" src="${img2}" alt="">
        </div>

        ${id3 ? `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none"
                stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 18l6-6-6-6" />
                <path d="M11 18l6-6-6-6" />
            </svg>

            <div class="evo3" onclick="openDialog(${id3})">
                <img id="evo3" src="${img3}" alt="">
            </div>
        ` : ''}
    `;
}