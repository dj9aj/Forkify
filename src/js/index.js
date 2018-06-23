// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';


// Global state of the app
// - Search object
// - Current receipt object
// - Shopping list object
// - Liked recipes

const state = {};



//------------------
// SEARCH CONTROLLER
//------------------
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();
    
    if (query) {
        // 2. New search object with query from user input and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes 
            await state.search.getResults();
            
            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        
        } catch (err) {
            alert('Error processing recipe');
            clearLoader();
        }
    }
};



//------------------
// RECIPE CONTROLLER
//------------------
const controlRecipe = async () => {
    // Get ID from URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // If there is a state.search object (if the user has searched for a recipe) highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create a new recipe object based on Recipe model
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients from promise
            
            await state.recipe.getRecipe();
            // console.log(state.recipe);
            state.recipe.parseIngredients();

            
            // Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe, 
                state.likes.isLiked(id)
            );
           
        } catch (err) {
            alert('Error processing recipe');
        }
    }
};



//------------------
// LIST CONTROLLER
//------------------
const controlList = () => {
    // Create a new list if there is none yet
    if (!state.list) state.list = new List();

    // Check if item checkboxes are checked or unchecked
    const isChecked = recipeView.checkTickedIngredients();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach((el, i) => {
        // Add checked items to list
        if (isChecked[i]) {
            const item = state.list.addItem(el.count, el.unit, el.ingredient);
            
            // If returned object has an ingredient property, then it is a new item being added to list, therefore it is rendered to UI
            if (item.ingredient) {
                listView.renderItem(item);
            } else {
                // If item does not include an ingredient property, then the item is already included in the list, so update the count in the state and double the count on the item in the list on the UI
                state.list.updateCount(item.id, item.count);
                listView.updateCount(item.id, item.count);
            }
        }
    });
    listView.removeClearBtn();
    listView.renderClearBtn();
};



//------------------
// LIKE CONTROLLER
//------------------
const controlLike = () => {
    // If there is not already a likes object, then create a new likes object
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // If the result of the isLiked function is false
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle like button
        likesView.toggleLikeBtn(true);
        
        // Add like to the UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe 
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle like button
        likesView.toggleLikeBtn(false);

        // Remove like from the UI list
        likesView.deleteLike(currentID);
    }
    // Pass in a value which is the result of calling the getNumLikes function. That returns the length of the likes array, which is then passed into the toggleLikeMenu function.
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};




// Attach event listener to and haschange or load event. Call controlRecipe if event occurs.
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



// Handle delete and update shopping list item events
elements.shoppingList.addEventListener('click', e => {
    // Find out id of item that was clicked.
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete item button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        
        // If list is empty, remove
        if (state.list.items.length === 0) {
            listView.removeClearBtn();
        }

        // Delete from UI
        listView.deleteItem(id);

        // Handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        // Grab count value and convert to number
        const val = parseFloat(e.target.value, 10);
        // Update count by passing in value and id
        state.list.updateCount(id , val);
    } 
});



// Handle shopping list delete all items button
elements.shopping.addEventListener('click', e => {

    if (e.target.matches('.list_btn_delete-small, .list_btn_delete-small *')) {
        // Delete from state
        state.list.deleteAllItems();
        
        // Delete from UI
        listView.deleteAllItems();
        listView.removeClearBtn();
    }
});



// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // If the user clicks on the element with the class that matches .btn-decrease, or any child of .btn-decrease
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *'))  {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});



// Restore likes recipes on page load
window.addEventListener('load', () => {
    // Create likes and list objects
    state.likes = new Likes();
    state.list = new List();
    
    // Restore likes & list
    state.likes.readStorage();
    state.list.readStorage();
    
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Loop over all likes and items in the likes and items arrays and render to page
    state.likes.likes.forEach(like => likesView.renderLike(like));
    state.list.items.forEach(item => listView.renderItem(item));
    

    // If there are items in list, render clear shopping list button
    if (state.list.items.length > 0) {
        listView.renderClearBtn();
    }
    
});



// Stop form submit after page re-load
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch();
});



// Handling pagination button clicks
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        // Find which page to go to by finding value from data attribute and then convert to number
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


