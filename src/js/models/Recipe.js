import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    };



    async getRecipe() {
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
        }
    };



    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 3;
    };



    calcServings() {
        this.servings = 4;
    };



    parseIngredients() {

        const uniformUnits = [
            ['tablespoons', 'tbsp'],
            ['tablespoon', 'tbsp'],
            ['ounces', 'oz'],
            ['ounce', 'oz'],
            ['teaspoons', 'tsp'],
            ['teaspoon', 'tsp'],
            ['cups', 'cup'],
            ['pounds', 'pound'],
            ['kilograms', 'kg'],
            ['kilogram', 'kg'],
            ['grams', 'g'],
            ['gram', 'g'],
            ['ml', 'ml']
        ];

        const unitsMap = new Map(uniformUnits);
        
        // Create new array with results of calling function on each element of the original ingredients array
        const newIngredients = this.ingredients.map( el => {
            // 1) Uniform Ingredients by converting all characters to lower case
            let ingredient = el.toLowerCase();

            unitsMap.forEach((value, key) => {
                ingredient = ingredient.replace(key, value);
            });

            // 2) Remove Parenthesis and any characters inside them by using regular expression
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient by splitting string into an array of substrings. Each item in array is a word.
            const arrIng = ingredient.split(' ');

            // Use regEx to seperate numbers from letters in first index of arrIng
            const regExArr = arrIng[0].match(/[a-z]+|[^a-z]+/gi);
            
            // If regEx array is more than 1, replace first item from arrIng with first and second items from regEx array
            if (regExArr.length > 1) {
                arrIng.splice(0, 1, regexStr[0], regexStr[1])
            }
            
            // Create a Set from the values in the unitsMap Map
            const unitSet = new Set(unitsMap.values());
            
            // Find index where a unit occurs in the arrIng array 
            const unitIndex = arrIng.findIndex(string => unitSet.has(string));

            let objIng;
            if (unitIndex > -1) {
                // If there is a unit
                const arrCount = arrIng.slice(0, unitIndex); 

                let count;
                if (arrCount.length === 1) {
                    // Set count to arrIng[0]. Some results include dash, such as 1-1/2. Replace '-' with '+' and call eval function to calculate the count
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    // Return shallow copy of arrIng[0] up to but not including unitIndex. Join back together with eval function adding values together 
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit, but first element is a number
                objIng = {
                    
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
                
            // If ingredient is null or a string with space
            } else if (ingredient === -1 || ingredient === " ") {
                objIng = {
                    count: '',
                    unit: '',
                    ingredient: ''
                }

            } else if (unitIndex === -1){
                // If there is NO unit and no number in first position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            } 
        
            return objIng;

        });
        
        this.ingredients = newIngredients;
    };



    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        // Ingredients
        // Looping over all the ingredient count values and calculating the new count values depending on the new serving amounts
        this.ingredients.forEach(ing => {
            // To find out the new count value, we need to divide the new servings amount by the old servings amount, then multiply the orignal count amount to get the new count value
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    };
};