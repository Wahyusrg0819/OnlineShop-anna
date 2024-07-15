<template>
  <q-page class="container">
    <!-- Add Product Section -->
    <div class="row justify-center q-mt-xl">
      <q-card class="col-xs-12 col-sm-10 col-md-8 col-lg-6 q-pa-md">
        <q-card-section>
          <div class="text-h6">Add New Product</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addProduct">
            <q-input v-model="newProduct.name" label="Nama Barang" outlined class="q-mb-md" />
            <q-input v-model="newProduct.description" label="Deskripsi" type="textarea" autogrow outlined class="q-mb-md" />
            <q-input v-model="newProduct.price" label="Harga" type="number" outlined class="q-mb-md" />
            <q-input v-model="newProduct.stock" label="Stok" type="number" outlined class="q-mb-md" />

            <!-- Category Input -->
            <q-select
              v-model="newProduct.category"
              :options="categories"
              label="Kategori"
              outlined
              class="q-mb-md"
            />

            <!-- Color Input -->
            <q-input
              v-model="newProduct.colors"
              label="Warna (Pisahkan dengan Koma)"
              outlined
              class="q-mb-md"
            />

            <!-- Type Input -->
            <q-input v-model="newProduct.type" label="Type (optional)" outlined class="q-mb-md" />

            <q-toggle v-model="useUrl" label="Use Image URL" color="primary" class="q-mb-md" />
            <q-input v-if="useUrl" v-model="imageUrls" label="Image URLs (Pisahkan dengan Koma)" outlined class="q-mb-md" />

            <q-uploader v-else label="Upload Gambar" accept="image/*" multiple @added="onFileAdded" />

            <!-- Image Preview List -->
            <div v-if="newProduct.images.length" class="q-mt-md">
              <div class="text-h7 q-mb-sm">Selected Images:</div>
              <div class="row">
                <div v-for="(image, index) in newProduct.images" :key="index" class="col-xs-4 q-mb-sm">
                  <q-img :src="image" class="q-mr-md product-image" />
                </div>
              </div>
            </div>

            <q-btn type="submit" label="Tambah Product" color="primary" class="full-width q-mt-md" />
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <div class="row justify-center q-mt-xl">
      <q-card class="col-xs-12 col-sm-10 col-md-8 col-lg-6 q-pa-md">
        <q-card-section>
          <div class="text-h6">Product List</div>
        </q-card-section>
        <q-card-section>
          <q-list bordered>
            <q-item v-for="product in products" :key="product.id" clickable v-ripple @click="editProduct(product)">
              <q-item-section>
                <q-img v-if="product.images && product.images.length > 0" :src="product.images[0]" class="q-mr-md product-image" />
                <q-item-label>{{ product.name }}</q-item-label>
                <q-item-label caption>{{ product.description }}</q-item-label>
                <q-item-label caption>Category: {{ product.category }}</q-item-label>
                <q-item-label caption>Color: {{ product.colors.join(', ') || 'N/A' }}</q-item-label>
                <q-item-label caption>Type: {{ product.type || 'N/A' }}</q-item-label>
                <q-item-label caption>Price: {{ formatPrice(product.price) }}</q-item-label>
                <q-item-label caption>Stock: {{ product.stock }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn dense flat icon="edit" @click.stop="editProduct(product)" />
                <q-btn dense flat icon="delete" color="negative" @click.stop="confirmDelete(product)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!-- Edit Product Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Product</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="updateProduct">
            <q-input v-model="editProductData.name" label="Product Name" outlined class="q-mb-md" />
            <q-input v-model="editProductData.description" label="Description" type="textarea" autogrow outlined class="q-mb-md" />
            <q-input v-model="editProductData.price" label="Price" type="number" outlined class="q-mb-md" />
            <q-input v-model="editProductData.stock" label="Stock" type="number" outlined class="q-mb-md" />

            <!-- Edit Category Input -->
            <q-select
              v-model="editProductData.category"
              :options="categories"
              label="Category"
              outlined
              class="q-mb-md"
            />

            <!-- Edit Color Input -->
            <q-input
              v-model="editProductData.colors"
              label="Colors (comma separated)"
              outlined
              class="q-mb-md"
            />

            <!-- Edit Type Input -->
            <q-input v-model="editProductData.type" label="Type (optional)" outlined class="q-mb-md" />

            <q-toggle v-model="useEditUrl" label="Use Image URL" color="primary" class="q-mb-md" />
            <q-input v-if="useEditUrl" v-model="editImageUrls" label="Image URLs (Pisahkan dengan Koma)" outlined class="q-mb-md" />

            <q-uploader v-else label="Upload Image" accept="image/*" multiple @added="onEditFileAdded" />

            <!-- Image Preview List -->
            <div v-if="editProductData.images.length" class="q-mt-md">
              <div class="text-h7 q-mb-sm">Selected Images:</div>
              <div class="row">
                <div v-for="(image, index) in editProductData.images" :key="index" class="col-xs-4 q-mb-sm position-relative">
                  <q-img :src="image" class="q-mr-md product-image" />
                  <q-btn round dense icon="delete" color="negative" @click="removeEditImage(index)" class="remove-btn" />
                </div>
              </div>
            </div>

            <q-btn type="submit" label="Update Product" color="primary" class="full-width q-mt-md" />
          </q-form>
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirm Delete Dialog -->
    <q-dialog v-model="showConfirmDelete">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Delete</div>
        </q-card-section>
        <q-card-section>
          Apakah anda yakin untuk menghapus produk ini?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { db } from '../firebase.js';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      categories: ['Electronics', 'Pakaian', 'Buku', 'Perawatan & Kecantikan', 'Aksesoris'], // Tambahkan kategori yang diinginkan
      products: [],
      newProduct: {
        name: '',
        description: '',
        price: '',
        stock: '',
        images: [],
        category: '', // Menambahkan kategori
        colors: '', // Menambahkan warna sebagai string terpisah koma
        type: '' // Menambahkan tipe
      },
      useUrl: false,
      imageUrls: '', // Menggunakan string untuk banyak URL, dipisahkan koma
      // Existing data properties
      editProductData: {
        id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        images: [],
        category: '', // Menambahkan kategori
        colors: '', // Menambahkan warna sebagai string terpisah koma
        type: '' // Menambahkan tipe
      },
      useEditUrl: false,
      editImageUrls: '', // Menggunakan string untuk banyak URL, dipisahkan koma
      showEditDialog: false,
      productToDelete: null,
      showConfirmDelete: false,
    };
  },
  methods: {
    async addProduct() {
      try {
        if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.stock || (!this.imageUrls && this.newProduct.images.length === 0)) {
          this.$q.notify({
            type: 'negative',
            message: 'Please fill in all required fields'
          });
          return;
        }

        // Memisahkan warna menjadi array
        this.newProduct.colors = this.newProduct.colors.split(',').map(color => color.trim());

        if (this.useUrl) {
          this.newProduct.images = this.imageUrls.split(',').map(url => url.trim());
        }

        await addDoc(collection(db, 'products'), this.newProduct);

        this.newProduct = {
          name: '',
          description: '',
          price: '',
          stock: '',
          images: [],
          category: '', // Reset kategori
          colors: '', // Reset warna
          type: '' // Reset tipe
        };
        this.useUrl = false;
        this.imageUrls = '';
        this.fetchProducts();
      } catch (error) {
        console.error('Error adding product:', error);
      }
    },
    async fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        this.products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async deleteProduct() {
      try {
        if (this.productToDelete) {
          await deleteDoc(doc(db, 'products', this.productToDelete.id));
          this.fetchProducts();
        }
        this.showConfirmDelete = false;
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },
    confirmDelete(product) {
      this.productToDelete = product;
      this.showConfirmDelete = true;
    },
    async updateProduct() {
      try {
        if (!this.editProductData.name || !this.editProductData.price || !this.editProductData.stock || (!this.editImageUrls && this.editProductData.images.length === 0)) {
          this.$q.notify({
            type: 'negative',
            message: 'Please fill in all required fields'
          });
          return;
        }

        // Memisahkan warna menjadi array
        this.editProductData.colors = this.editProductData.colors.split(',').map(color => color.trim());

        if (this.useEditUrl) {
          this.editProductData.images = this.editImageUrls.split(',').map(url => url.trim());
        }

        await updateDoc(doc(db, 'products', this.editProductData.id), this.editProductData);
        this.showEditDialog = false;
        this.editProductData = {
          id: '',
          name: '',
          description: '',
          price: '',
          stock: '',
          images: [],
          category: '', // Reset kategori
          colors: '', // Reset warna
          type: '' // Reset tipe
        };
        this.useEditUrl = false;
        this.editImageUrls = '';
        this.fetchProducts();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },
    editProduct(product) {
      this.editProductData = { ...product };
      this.editProductData.colors = this.editProductData.colors.join(', ');
      this.showEditDialog = true;
    },
    formatPrice(value) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      return formatter.format(value);
    },
    async onFileAdded(files) {
      this.newProduct.images = [];
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = e => {
          this.newProduct.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    async onEditFileAdded(files) {
      this.editProductData.images = [];
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = e => {
          this.editProductData.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    removeEditImage(index) {
      this.editProductData.images.splice(index, 1);
    }
  },
  created() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.product-image {
  max-width: 100%;
  max-height: 100px;
  object-fit: cover;
}
.full-width {
  width: 100%;
}
.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
