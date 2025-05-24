import { renderCheckoutHeader } from "../script/checkout/checkoutHeader.js";

export let cart= JSON.parse(localStorage.getItem('cart')) || [
{
  productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
  quantity: 2,
  deliveryOptionId:'1'
},
{
  productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
  quantity:1,
  deliveryOptionId:'2'
}
];

export function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, selectedQuantity){
  let flag=1;
  cart.forEach((product)=>{
    if(product.productId===productId){
      flag=0;
      product.quantity += selectedQuantity;
    }
  });
  if(flag){
  cart.push({
    //productId: productId,
    productId,
    quantity: selectedQuantity,
    deliveryOptionId:'1'
  });
}
  saveToStorage();
}

export function removeFromCart(productId){
  const newCart=[];
  cart.forEach((product)=>{
    if(product.productId!==productId){
      newCart.push(product);
    }
  });
  cart=newCart;
  saveToStorage();
}

export function checkout(){
  let quantity=countQuantity();
  document.querySelector('.js-cart-checkout-quantity').innerHTML=quantity;
}

export function countQuantity(){
  let quantity=0;
  cart.forEach((product)=>{
    quantity += product.quantity;
  })
  return quantity;
}

export function updateQuantity(productId,newQuantity){
  cart.forEach((product)=>{
    if(product.productId===productId){
      product.quantity=newQuantity;
    }
  });
  renderCheckoutHeader();
  saveToStorage();
}

export function updateDeliveryOption(productId,deliveryOptionId){
  cart.forEach((product)=>{
    if(product.productId===productId){
      product.deliveryOptionId=deliveryOptionId;  
      }
  });
  saveToStorage();
}

export function clearCart(){
  cart=[];
  saveToStorage();
}