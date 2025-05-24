import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { cart, clearCart, countQuantity } from "../../data/cart.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function paymentSummary(){
  let productPriceCents=0;
  let ShippingPriceCents=0;
  cart.forEach((cartItem)=>{
    let product=getProduct(cartItem.productId);
    let deliveryOption=getDeliveryOption(cartItem.deliveryOptionId);
    productPriceCents += product.priceCents * cartItem.quantity;
    
    ShippingPriceCents += deliveryOption.priceCents;
  });
  let totalBeforeTax=productPriceCents + ShippingPriceCents;
  let estimatedTax= totalBeforeTax * 0.1;
  let orderTotal = estimatedTax + totalBeforeTax; 

  let paymentSummaryHTML='';

  paymentSummaryHTML=`
    <div class="payment-summary-title">
      Order-Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${countQuantity()}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(ShippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(estimatedTax)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(orderTotal)}</div>
    </div>

    <button class="place-order-button button-primary
    js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML=paymentSummaryHTML;

  document.querySelector('.js-place-order').addEventListener('click',async ()=>{
    const response = await fetch('https://supersimplebackend.dev/orders',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        cart:cart
      })
    });

    const order = await response.json();
    addOrder(order);
    clearCart();
    window.location.href='orders.html';
  });
}