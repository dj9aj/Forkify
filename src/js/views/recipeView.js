import { elements } from './base';
import { Fraction } from 'fractional';


export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
}; 



// Function to format string
const formatCount = count => {
    if (count) {
        // Return string to specified precision
        let newCount = count.toPrecision(2);
        
        // Use destructuring to create two variables at once (integer and decimal). Split the string up by the decimal point. Create new array from strings using map to convert the strings back into numbers.
        let [int, dec] = newCount.split('.').map(el => parseInt(el, 10));
       
        const increment = 2.5;
        const threshold = 1.25;
        let remain, newDec;

        // If decimal does not round to quarter increments
        if (dec % increment !== 0) { 
            // Find difference between value and increment
            remain = dec % increment;  
    
            if (remain >= threshold) { // Round Up
               newDec = dec - remain;
               newDec += increment;
            } else { // Round down
                newDec = (dec - remain) * 10; 
            }
        
        } else {
            // If dec already equal to quarter increment, newDec equal to original dec value 
            newDec = dec;
        }

        // If there is no decimal, such as 2, or decimal equals 0, then simply return the original count and leave the function.
        if (!newDec) {
            newCount = int;
            return newCount;
        }

        // Add int and newDec values together and convert back to number
        newCount = parseFloat(`${int}.${newDec}`);
        
        
        if (int === 0) {
            const fr = new Fraction(newCount);
            return `${fr.numerator}/${fr.denominator}`;
        } else {
            const fr = new Fraction(newCount - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    return '?';
};



const createIngredient = ingredient => `
    <li class="recipe__item">
        <input type="checkbox" class="recipe__icon" checked>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;



export const renderRecipe = (recipe, isLiked) => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>



        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join('')}
            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};



export const updateServingsIngredients = recipe => {
    // Update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    // Update counts
    // Create an array from all the classes matching .recipe__count
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    // Loop over all the classes and change the text content of each element. Replace the text content with the updated ingredient amounts at the same index number
    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    });
};



export const checkTickedIngredients = () => {
    
    // Convert node list into array
    const checkBoxes = Array.from(document.querySelectorAll('.recipe__icon'));
    const isChecked = [];

    // Loop over array to see if checked property is true or false
    checkBoxes.forEach(box => {
        isChecked.push(box.checked);
    });
    
    // Return array containing true and false values
    return isChecked;
};