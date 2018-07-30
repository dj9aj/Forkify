# Forkify

Forkify is a vanilla JavaScript application that interacts with the food2fork API to fetch and display recipe food data. This app uses modern JavaScript tools, such as Webpack to bundle the modules, and Babel to convert ES6, ES7 and ES8 back to ES5. The user can search for a specific recipe, and add ingredients to a shopping list or save to a favourites list via local storage. I created a simple Express server in order to host the app via Heroku.

The app is deployed and available to use -

https://shielded-fjord-62551.herokuapp.com/

This project was from Jonas Schmedtmann's 'The Complete JavaScript Course' on Udemy. My additional features and code refactoring include - 

## Refactored formatCount function in recipeView.js.
Function now rounds count data to nearest quarter, making the recipe amounts more manageable for user. eg. 1 1/2 ounces, 5 3/4 grams etc

## Refactored parseIngredients function in Recipe.js.
When converting strings from longer format to shorter version eg. 'tablespoons' to 'tbsp', I decided to use the ES6 map and use the different formatted strings as key/value pairs. I created a nested array with the key/value pairs and created a map from the array. I used the Set method, created directly from the Map values to identify units. This seemed more efficient as Set only contains unique values (whearas an array contains many repeated values). 

## Added functionality to allow user to manually add ingredients to the shopping list, rather than adding the whole recipe at once.
I created checkboxes for each ingredient in the recipe. A seperate function was created to loop over the items and only add to list if box is checked.

## Clear Shopping List Button.
I added a clear shopping list button, allowing the user to clear the list completely, compared to deleting items one at a time.

## Check for duplicated items in shopping list.
The original app did not check whether ingredients were already in the list, therefore the user could end up with the same ingredient multiple times. I refactored the addItem function in List.js to check if the item being added was already present in the list array. If so, then the item that is already present in the shopping list has it's count value doubled.

## Save shopping list data in local storage.
When the page re-loads, the user's shopping list is restored, along with the likes list as well. 