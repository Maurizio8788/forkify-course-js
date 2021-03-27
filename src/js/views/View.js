import icons from 'url:../../img/icons.svg'; // Parcel 1

export default class View{
   
    _data;
   
    /**
     * Render the received object to the DOM
     * @param {Onject | Object[]} data  the data to be rendered (e.g recipe)
     * @param {boolean} [render=true] If false create markup strings intedad of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render == false
     * @this {Object} View instanecce
     * @author Maurizio Strazzullo
     * @todo Finish implementation
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
          return this.renderError();
    
        this._data = data;
        console.log(this._data);
        const markup = this._generateMarkup();
    
        if (!render) return markup;
    
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }

    update(data){
        if( !data || ( Array.isArray(data) && data.length === 0 ) ) return this.renderError();
        this._data = data;
        const markup = this._generateMarkup();

        const newDom = document.createRange().createContextualFragment(markup);
        const newElement = Array.from( newDom.querySelectorAll('*') );
        const curElement = Array.from( this._parentElement.querySelectorAll('*') );

        newElement.forEach( (newEl, i) => {
            const curEl = curElement[i];

            //Update Change TExt
            if( !newEl.isEqualNode(curEl) && 
               newEl.firstChild?.nodeValue.trim() != ''
            ){
                curEl.textContent = newEl.textContent;
            }

            //update change Attribute
            if( !newEl.isEqualNode(curEl)){
                Array.from(newEl.attributes).forEach( attr => curEl.setAttribute( attr.name, attr.value ) );
            }
        })
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }

    renderSpinner(){
        const markup = `
        <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errorMessage){
        const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div> 
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message){
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div> 
        `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}