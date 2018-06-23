import { elements } from './base';
import { limitRecipeTitle } from './searchView';



export const toggleLikeBtn = isLiked => {
    // If isLiked is true, then iconString is 'icon-heart', if it's false, then iconString is 'icon-heart-outlined'.
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    
    // Select element where the icon is located. Set the href attribute depending on the iconString variable.
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};



export const toggleLikeMenu = numLikes => {
    // If likes is greater than 0, then the likes menu is visible, otherwise its hidden. 
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};



export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};



export const deleteLike = id => {
    // Find element in DOM with href attribute equal to id that's passed in. Then go up to parent element.
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;

    // If there is an element, go up to parent element, then come back down to remove element from page.
    if (el) el.parentElement.removeChild(el);
};