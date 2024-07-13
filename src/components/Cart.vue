<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-md">Keranjang Belanja</h1>
    <q-card v-for="product in cart" :key="product.id" class="q-mb-md">
      <q-card-section>
        <div class="row no-wrap items-center">
          <q-checkbox v-model="product.selected" class="q-mr-md" />
          <q-img :src="product.images[0]" class="q-mr-md product-image" />
          <div class="column product-info">
            <div class="text-subtitle1">{{ product.name }}</div>
            <div class="text-body2">{{ truncateDescription(product.description) }}</div>
            <div class="text-subtitle2 q-mt-sm">Harga: {{ formattedPrice(product.price) }}</div>
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
        <q-btn color="primary" @click="checkoutSelected">Checkout yang Dipilih</q-btn>
        <q-btn color="primary" @click="checkoutAll">Checkout Semua</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { useCartStore } from '../store';

export default {
  name: 'Cart',
  setup() {
    const cartStore = useCartStore();
    return { cartStore };
  },
  computed: {
    cart() {
      return this.cartStore.cart;
    },
    total() {
      return this.cart.reduce((acc, product) => acc + (product.selected ? product.price * (product.quantity || 1) : 0), 0);
    },
    formattedTotal() {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(this.total);
    }
  },
  methods: {
    formattedPrice(price) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(price);
    },
    removeFromCart(productId) {
      this.cartStore.removeFromCart(productId);
    },
    checkoutSelected() {
      const selectedItems = this.cart.filter(product => product.selected);
      this.checkout(selectedItems);
    },
    checkoutAll() {
      this.checkout(this.cart);
    },
    checkout(items) {
      const cartItems = items.map(product => `${product.name} (Harga: ${this.formattedPrice(product.price)})`).join('\n');
      const total = this.formattedTotal;
      const message = `Halo, saya ingin membeli produk berikut:\n\n${cartItems}\n\nTotal Harga: ${total}`;
      const whatsappLink = `https://wa.me/6285762786626?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
    },
    truncateDescription(description) {
      const maxLength = 100; // Ubah sesuai kebutuhan
      if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
      } else {
        return description;
      }
    }
  }
};
</script>

<style scoped>
.product-image {
  width: 100px;
  height: 100px;
}

.product-info {
  max-width: 250px;
}

.q-card {
  width: 100%;
}
</style>
