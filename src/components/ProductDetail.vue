<template>
  <div class="product-detail">
    <img :src="product.image" :alt="product.name" class="product-image" />
    <h1 class="product-name">{{ product.name }}</h1>
    <p class="product-description">{{ product.description }}</p>
    <p class="product-price">Harga: {{ formattedPrice }}</p>
    <p class="product-stock">Stok: {{ product.stock }}</p>
    <div class="product-actions">
      <q-btn color="primary" @click="addToCart">Tambah ke Keranjang</q-btn>
      <q-btn color="secondary" :href="whatsappLink" target="_blank">Hubungi via WhatsApp</q-btn>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../store'

export default {
  name: 'ProductDetail',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup() {
    const cartStore = useCartStore()
    return { cartStore }
  },
  computed: {
    whatsappLink() {
      return `https://wa.me/6285762786626?text=Halo,%20saya%20ingin%20bertanya%20tentang%20${encodeURIComponent(this.product.name)}.`
    },
    formattedPrice() {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(this.product.price)
    }
  },
  methods: {
    addToCart() {
      this.cartStore.addToCart(this.product)
      alert('Produk ditambahkan ke keranjang!')
    }
  }
}
</script>

<style scoped>
.product-detail {
  padding: 20px;
  text-align:start; 
}

.product-image {
  width: 100%;
  max-width: 300px;
  margin-bottom: 20px;
}

.product-name {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.product-description {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.6;
}

.product-price,
.product-stock {
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-weight: bold;
}

.product-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
