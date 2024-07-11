<template>
  <div id="app">
    <q-layout>
      <q-header class="header">
        <q-toolbar>
          <q-toolbar-title class="title">
            <q-avatar class="logo">
              <img src="logo-shop.png" alt="Logo ANNA ZIO STORE" />
            </q-avatar>
            ANNA ZIO STORE
          </q-toolbar-title>
          
          <q-btn flat round icon="home" @click="goToHome" />
          <q-btn flat round icon="shopping_cart" @click="goToCart" />

          <!-- Admin panel button with v-if -->
          <q-btn v-if="isAdmin" flat round icon="admin_panel_settings" @click="goToLogin" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAdmin: true // Example condition to determine admin status
    };
  },
  methods: {
    goToHome() {
      this.$router.push('/');
    },
    goToCart() {
      this.$router.push('/cart');
    },
    goToLogin() {
      this.$router.push('/login');
    }
  },
  mounted() {
    // Example: Check user role or authentication status to set isAdmin
    // Replace this with your actual logic to determine if user is admin
    // For demonstration, let's assume true for admin
    this.isAdmin = true;
  }
};
</script>

<style scoped>
.q-toolbar-title {
  flex: 1;
  text-align: center;
}

.logo {
  height: 80px;
  width: auto;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
}

.title {
  font-size: 45px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.header {
  background-color: #BB9AB1;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
}
</style>
