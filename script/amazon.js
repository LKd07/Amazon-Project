import { cart, addToCart, checkout } from "../data/cart.js";
import { products,search } from "../data/products.js";

const url = new URL(window.location.href);
const mySearch = url.searchParams.get('search');
let newProducts = [];
if(mySearch){
  newProducts=search(mySearch.toLowerCase());
}

let productHTML= '';
products.forEach((product)=>{
  productHTML += `
   <div class="product-container">
      <div class="product-image-container">
        <img  class="product-image" src=${product.image}>
      </div>
      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>
      <div class="product-rating-container">
        <img class="product-rating-stars" src="${product.getStarsURL()}">
        <div class="product-rating-count">
          ${product.rating.count}
        </div>
      </div>
      
      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `
});

document.querySelector('.js-products-grid').innerHTML = productHTML;

let cartQuantity=0;
let timeoutId='';

function addedToCart(productId){
  document.querySelector(`.js-added-${productId}`).classList.add('clicked-added-to-cart');

  clearTimeout(timeoutId);
  timeoutId=setTimeout(()=>{
    document.querySelector(`.js-added-${productId}`).classList.remove('clicked-added-to-cart');
  },2000);
}

document.querySelectorAll('.js-add-to-cart')
.forEach((button)=>{
  button.addEventListener('click',()=>{
    //let productId=button.dataset.productId;
    let {productId}=button.dataset;

    let selectedQuantity=Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

    addToCart(productId, selectedQuantity);
    checkout();
    addedToCart(productId);
  });
});

checkout();

document.querySelector('.js-search-button').addEventListener('click',()=>{
  const searchContent = document.querySelector('.js-search-bar').value;
  window.location.href = `amazon.html?search=${searchContent}`;
});
document.body.addEventListener('keydown',(event)=>{
  if(event.key==='Enter'){
    const searchContent = document.querySelector('.js-search-bar').value;
    window.location.href = `amazon.html?search=${searchContent}`;
  }
});