import * as model from './model.js';
import recipeView from './views/recipeView.js';

//import icons from '../img/icons.svg'; // Parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if(module.hot){
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update results view to mark  selected search results
    resultsView.update(model.getSearchResultsPage());

    //1) Update the bookmark
    bookmarksView.update(model.state.bookmark);
    
    //1) Loading Recipe
    await model.loadRecipe(id);

    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.renderError();
  }

  
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function(goToPage){

  // 1) Render New Results
  resultsView.render(model.getSearchResultsPage(goToPage));

   // 2) New Pagination  Buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  
  // Update the recipe View
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){
  
  //Add or Remove BookMark
  if(!model.state.recipe.bookmarked ) 
    model.addBookmark(model.state.recipe);
  else
    model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe views
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmark);

}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe =async function (newRecipe) {
  try {

    //Show loading spinner 
    addRecipeView.renderSpinner();
    //Upload new Recipe Data
    await model.uploadREcipe(newRecipe);
    console.log(model.state.recipe);


    //Render Recipe 
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render Bookmark View

    bookmarksView.render(model.state.bookmark);

    //Change Id in url

    window.history.pushState(null,  '', `#${model.state.recipe.id}`);
    
    //Close Form window
    setTimeout( () => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000 );
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }

}

const init = function () {
  //bookmarksView.addHandlerRender(controlBookmarks);
  //bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServngs(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();


const clearBookmarks = function() {
  localStorage.clear('bookmarks');
}

//clearBookmarks();