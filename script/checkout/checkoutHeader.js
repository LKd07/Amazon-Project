import { countQuantity } from "../../data/cart.js";

export function renderCheckoutHeader(){
  document.querySelector('.js-checkout-header-quantity').innerHTML=`${countQuantity()}`;
}