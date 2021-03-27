import { API_URL, KEY, RES_PER_PAGE } from './config.js';

import {AJAX} from './helper.js';

export const state = {
    recipe:{},
    search:{
        query:'',
        results:[],
        resultsPerPage:RES_PER_PAGE,
        page:1
    },
    bookmark:[]
};

const createRecipeObject = function(data){
    let {recipe} = data.data;
    
    return  {
      id:recipe.id,
      title:recipe.title,
      publisher:recipe.publisher,
      sourceUrl:recipe.source_url,
      image:recipe.image_url,
      servings:recipe.servings,
      cookingTime:recipe.cooking_time,
      ingredients:recipe.ingredients,
      ...(recipe.key && {key:recipe.key})
    }

}

export const loadRecipe = async function(id){

    try {

        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    
         state.recipe = createRecipeObject(data);

          if(state.bookmark.some( b => b.id === id ) )
            state.recipe.bookmarked = true;
          else state.recipe.bookmarked = false;


    } catch (error) {
        console.error(`${error}`);
        throw error;
    }
    
}

export const loadSearchResults = async function(query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        
        state.search.results=data.data.recipes.map( recipe => {
            return {
                id:recipe.id,
                title:recipe.title,
                publisher:recipe.publisher,
                image:recipe.image_url,
                ...(recipe.key && {key:recipe.key})
            }
        } );
        state.search.page = 1;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const getSearchResultsPage = function(page = state.search.page) {
    console.log(state.search.page);
    state.search.page = page;
    
    const start =(page-1) * state.search.resultsPerPage  // 0;
    const end = page * state.search.resultsPerPage      //9;

    return state.search.results.slice(start,end);
}

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach( ing => {
        ing.quantity = ( ing.quantity * newServings ) / state.recipe.servings
        // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
    });

    state.recipe.servings = newServings;
};

const  persistBookmarks = function() {
    localStorage.setItem( 'bookmarks', JSON.stringify(state.bookmark) );
}

export const addBookmark = function(recipe) {
  // Add Bookmark
  state.bookmark.push(recipe);

  //Mark curent recipe
  if(recipe.id === state.recipe.id){
      state.recipe.bookmarked = true;
  }

  persistBookmarks();
};

export const deleteBookmark = function(id) {
    const index = state.bookmark.findIndex( el => el.id === id );
    state.bookmark.splice(index, 1);

     //Mark current recipe as NOT bookmarked
  if(id === state.recipe.id){
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
}

const init = () => {
    const storarge = localStorage.getItem('bookmark');
    if(storarge) state.bookmark = JSON.parse(storage);
};

init();

const clearBookmarks = function(){
    localStorage.clear('bookmarks');
}

export const uploadREcipe = async function(newRecipe){
    try {
        const ingredients = Object.entries(newRecipe)
        .filter( entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map( ing =>{ 
            const ingArr = ing[1].split(',').map(el => el.trim());
            if(ingArr.length !== 3 ) throw new Error("Wrong ingredient format! please use the correct format 😊"); 
            const [quantity, unit, description]  = ingArr;
            return {quantity: quantity ? +quantity : null, unit, description};
        });

        const recipe = {
            title:newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url:newRecipe.image,
            publisher:newRecipe.publisher,
            cooking_time:+newRecipe.cookingTime,
            servings:+newRecipe.servings,
            ingredients
        }

        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (error) {
        throw error;
    }
    
}

