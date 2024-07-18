<template>
  <button @click="closeProductDetail" class="close-button">✖</button>
  
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
        style="text-align: center;"
      />
      <q-input
        v-model="quantity"
        type="number"
        label="Jumlah"
        outlined
        class="q-mb-md"
        :min="1"
        :max="product.stock"
        style="text-align: center;"
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
        console.log('Adding to cart:', {
          ...props.product,
          selectedColor: selectedColor.value,
          quantity: quantity.value
        });

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
  width: 100%;
  box-sizing: border-box;
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
  max-width: 500px; /* Membatasi lebar maksimum container gambar */
  
}

.product-image {
  width: 100%; /* Menyesuaikan lebar gambar sesuai dengan lebar layar */
  height: auto; /* Menjaga rasio gambar */
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
  background: gray;
}

.product-info {
  text-align: left;
  width: 100%;
  margin-top: 20px;
}

.product-name {
  font-size: 1.5em; /* Ukuran font yang lebih kecil untuk layar kecil */
  margin-bottom: 0px;
}

.product-description {
  margin: 10px 0;
  margin-top: 1px;
}

.product-description.expanded {
  white-space: normal;
}

.toggle-link {
  color: #007BFF;
  cursor: pointer;
}

.product-price, .product-stock, .product-category, .product-type {
  font-weight: bold;
  margin-top: 10px;
}

.select {
  margin-top: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.product-actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.button {
  width: 100%;
  margin-bottom: 10px;
}

@media (min-width: 768px) {
  .product-detail {
    padding: 20px;
    text-align: start;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    max-height: 90vh;
    background-color: white;
    width: 80%; /* Atur lebar untuk layar yang lebih besar */
    box-sizing: border-box;
  }

  .product-actions {
    flex-direction: row;
    justify-content: space-between;
  }

  .button {
    flex: 1;
    margin: 0 10px;
  }
}
</style>

