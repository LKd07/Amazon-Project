import { orders } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getProduct } from "../data/products.js";
import { checkout } from "../data/cart.js";

function tracking(){
  checkout();
  let trackingHTML;
  let matchingOrder;
  let matchingProduct;
  let productInOrder;
  const url=new URL(window.location.href);
  let orderId=url.searchParams.get('orderId');
  let productId=url.searchParams.get('productId');
  orders.forEach((order)=>{
    if(order.id===orderId){
      matchingOrder=order;
    }
  });
  matchingProduct=getProduct(productId);
  matchingOrder.products.forEach((product)=>{
    if(product.productId==matchingProduct.id){
      productInOrder=product;
    }
  });
  const deliveryTime = dayjs(productInOrder.estimatedDeliveryTime).format('MMMM D');

  const today=dayjs();
  const orderTime=dayjs(matchingOrder.orderTime);
  const timeOfDelivery=dayjs(productInOrder.estimatedDeliveryTime);
  const percentProgress = ((today-orderTime) / (timeOfDelivery-orderTime)) * 100;

  trackingHTML=`
  <a class="back-to-orders-link link-primary" href="orders.html">
    View all orders
  </a>
  <div class="delivery-date">
    Arriving on ${deliveryTime}
  </div>

  <div class="product-info">
    ${matchingProduct.name}
  </div>

  <div class="product-info">
    Quantity: ${productInOrder.quantity}
  </div>

  <img class="product-image" src="${matchingProduct.image}">

<div class="progress-labels-container">
  <div class="progress-label ${percentProgress<50?'current-status':''}">
    Preparing
  </div>
  <div class="progress-label ${(percentProgress>=50 &&
    percentProgress<100)?'current-status':''}">
    Shipped
  </div>
  <div class="progress-label ${percentProgress>=100?'current-status':''}">
    Delivered
  </div>
</div>

<div class="progress-bar-container">
  <div class="progress-bar" style="width: ${percentProgress}%"></div>
</div>
  `
document.querySelector('.js-order-tracking').innerHTML=trackingHTML;
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
tracking();