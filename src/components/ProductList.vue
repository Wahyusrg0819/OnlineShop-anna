<template>
  <div class="list-product">
    <div class="row justify-around">
      <!-- Tampilkan loader jika data produk belum di-fetch -->
      <div v-if="isLoading" class="loading">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>

      <!-- Tampilkan produk jika data produk sudah di-fetch -->
      <div v-else v-for="product in products" :key="product.id" class="q-card" @click="openProductDetail(product)">
        <!-- Menampilkan gambar pertama dari array images jika ada -->
        <img v-if="product.images && product.images.length > 0" :src="product.images[0]" class="product-image" alt="Product Image" />
        <div class="product-info">
          <h3 class="title">{{ product.name }}</h3>
          <p class="product-description">{{ product.description }}</p>
          <p class="product-category">Category: {{ product.category }}</p>
          <p class="product-type">Type: {{ product.type }}</p>
          <p class="product-detail">{{ formattedPrice(product.price) }}</p>
          
        </div>
      </div>

      <q-dialog v-model="showProductDetail">
        <ProductDetail :product="selectedProduct" @close="closeProductDetail" />
      </q-dialog>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useProductStore } from '../store';
import ProductDetail from './ProductDetail.vue';

export default {
  name: 'ProductList',
  components: {
    ProductDetail
  },
  setup() {
    const productStore = useProductStore();
    const showProductDetail = ref(false);
    const selectedProduct = ref(null);
    const isLoading = ref(true);

    onMounted(async () => {
      await productStore.fetchProducts();
      isLoading.value = false;
    });

    const openProductDetail = (product) => {
      selectedProduct.value = product;
      showProductDetail.value = true;
    };

    const closeProductDetail = () => {
      showProductDetail.value = false;
    };

    const formattedPrice = (price) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(price);
    };

    return {
      products: productStore.products,
      showProductDetail,
      selectedProduct,
      isLoading,
      openProductDetail,
      closeProductDetail,
      formattedPrice
    };
  }
};
</script>

<style scoped>
.list-product {
  padding-left: 10%;
  padding-right: 10%;
}
.q-card {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: auto;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  cursor: pointer;
  margin-top: 3%;
}

/* Media query untuk menampilkan 2 kolom pada smartphone */
@media (max-width: 600px) {
  .row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .list-product {
  padding-left: 0%;
  padding-right: 0%;
}

  .q-card {
    width: 100%;
    border-radius: 0px;
  }
}

/* Styles lainnya tetap sama */
.q-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
}

.title {
  font-size: 1.2em;
  font-weight: 600;
}
.product-info p {
  margin-bottom: 5px; /* Atur margin bawah untuk paragraf agar tidak terlalu jauh */
}

.product-info h3 {
  margin-bottom: 2px; /* Atur margin bawah untuk paragraf agar tidak terlalu jauh */
  margin-top: 2px;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.product-info {
  padding: 10px;
}

.product-description {
  line-height: 1.1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-detail {
  font-size: 0.9rem;
  color: #666;
}

.loading {
  --dim: 3rem;
  width: var(--dim);
  height: var(--dim);
  position: relative;
  animation: spin988 2s linear infinite;
  margin-top: 10%;
}

.loading .circle {
  --color: #333;
  --dim: 1.2rem;
  width: var(--dim);
  height: var(--dim);
  background-color: var(--color);
  border-radius: 50%;
  position: absolute;
}

.loading .circle:nth-child(1) {
  top: 0;
  left: 0;
}

.loading .circle:nth-child(2) {
  top: 0;
  right: 0;
}

.loading .circle:nth-child(3) {
  bottom: 0;
  left: 0;
}

.loading .circle:nth-child(4) {
  bottom: 0;
  right: 0;
}

@keyframes spin988 {
  0% {
    transform: scale(1) rotate(0);
  }

  20%, 25% {
    transform: scale(1.3) rotate(90deg);
  }

  45%, 50% {
    transform: scale(1) rotate(180deg);
  }

  70%, 75% {
    transform: scale(1.3) rotate(270deg);
  }

  95%, 100% {
    transform: scale(1) rotate(360deg);
  }
}
</style>
