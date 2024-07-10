<template>
    <q-page padding>
      <h1 class="text-h4 q-mb-md">Keranjang Belanja</h1>
      <q-card v-for="product in cart" :key="product.id" class="q-mb-md">
        <q-card-section>
          <div class="row no-wrap items-center">
            <q-img :src="product.image" class="q-mr-md product-image" />
            <div class="column product-info">
              <div class="text-subtitle1">{{ product.name }}</div>
              <div class="text-body2">{{ product.description }}</div>
              <div class="text-subtitle2 q-mt-sm">Harga: {{ product.price }}</div>
            </div>
            <q-space />
            <div class="column items-end">
              <q-btn flat round icon="remove_circle" @click="removeFromCart(product.id)" color="negative" />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <div class="text-h6">Total Harga: {{ formattedTotal }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" @click="checkout">Checkout</q-btn>
        </q-card-actions>
      </q-card>
    </q-page>
  </template>
  
  <script>
  import { useCartStore } from '../store'
  
  export default {
    name: 'Cart',
    setup() {
      const cartStore = useCartStore()
      return { cartStore }
    },
    computed: {
      cart() {
        return this.cartStore.cart
      },
      total() {
        return this.cart.reduce((acc, product) => acc + product.price * (product.quantity || 1), 0)
      },
      formattedTotal() {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(this.total)
      }
    },
    methods: {
      removeFromCart(productId) {
        this.cartStore.removeFromCart(productId)
      },
      checkout() {
        const cartItems = this.cart.map(product => `${product.name} (Harga: ${product.price})`).join('\n')
        const total = this.formattedTotal
        const message = `Halo, saya ingin membeli produk berikut:\n\n${cartItems}\n\nTotal Harga: ${total}`
        const whatsappLink = `https://wa.me/6285762786626?text=${encodeURIComponent(message)}`
        window.open(whatsappLink, '_blank')
      }
    }
  }
  </script>
  
  <style scoped>
  .product-image {
    width: 100px;
    height: 100px;
  }
  
  .product-info {
    max-width: 300px;
  }
  
  .q-card {
    width: 100%;
  }
  </style>
  