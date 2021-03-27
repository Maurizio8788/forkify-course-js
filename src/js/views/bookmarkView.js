import View from "./View";
import previewView from "./previewView";
import icons from 'url:../../img/icons.svg'; // Parcel 1

class BookmarksView extends View {

    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmars yet! Find a nice recipe and bookmark it 😉';
    _message = "";

    _generateMarkup() {
        return this._data
          .map(bookmark => previewView.render(bookmark, false))
          .join('');
    }

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }


}

export default new BookmarksView();