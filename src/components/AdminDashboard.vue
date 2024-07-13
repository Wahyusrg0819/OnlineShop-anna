<template>
  <q-page class="container">
    <div class="row justify-center q-mt-xl">
      <q-card class="col-xs-12 col-sm-10 col-md-8 col-lg-6 q-pa-md">
        <q-card-section>
          <div class="text-h6">Add New Product</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="addProduct">
            <q-input v-model="newProduct.name" label="Product Name" outlined class="q-mb-md" />
            <q-input v-model="newProduct.description" label="Description" type="textarea" autogrow outlined class="q-mb-md" />
            <q-input v-model="newProduct.price" label="Price" type="number" outlined class="q-mb-md" />
            <q-input v-model="newProduct.stock" label="Stock" type="number" outlined class="q-mb-md" />

            <!-- Category Input -->
            <q-input v-model="newProduct.category" label="Category" outlined class="q-mb-md" />

            <!-- Color Input -->
            <q-input v-model="newProduct.color" label="Color (optional)" outlined class="q-mb-md" />

            <!-- Type Input -->
            <q-input v-model="newProduct.type" label="Type (optional)" outlined class="q-mb-md" />

            <q-toggle v-model="useUrl" label="Use Image URL" color="primary" class="q-mb-md" />
            <q-input v-if="useUrl" v-model="imageUrl" label="Image URL" outlined class="q-mb-md" @blur="addImageUrl" />
            <q-uploader v-else label="Upload Image" accept="image/*" @added="onFileAdded" />

            <q-btn type="submit" label="Add Product" color="primary" class="full-width q-mt-md" />
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
                <q-item-label caption>Color: {{ product.color || 'N/A' }}</q-item-label>
                <q-item-label caption>Type: {{ product.type || 'N/A' }}</q-item-label>
                <q-item-label caption>Price: {{ product.price }}</q-item-label>
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
            <q-input v-model="editProductData.category" label="Category" outlined class="q-mb-md" />

            <!-- Edit Color Input -->
            <q-input v-model="editProductData.color" label="Color (optional)" outlined class="q-mb-md" />

            <!-- Edit Type Input -->
            <q-input v-model="editProductData.type" label="Type (optional)" outlined class="q-mb-md" />

            <q-toggle v-model="useEditUrl" label="Use Image URL" color="primary" class="q-mb-md" />
            <q-input v-if="useEditUrl" v-model="editImageUrl" label="Image URL" outlined class="q-mb-md" @blur="addEditImageUrl" />
            <q-uploader v-else label="Upload Image" accept="image/*" @added="onEditFileAdded" />

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
          Are you sure you want to delete this product?
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
      products: [],
      newProduct: {
        name: '',
        description: '',
        price: '',
        stock: '',
        images: [],
        category: '', // Menambahkan kategori
        color: '', // Menambahkan warna
        type: '' // Menambahkan tipe
      },
      useUrl: false,
      imageUrl: '',
      // Existing data properties
      editProductData: {
        id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        images: [],
        category: '', // Menambahkan kategori
        color: '', // Menambahkan warna
        type: '' // Menambahkan tipe
      },
      useEditUrl: false,
      editImageUrl: '',
      showEditDialog: false,
      productToDelete: null,
      showConfirmDelete: false,
    };
  },
  methods: {
    async addProduct() {
      try {
        if (!this.newProduct.name || !this.newProduct.description || !this.newProduct.price || !this.newProduct.stock || !this.newProduct.category) {
          this.$q.notify({
            type: 'negative',
            message: 'Please fill out all required fields'
          });
          return;
        }

        const product = { ...this.newProduct, images: this.newProduct.images };
        const docRef = await addDoc(collection(db, 'products'), product);
        
        this.products.push({ id: docRef.id, ...product });
        this.newProduct = {
          name: '',
          description: '',
          price: '',
          stock: '',
          images: [],
          category: '',
          color: '',
          type: ''
        };

        this.$q.notify({
          type: 'positive',
          message: 'Product added successfully'
        });
      } catch (error) {
        console.error('Failed to add product:', error);
      }
    },
    addImageUrl() {
      if (this.imageUrl) {
        this.newProduct.images.push(this.imageUrl);
      }
    },
    onFileAdded(files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = () => {
        this.newProduct.images.push(fileReader.result);
      };
    },
    editProduct(product) {
      this.editProductData = { ...product };
      this.showEditDialog = true;
    },
    addEditImageUrl() {
      if (this.editImageUrl) {
        this.editProductData.images.push(this.editImageUrl);
      }
    },
    onEditFileAdded(files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files[0]);
      fileReader.onload = () => {
        this.editProductData.images.push(fileReader.result);
      };
    },
    async updateProduct() {
      try {
        const productDoc = doc(db, 'products', this.editProductData.id);
        await updateDoc(productDoc, {
          name: this.editProductData.name,
          description: this.editProductData.description,
          price: this.editProductData.price,
          stock: this.editProductData.stock,
          images: this.editProductData.images,
          category: this.editProductData.category,
          color: this.editProductData.color,
          type: this.editProductData.type
        });

        const index = this.products.findIndex(p => p.id === this.editProductData.id);
        if (index !== -1) {
          this.products[index] = { ...this.editProductData };
        }

        this.$q.notify({
          type: 'positive',
          message: 'Product updated successfully'
        });

        this.showEditDialog = false;
      } catch (error) {
        console.error('Failed to update product:', error);
      }
    },
    confirmDelete(product) {
      this.productToDelete = product;
      this.showConfirmDelete = true;
    },
    async deleteProduct() {
      try {
        await deleteDoc(doc(db, 'products', this.productToDelete.id));
        this.products = this.products.filter(p => p.id !== this.productToDelete.id);
        this.showConfirmDelete = false;

        this.$q.notify({
          type: 'positive',
          message: 'Product deleted successfully'
        });
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    },
    async fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });
        this.products = products;
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
.product-image {
  max-width: 50px;
  max-height: 50px;
  display: flex;
  flex-direction: row;
}

.container {
  padding: 20px;
}
</style>
