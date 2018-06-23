import { elements } from './base';


export const getInput = () => elements.searchInput.value;



export const clearInput = () => {
    elements.searchInput.value = '';
};



export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML= '';
};



export const highlightSelected = id => {
    // Select all elements with the class .results__link and convert them into an array
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    
    // Loop over array and remove the active class
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    // Select the .results__link class which has a href id equal to the id that's passed in, and add the active class to the element
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};



export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        // Split up title into array. Each item in the array will be each word
        title.split(' ').reduce((acc, cur) => {
            // If acc plus each item in array is less than or equal to limit, then push that item into the new array
            if(acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            // Return the new acc amount
            return acc + cur.length;
        }, 0)
        // Convert array back into string and return the result
        return `${newTitle.join(' ')} ...`;
    }
    // Return original title if length is less than limit
    return title;
};



const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};



const createButton = (page, type) => `
    
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;



// Render pagination page buttons
const renderButtons = (page, numResults, resPerPage) => {
    
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Button to go to next page
        button = createButton(page, 'next');
    
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    
    } else if (page === pages && pages > 1) {
        // Button to go to previous page
        button = createButton(page, 'prev');
    } 

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};



export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Render Results
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // Return shallow copy of recipes array, using start and end variables to determine the start and end points. 
    recipes.slice(start, end).forEach(renderRecipe);

    // Render pagination buttons. 
    renderButtons(page, recipes.length, resPerPage);
};