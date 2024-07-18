<template>
  <div class="cart">
    <h2>Keranjang Belanja</h2>
    <div v-if="cartItems.length > 0">
      <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
        <input type="checkbox" class="cart-item-checkbox" v-model="selectedItems" :value="item">
        <img :src="item.images[0]" :alt="item.name" class="cart-item-image" />
        <div class="cart-item-details" @click="showProductDetail(item)">
          <h3>{{ item.name }}</h3>
          <p>Harga: {{ formatPrice(item.price) }}</p>
          <p>Kategori: {{ item.category }}</p>
          <p>Jumlah: {{ item.quantity }}</p>
          <p>Warna: {{ item.selectedColor }}</p>
        </div>
        <button @click.stop="removeFromCart(item.id)">Hapus</button>
      </div>
      <div class="cart-total">
        <h3>Total Keseluruhan: {{ formatPrice(cartTotal) }}</h3>
      </div>
      <div class="cart-actions">
        <button @click="checkout" class="button" color="primary">Checkout</button>
        <button @click="clearCart" class="button" color="secondary">Hapus Semua</button>
      </div>
    </div>
    <div v-else>
      <p>Keranjang belanja kosong.</p>
    </div>

    <!-- Confirmation Dialog for Checkout -->
    <q-dialog v-model="showCheckoutConfirmation">
      <q-card>
        <q-card-section>
          <p style="font-size: 20px; font-weight: 500">Apakah Anda yakin ingin checkout dengan total {{ formatPrice(cartTotal) }}?</p>
        </q-card-section>
        <q-card-actions class="confirm-checkout">
          <button @click="confirmCheckout" class="button" color="primary">Ya</button>
          <button @click="cancelCheckout" class="button" color="secondary">Tidak</button>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Product Detail Modal -->
    <q-dialog v-model="showProductDetailModal">
      <ProductDetail :product="selectedProduct" @close="closeProductDetailModal" />
    </q-dialog>
  </div>
</template>


<script>
import { ref, computed } from 'vue';
import { useCartStore } from '../store';
import ProductDetail from './ProductDetail.vue';

export default {
  name: 'Cart',
  components: {
    ProductDetail,
  },
  setup() {
    const cartStore = useCartStore();
    const showCheckoutConfirmation = ref(false);
    const showProductDetailModal = ref(false);
    const selectedProduct = ref(null);
    const selectedItems = ref([]);

    const cartItems = computed(() => cartStore.cart);
    const cartTotal = computed(() => cartStore.cart.reduce((total, item) => total + item.price * item.quantity, 0));

    const selectedTotal = computed(() => selectedItems.value.reduce((total, item) => total + item.price * item.quantity, 0));

    const removeFromCart = (productId) => {
      cartStore.removeFromCart(productId);
      selectedItems.value = selectedItems.value.filter(item => item.id !== productId);
    };

    const clearCart = () => {
      cartStore.clearCart();
      selectedItems.value = [];
    };

    const checkout = () => {
      if (selectedItems.value.length > 0) {
        showCheckoutConfirmation.value = true;
      } else {
        alert('Pilih produk terlebih dahulu.');
      }
    };

    const confirmCheckout = () => {
      showCheckoutConfirmation.value = false;
      let message = 'Halo, saya ingin membeli produk berikut:\n\n';
      selectedItems.value.forEach((item, index) => {
        message += `Product ${index + 1} :\nNama Produk: **${item.name}**\nTipe: ${item.type ?? '-'}\nKategori: ${item.category}\nWarna: ${item.selectedColor}\nJumlah: ${item.quantity}\n\n`;
      });
      const whatsappUrl = `https://wa.me/6285762786626?text=${encodeURIComponent(message)}`;
      window.location.href = whatsappUrl;
      clearCart();
    };




    const cancelCheckout = () => {
      showCheckoutConfirmation.value = false;
    };

    const showProductDetail = (product) => {
      selectedProduct.value = product;
      showProductDetailModal.value = true;
    };

    const closeProductDetailModal = () => {
      showProductDetailModal.value = false;
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(price);
    };

    return {
      cartItems,
      cartTotal,
      selectedItems,
      selectedTotal,
      removeFromCart,
      clearCart,
      checkout,
      confirmCheckout,
      cancelCheckout,
      formatPrice,
      showCheckoutConfirmation,
      showProductDetail,
      showProductDetailModal,
      selectedProduct,
      closeProductDetailModal,
    };
  },
};
</script>


<style scoped>
.cart {
  padding: 20px;
  background-color: #f9f9f9;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  font-weight: 600;
  text-align: center;
  color: #333;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 5px;
}

.cart-item-details {
  flex: 1;
  cursor: pointer;
}

.cart-item-details h3 {
  margin: 0 0 5px;
  font-size: 1.1em;
  font-weight: 600;
}

.cart-item-details p {
  margin: 2px 0;
  font-size: 0.9em;
  color: #555;
}

.cart-item-checkbox {
  /** berikan transisi pada checkbox nya dan style yang modern */
  transition: background-color 0.3s;
  appearance: none;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border: 2px solid #ccc;
  border-radius: 50%;
  outline: none;
  /**berikan transisi silau */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;

}

.cart-item-checkbox:checked {
  background-color: #31ff22;
  border: 2px solid #ffffff1f;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;

}

.cart-item button {
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  margin-left: 10px;
}

.cart-total h3 {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: left;
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.button {
  flex: 1;
  margin: 0 5px;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1em;
}

.confirm-checkout {
  justify-content: center;
}

@media (max-width: 600px) {
  .cart {
    padding: 10px;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    margin-bottom: 10px;
  }

  .cart-item-image {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    border-radius: 5px;
  }

  .cart-item-details {
    margin-bottom: 10px;
  }

  .cart-item-details h3 {
    font-size: 1em;
    margin-bottom: 5px;
  }

  .cart-item-details p {
    font-size: 0.8em;
    margin: 2px 0;
  }

  .cart-item button {
    font-size: 0.8em;
    padding: 6px 10px;
  }

  .cart-total {
    font-size: 1em;
    margin-bottom: 15px;
  }

  .cart-actions {
    flex-direction: column;
  }

  .button {
    margin: 5px 0;
    padding: 8px 12px;
    font-size: 0.9em;
  }
}
</style>
