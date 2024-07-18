import { defineStore } from 'pinia';
import { db } from './firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: JSON.parse(localStorage.getItem('products')) || []
  }),
  actions: {
    async fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });
        this.products = products;
        localStorage.setItem('products', JSON.stringify(this.products));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    async addProduct(product) {
      try {
        if (!Array.isArray(product.images)) {
          product.images = [product.images];
        }
        const docRef = await addDoc(collection(db, 'products'), {
          ...product,
          category: product.category || '', // Menambahkan kategori
          color: product.color || '', // Menambahkan warna
          type: product.type || '' // Menambahkan tipe
        });
        this.products.push({ id: docRef.id, ...product });
        localStorage.setItem('products', JSON.stringify(this.products));
      } catch (error) {
        console.error('Failed to add product:', error);
      }
    },
    async removeProduct(productId) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        this.products = this.products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(this.products));
      } catch (error) {
        console.error('Failed to remove product:', error);
      }
    },
    async updateProductStock(productId, newStock) {
      try {
        const product = this.products.find(p => p.id === productId);
        if (product) {
          await updateDoc(doc(db, 'products', productId), { stock: newStock });
          product.stock = newStock;
          localStorage.setItem('products', JSON.stringify(this.products));
        }
      } catch (error) {
        console.error('Failed to update product stock:', error);
      }
    },
    async updateProduct(updatedProduct) {
      try {
        const productDoc = doc(db, 'products', updatedProduct.id);
        await updateDoc(productDoc, {
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          stock: updatedProduct.stock,
          images: updatedProduct.images,
          category: updatedProduct.category || '', // Menambahkan kategori
          color: updatedProduct.color || '', // Menambahkan warna
          type: updatedProduct.type || '' // Menambahkan tipe
        });

        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
          localStorage.setItem('products', JSON.stringify(this.products));
        }
      } catch (error) {
        console.error('Failed to update product:', error);
      }
    }
  }
});

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(localStorage.getItem('cart')) || []
  }),
  getters: {
    totalQuantity: (state) => {
      return state.cart.reduce((total, item) => total + item.quantity, 0);
    },
    totalPrice: (state) => {
      return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  actions: {
    addToCart(product) {
      const found = this.cart.find(item => item.id === product.id && item.selectedColor === product.selectedColor);
      if (found) {
        found.quantity += product.quantity; // Tambahkan jumlah produk yang dipilih
      } else {
        this.cart.push({ ...product, quantity: product.quantity });
      }
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    updateCartQuantity(productId, quantity) {
      const item = this.cart.find(item => item.id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      } else if (item && quantity <= 0) {
        this.cart = this.cart.filter(item => item.id !== productId);
      }
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    clearCart() {
      this.cart = [];
      localStorage.removeItem('cart');
    }
  }
});


