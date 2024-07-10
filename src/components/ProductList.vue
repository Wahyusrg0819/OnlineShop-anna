<template>
  <div class="q-pa-md">
    <h1 class="text-h4">Daftar Produk</h1>
    <q-card-group class="row wrap justify-around">
      <q-card
        v-for="product in products"
        :key="product.id"
        @click="openProductDetail(product)"
        class="q-mb-md product-card"
        style="min-width: 250px;"
      >
        <q-img :src="product.image" :alt="product.name" class="q-pa-sm product-image" />
        <q-card-section class="column">
          <q-card-title>{{ product.name }}</q-card-title>
          <q-card-text class="product-description">{{ truncateDescription(product.description) }}</q-card-text>
          <q-card-text class="product-detail">Harga: {{ formattedPrice(product.price) }}</q-card-text>
          <q-card-text class="product-detail">Stok: {{ product.stock }}</q-card-text>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn color="primary" @click="openProductDetail(product)">Detail</q-btn>
        </q-card-actions>
      </q-card>
    </q-card-group>

    <q-dialog v-model="showProductDetail">
      <q-card style="min-width: 70vw">
        <q-card-section>
          <ProductDetail :product="selectedProduct" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useProductStore } from '../store'
import ProductDetail from './ProductDetail.vue'

export default {
  name: 'ProductList',
  components: {
    ProductDetail
  },
  setup() {
    const productStore = useProductStore()
    return { productStore }
  },
  data() {
    return {
      showProductDetail: false,
      selectedProduct: null
    }
  },
  computed: {
    products() {
      return this.productStore.products
    }
  },
  methods: {
    openProductDetail(product) {
      this.selectedProduct = product
      this.showProductDetail = true
    },
    formattedPrice(price) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(price)
    },
    truncateDescription(description) {
      const maxLength = 150
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...'
      } else {
        return description
      }
    }
  }
}
</script>

<style scoped>
.product-card {
  width: 250px;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.product-description {
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* number of lines to show */
  -webkit-box-orient: vertical;
}

.product-detail {
  font-size: 0.9rem;
  color: #666;
}
</style>
