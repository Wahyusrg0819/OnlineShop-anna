import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: JSON.parse(localStorage.getItem('products')) || []
  }),
  actions: {
    addProduct(product) {
      this.products.push(product)
      localStorage.setItem('products', JSON.stringify(this.products))
    },
    removeProduct(product) {
      this.products = this.products.filter(p => p.id !== product.id)
      localStorage.setItem('products', JSON.stringify(this.products))
    },
    updateProductStock(productId, newStock) {
      const product = this.products.find(p => p.id === productId)
      if (product) {
        product.stock = newStock
        localStorage.setItem('products', JSON.stringify(this.products))
      }
    }
  }
})

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(localStorage.getItem('cart')) || []
  }),
  actions: {
    addToCart(product) {
      const found = this.cart.find(item => item.id === product.id)
      if (found) {
        found.quantity++
      } else {
        this.cart.push({ ...product, quantity: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId)
      localStorage.setItem('cart', JSON.stringify(this.cart))
    }
  }
})