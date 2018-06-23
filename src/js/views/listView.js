import { elements } from './base';


export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};



export const removeClearBtn = () => {
    
    const btn = document.querySelector('.shopping__item__btn'); 

    // If button exists, remove from page
    if (elements.shopping.contains(btn)) {
        btn.parentElement.removeChild(btn);
    }
};



export const renderClearBtn = () => {

    const markup = `
        <li class="shopping__item__btn">
            <button class="list_btn_delete-small">Clear Shopping List</button>
        </li>
    `
     
    elements.shoppingList.insertAdjacentHTML('afterend', markup);
};



export const deleteItem = id => {
    // Find item by its ID
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
};



export const deleteAllItems = () => {
    const items = Array.from(document.querySelectorAll('.shopping__item'));

    // Loop over items and delete
    items.forEach(item => {
        item.parentElement.removeChild(item);
    });
};



export const updateCount = (id, newCount) => {

    // Save element with matching ID to variable
    const item = document.querySelector(`[data-itemid="${id}"] .shopping__count .shopping__count-value`);
    
    // Update count with newCount value
    item.value = newCount;
};

