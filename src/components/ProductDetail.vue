<template>
  <div class="product-detail">
    <div class="product-image-container">
      <img
        :src="product.images[currentImageIndex]"
        :alt="product.name"
        class="product-image"
      />
      <div class="navigation">
        <button @click="prevImage" :disabled="currentImageIndex === 0">❮</button>
        <button @click="nextImage" :disabled="currentImageIndex === product.images.length - 1">❯</button>
      </div>
      <div class="image-indicator">
        <span
          v-for="(image, index) in product.images"
          :key="index"
          :class="{'active': index === currentImageIndex}"
        ></span>
      </div>
    </div>
    <div class="product-info">
      <h1 class="product-name">{{ product.name }}</h1>
      <p class="product-description" :class="{ 'expanded': expandedDescription }">
        {{ truncatedDescription }}
        <span v-if="showToggleDescription" @click="toggleDescription" class="toggle-link">
          {{ expandedDescription ? 'Sembunyikan' : 'Selengkapnya' }}
        </span>
      </p>
      <p class="product-price">Harga: {{ formatPrice(product.price) }}</p>
      <p class="product-stock">Stok: {{ product.stock }}</p>
      <p class="product-category">Kategori: {{ product.category }}</p>
      <p class="product-color">Warna: {{ product.color }}</p>
      <p class="product-type">Tipe: {{ product.type }}</p>
    </div>
    <div class="product-actions">
      <q-btn color="primary" @click="addToCart">Tambah ke Keranjang</q-btn>
      <q-btn color="secondary" @click="checkout([product])">Checkout</q-btn>
      <q-btn color="secondary" :href="whatsappLink" target="_blank">Tanyakan di WhatsApp</q-btn>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useCartStore } from '../store';

export default {
  name: 'ProductDetail',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const cartStore = useCartStore();
    const currentImageIndex = ref(0);
    const expandedDescription = ref(false);

    const nextImage = () => {
      if (currentImageIndex.value < props.product.images.length - 1) {
        currentImageIndex.value++;
      }
    };

    const prevImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
      }
    };

    const maxLength = 150;
    const truncatedDescription = computed(() => {
      if (props.product.description.length > maxLength && !expandedDescription.value) {
        return props.product.description.slice(0, maxLength) + '...';
      }
      return props.product.description;
    });

    const showToggleDescription = computed(() => props.product.description.length > maxLength);

    const toggleDescription = () => {
      expandedDescription.value = !expandedDescription.value;
    };

    const addToCart = () => {
      cartStore.addToCart(props.product);
      alert('Produk ditambahkan ke keranjang!');
    };

    const checkout = (items) => {
      const cartItems = items.map(product => `${product.name} (Harga: ${formatPrice(product.price)})`).join('\n');
      const total = formattedTotal.value;
      const message = `Halo, saya ingin membeli produk berikut:\n\n${cartItems}`;
      const whatsappLink = `https://wa.me/6285762786626?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(price);
    };

    const formattedTotal = computed(() => {
      return formatPrice(cartStore.totalPrice);
    });

    const whatsappLink = `https://wa.me/6285762786626?text=Halo,%20saya%20ingin%20bertanya%20tentang%20${encodeURIComponent(props.product.name)}.`;

    return { cartStore, currentImageIndex, nextImage, prevImage, addToCart, checkout, formatPrice, whatsappLink, truncatedDescription, expandedDescription, showToggleDescription, toggleDescription, formattedTotal };
  }
};
</script>

<style scoped>
.product-detail {
  padding: 20px;
  text-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  max-height: 90vh;
  background-color: white;
}

.product-image-container {
  position: relative;
  width: 100%;
}

.product-image {
  width: 100%; /* Menyesuaikan lebar gambar sesuai dengan lebar layar */
  height: auto; /* Menjaga rasio gambar */
  max-height: 500px; /* Membatasi tinggi maksimum gambar */
  object-fit: cover; /* Memastikan gambar tetap proporsional */
}

.navigation {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}

.navigation button {
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
}

.navigation button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-indicator {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.image-indicator span {
  width: 10px;
  height: 10px;
  background: lightgray;
  border-radius: 50%;
  margin: 0 5px;
}

.image-indicator .active {
  background: black;
}

.product-info {
  width: 100%;
  max-width: 500px;
}

h1 {
  font-size: 30px;
  margin-top: 0px;
  margin-bottom: 0px;
  color: black;
}

.product-description {
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Jumlah baris yang ditampilkan sebelum ada toggle */
  -webkit-box-orient: vertical;
}

.product-description.expanded {
  -webkit-line-clamp: unset; /* Hapus batasan baris jika deskripsi diperluas */
}

.toggle-link {
  cursor: pointer;
  color: blue;
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
  position: sticky;
  bottom: 0;
  background: transparent;
  width: 100%;
  padding: 10px;
}

/* Media query untuk menargetkan perangkat mobile */
@media (max-width: 600px) {
  .product-image {
    width: 100%; /* Mengisi lebar kontainer dengan gambar */
    max-height: 500px; /* Tetapkan tinggi maksimum sesuai kebutuhan */
  }

  .product-info {
    width: 100%;
  }

  h1 {
    font-size: 24px;
  }

  .product-price,
  .product-stock {
    font-size: 1rem;
  }

  .product-description {
    -webkit-line-clamp: 5; /* Tambahkan beberapa baris lagi sebelum ada toggle */
  }

  .product-description.expanded {
    -webkit-line-clamp: unset; /* Hapus batasan baris jika deskripsi diperluas */
  }
}
</style>
