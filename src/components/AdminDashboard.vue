<template>
    <q-page padding>
      <h1 class="text-h4 q-mb-md">Dashboard Admin</h1>
  
      <q-card class="q-mb-md">
        <q-card-section>
          <q-form @submit.prevent="addProduct">
            <div class="q-gutter-md">
              <q-input v-model="newProduct.name" label="Nama Produk" outlined />
              <q-input v-model="newProduct.description" label="Deskripsi Produk" outlined />
              <q-input v-model="newProduct.price" label="Harga Produk" type="number" outlined />
              <q-input v-model="newProduct.stock" label="Stok Produk" type="number" outlined />
              <q-toggle v-model="useUrl" label="Gunakan URL untuk gambar?" />
              <q-input v-if="useUrl" v-model="newProduct.image" label="URL Gambar Produk" outlined />
              <q-uploader
                v-else
                label="Unggah Gambar Produk"
                @added="onFileAdded"
                :multiple="false"
                :url="null"
              />
            </div>
            <q-card-actions align="right">
              <q-btn type="submit" color="primary">Tambah Produk</q-btn>
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
  
      <q-card v-for="product in products" :key="product.id" class="q-mb-md">
        <q-card-section>
          <div class="row no-wrap items-center">
            <q-img :src="product.image" class="q-mr-md" style="width: 100px; height: 100px;" />
            <div class="column">
              <div class="text-subtitle1">{{ product.name }}</div>
              <div class="text-body2">{{ product.description }}</div>
              <div class="text-subtitle2 q-mt-sm">Harga: {{ product.price }}</div>
              <div class="text-subtitle2 q-mt-sm">Stok: {{ product.stock }}</div>
            </div>
            <q-space />
            <div class="column items-end">
              <q-input v-model="product.stock" type="number" @blur="updateStock(product.id, product.stock)" />
              <q-btn flat round icon="delete" @click="confirmDelete(product)" color="negative" />
            </div>
          </div>
        </q-card-section>
      </q-card>
  
      <q-dialog v-model="showConfirmDelete" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-icon name="warning" color="orange" size="2em" class="q-mr-sm" />
            <span>Apakah Anda yakin ingin menghapus produk ini?</span>
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Batal" color="primary" v-close-popup />
            <q-btn flat label="Hapus" color="negative" @click="deleteProduct" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script>
  import { useProductStore } from '../store'
  
  export default {
    name: 'AdminDashboard',
    setup() {
      const productStore = useProductStore()
      return { productStore }
    },
    data() {
      return {
        newProduct: {
          name: '',
          description: '',
          price: '',
          stock: 0,
          image: ''
        },
        useUrl: true,
        showConfirmDelete: false,
        productToDelete: null
      }
    },
    computed: {
      products() {
        return this.productStore.products
      }
    },
    methods: {
      addProduct() {
        if (this.newProduct.name && this.newProduct.description && this.newProduct.price && this.newProduct.stock >= 0 && (this.useUrl ? this.newProduct.image : true)) {
          this.productStore.addProduct({ ...this.newProduct, id: Date.now() })
          this.newProduct = { name: '', description: '', price: '', stock: 0, image: '' }
          this.useUrl = true; // reset useUrl toggle
        } else {
          alert('Semua field harus diisi!')
        }
      },
      confirmDelete(product) {
        this.productToDelete = product
        this.showConfirmDelete = true
      },
      deleteProduct() {
        if (this.productToDelete) {
          this.productStore.removeProduct(this.productToDelete)
          this.productToDelete = null
        }
      },
      updateStock(productId, newStock) {
        this.productStore.updateProductStock(productId, newStock)
      },
      onFileAdded(files) {
        const reader = new FileReader()
        reader.onload = e => {
          this.newProduct.image = e.target.result
        }
        reader.readAsDataURL(files[0])
      }
    }
  }
  </script>
  
  <style scoped>
  .q-card {
    width: 100%;
  }
  </style>
  