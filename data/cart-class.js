import { renderCheckoutHeader } from "../script/checkout/checkoutHeader.js";

class Cart{
  cartItems;
  #localStorageKey;

  constructor(localStorageKey){
    this.#localStorageKey=localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage(){
  this.cartItems= JSON.parse(localStorage.getItem(this.#localStorageKey)) || [
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
}
  
  saveToStorage(){
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }
  
  addToCart(productId, selectedQuantity){
    let flag=1;
    this.cartItems.forEach((product)=>{
      if(product.productId===productId){
        flag=0;
        product.quantity += selectedQuantity;
      }
    });
    if(flag){
    this.cartItems.push({
      //productId: productId,
      productId,
      quantity: selectedQuantity,
      deliveryOptionId:'1'
    });
  }
    this.saveToStorage();
  }
  
  removeFromCart(productId){
    const newCart=[];
    this.cartItems.forEach((product)=>{
      if(product.productId!==productId){
        newCart.push(product);
      }
    });
    this.cartItems=newCart;
    this.saveToStorage();
  }
  
  checkout(){
    let quantity=countQuantity();
    document.querySelector('.js-cart-checkout-quantity').innerHTML=quantity;
  }
  
  countQuantity(){
    let quantity=0;
    this.cartItems.forEach((product)=>{
      quantity += product.quantity;
    })
    return quantity;
  }
  
  updateQuantity(productId,newQuantity){
    this.cartItems.forEach((product)=>{
      if(product.productId===productId){
        product.quantity=newQuantity;
      }
    });
    renderCheckoutHeader();
    this.saveToStorage();
  }
  
  updateDeliveryOption(productId,deliveryOptionId){
    this.cartItems.forEach((product)=>{
      if(product.productId===productId){
        product.deliveryOptionId=deliveryOptionId;  
        }
    });
    this.saveToStorage();
  }
}


const cart=new Cart('cart-oop');
const businessCart=new Cart('businessCart-oop');


console.log(cart);
console.log(businessCart);