import { orders } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from "./utils/money.js";
import { getProduct } from "../data/products.js";
import { addToCart, checkout } from "../data/cart.js";

export function generateOrders(){
  checkout();
  let ordersHTML = '';
  orders.forEach((order)=>{
    const orderTime = dayjs(order.orderTime).format('MMMM D');
    ordersHTML +=`
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${orderTime}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>
      <div class="order-details-grid">
  `;
  order.products.forEach((product)=>{
    const deliveryTime = dayjs(product.estimatedDeliveryTime).format('MMMM D');
    const matchingProduct = getProduct(product.productId);
    ordersHTML+=`
    <div class="product-image-container">
      <img src="${matchingProduct.image}">
    </div>

    <div class="product-details">
      <div class="product-name">
        ${matchingProduct.name}
      </div>
      <div class="product-delivery-date">
        Arriving on: ${deliveryTime}
      </div>
      <div class="product-quantity">
        Quantity: ${product.quantity}
      </div>
      <button class="buy-again-button button-primary js-buy-again-button" data-buy-again-button=${product.productId}>
        <img class="buy-again-icon" src="images/icons/buy-again.png">
        <span class="buy-again-message">Buy it again</span>
      </button>
    </div>

    <div class="product-actions">
      <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
        <button class="track-package-button button-secondary">
          Track package
        </button>
      </a>
    </div>
    `
  });
  ordersHTML += '</div> </div>';
  });
  document.querySelector('.orders-grid').innerHTML=ordersHTML;
  document.querySelectorAll('.js-buy-again-button').forEach((buyAgainButton)=>{
    buyAgainButton.addEventListener('click',()=>{
      const productId=buyAgainButton.dataset.buyAgainButton;
      addToCart(productId,1);
      checkout();
    });
  });
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
}
generateOrders();