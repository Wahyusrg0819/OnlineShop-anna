<template>
  
  <button @click="closeProductDetail"  class="close-button">✖</button>
    
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
      <p class="product-type">Tipe: {{ product.type }}</p>
    </div>
    <div class="select">
      <q-select
        v-model="selectedColor"
        :options="product.colors"
        label="Warna"
        outlined
        class="q-mb-md"
      />
      <q-input
        v-model="quantity"
        type="number"
        label="Jumlah"
        outlined
        class="q-mb-md"
        :min="1"
        :max="product.stock"
      />
    </div>
    <div class="product-actions">
      <q-btn style="background-color: #FF5722;" @click="addToCart" class="button">Tambah ke Keranjang</q-btn>
      <q-btn style="background-color: #007BFF;" @click="handleCheckout" class="button">Checkout</q-btn>
      <q-btn style="background-color: #25D366;" :href="whatsappLink" target="_blank" class="button">Tanyakan di WhatsApp</q-btn>
    </div>

    <!-- Confirmation Dialog for Checkout -->
    <q-dialog v-model="showCheckoutConfirmation">
      <q-card>
        <q-card-section>
          <p style="font-size: 20px; font-weight: 500">Apakah anda sudah memastikan ulang warna dan jumlah produk yang anda pilih?</p>
        </q-card-section>
        <q-card-actions class="confirm-checkout">
          <q-btn label="Ya" @click="confirmCheckout" color="primary" />
          <q-btn label="Tidak" @click="cancelCheckout"  color="secondary" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Alert Dialog for Add to Cart -->
    <q-dialog v-model="showAddToCartAlert">
      <q-card>
        <q-card-section>
          <p>Produk ditambahkan ke keranjang!</p>
        </q-card-section>
        <q-card-actions>
          <q-btn label="Tutup" @click="closeAddToCartAlert" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  setup(props, { emit }) {
    const cartStore = useCartStore();
    const currentImageIndex = ref(0);
    const expandedDescription = ref(false);
    const selectedColor = ref(props.product.colors[0] || ''); // Default to first color
    const quantity = ref(1); // Default quantity
    const hasAddedToCart = ref(false); // Track if item has been added to cart
    const showCheckoutConfirmation = ref(false); // Confirmation for checkout
    const showAddToCartAlert = ref(false); // Alert for add to cart

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
      cartStore.addToCart({
        ...props.product,
        selectedColor: selectedColor.value,
        quantity: quantity.value
      });
      hasAddedToCart.value = true; // Set to true when added
      showAddToCartAlert.value = true; // Show alert
    };

    const handleCheckout = () => {
      if (!hasAddedToCart.value) {
        showCheckoutConfirmation.value = true; // Show confirmation prompt
      } else {
        checkout();
      }
    };

    const confirmCheckout = () => {
      showCheckoutConfirmation.value = false; // Hide confirmation prompt
      checkout();
    };

    const cancelCheckout = () => {
      showCheckoutConfirmation.value = false; // Hide confirmation prompt
    };

    const checkout = () => {
      const productDetails = `${props.product.name}\nTipe: ${props.product.type}\nKategori: ${props.product.category}\nWarna: ${selectedColor.value}\nJumlah: ${quantity.value}\nHarga: ${formatPrice(props.product.price * quantity.value)}`;
      const message = `Halo, saya ingin membeli produk berikut:\n\n${productDetails}`;
      const whatsappLink = `https://wa.me/6285762786626?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(price);
    };

    const whatsappLink = `https://wa.me/6285762786626?text=Halo,%20saya%20ingin%20bertanya%20tentang%20${encodeURIComponent(props.product.name)}.`;

    const closeAddToCartAlert = () => {
      showAddToCartAlert.value = false; // Hide alert
    };

    const closeProductDetail = () => {
      emit('close');
    };

    return { 
      currentImageIndex, 
      nextImage, 
      prevImage, 
      addToCart, 
      handleCheckout, 
      confirmCheckout, 
      cancelCheckout, 
      closeAddToCartAlert, 
      formatPrice, 
      whatsappLink, 
      truncatedDescription, 
      expandedDescription, 
      showToggleDescription, 
      toggleDescription, 
      selectedColor, 
      quantity, 
      showCheckoutConfirmation, 
      showAddToCartAlert,
      closeProductDetail
    };
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

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
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

.confirm-checkout {
  justify-content: center;
  
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
  position:sticky;
  background: transparent;
  width: 80%;  
}

.select {
  display: flex;
  justify-content: left;
  gap: 10px;
}

.button {
  color: white;
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

  .product-actions {
    display: flex;
    justify-content: center;
    
    position:sticky;
    background: transparent;
    width: 80%;  
  }

  .button {
    font-size: 10px;
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
