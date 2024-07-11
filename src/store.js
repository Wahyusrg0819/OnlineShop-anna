import { defineStore } from 'pinia';
import { db } from './firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: []
  }),
  actions: {
    async fetchProducts() {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      this.products = products;
      localStorage.setItem('products', JSON.stringify(this.products));
    },
    async addProduct(product) {
      const docRef = await addDoc(collection(db, 'products'), product);
      this.products.push({ id: docRef.id, ...product });
      localStorage.setItem('products', JSON.stringify(this.products));
    },
    async removeProduct(productId) {
      await deleteDoc(doc(db, 'products', productId));
      this.products = this.products.filter(p => p.id !== productId);
      localStorage.setItem('products', JSON.stringify(this.products));
    },
    async updateProductStock(productId, newStock) {
      const product = this.products.find(p => p.id === productId);
      if (product) {
        await updateDoc(doc(db, 'products', productId), { stock: newStock });
        product.stock = newStock;
        localStorage.setItem('products', JSON.stringify(this.products));
      }
    }
  }
});

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(localStorage.getItem('cart')) || []
  }),
  actions: {
    addToCart(product) {
      const found = this.cart.find(item => item.id === product.id);
      if (found) {
        found.quantity++;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }
});
