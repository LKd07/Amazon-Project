import { cart, removeFromCart, updateQuantity,updateDeliveryOption} from "../../data/cart.js";
import { getProduct} from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { paymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

export function orderSummary(){
let checkoutHTML = '';

cart.forEach((cartProduct)=>{
  const productId = cartProduct.productId;
  let matchingProduct = getProduct(productId);

  const today=dayjs();
  let deliveryOptionId=cartProduct.deliveryOptionId;
  let deliveryOption=getDeliveryOption(deliveryOptionId);
  const deliveryDate=today.add(
    deliveryOption.deliveryDays,'days'
  );
  const dateString = deliveryDate.format(
    'dddd, MMMM D'
  );

  checkoutHTML += `
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>
            <div class="cart-item-details-grid">
              <div class="product-image">
                <img class="product-image" src="${matchingProduct.image}">
              </div>

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label update-${matchingProduct.id} product-count-${matchingProduct.id}">${cartProduct.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link update-${matchingProduct.id}" data-product-id=${matchingProduct.id}>
                    Update
                  </span>
                  <input class="quantity-input js-input-${matchingProduct.id}">
                  <span class="save-quantity-link link-primary js-save" data-save-id=${matchingProduct.id}>Save
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id=${matchingProduct.id}>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct,cartProduct)}
              </div>
            </div>
          </div>
  `
});

document.querySelector('.order-summary').innerHTML=checkoutHTML;

renderCheckoutHeader();
document.querySelectorAll('.js-delete-link').forEach((link)=>{
  link.addEventListener('click',()=>{
    const productId=link.dataset.productId;
    removeFromCart(productId);
    paymentSummary();
    orderSummary();
    const container= document.querySelector(`.js-cart-item-container-${productId}`);
    if(container !== null){
      container.remove();
    }
  });
});

document.querySelectorAll('.js-update-link').forEach((link)=>{
  link.addEventListener('click',()=>{
    const productId=link.dataset.productId;
    document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');

    document.querySelectorAll(`.update-${productId}`).forEach((product)=>{
      product.classList.add('updating');
    });
  });
});

document.querySelectorAll('.js-save').forEach((link)=>{
  link.addEventListener('click',()=>{
    const productId=link.dataset.saveId;

    let value=Number(document.querySelector(`.js-input-${productId}`).value);
    updateQuantity(productId,value);
    paymentSummary();

    document.querySelector(`.product-count-${productId}`).innerHTML=value;
    document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');
  });
});

document.querySelectorAll('.js-delivery-option').forEach((option)=>{
  option.addEventListener('click',()=>{
    updateDeliveryOption(option.dataset.productId,option.dataset.optionId);
    orderSummary();
    paymentSummary();
  });
});
}


function deliveryOptionsHTML(matchingProduct,cartProduct){
  let html='';

  deliveryOptions.forEach((deliveryOption)=>{
    const today=dayjs();
    const deliveryDate=today.add(
      deliveryOption.deliveryDays,'days'
    )
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );
    const priceString=deliveryOption.priceCents===0
    ?
    'FREE':`$${formatCurrency(deliveryOption.priceCents)} -`;

    let isChecked=deliveryOption.id===cartProduct.deliveryOptionId?'checked':'';
    html+=
    `<div class="delivery-option js-delivery-option"
    data-product-id=${matchingProduct.id} data-option-id=${deliveryOption.id}>
      <input type="radio" ${isChecked} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString} Shipping
        </div>
      </div>
    </div>`
  });

  return html;
}