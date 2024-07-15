<template>
  <div id="app">
    <q-layout>
      <q-header class="header" style="margin-bottom: 50px">
        <q-toolbar>
          
          <q-toolbar-title class="title">
            <q-avatar class="logo" @click="incrementClicks">
            <img src="logo-shop.png" alt="Logo ANNA ZIO STORE" />
          </q-avatar>
            <a> ANNA ZIO STORE </a>
          </q-toolbar-title>
          <q-btn flat round icon="home" @click="goToHome" />
          <q-btn flat round icon="shopping_cart" @click="goToCart" />
          <!-- Admin panel button with v-if -->
          <q-btn v-if="showAdminButton" flat round icon="admin_panel_settings" @click="goToLogin" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>
      <footer>
        <p>© 2024-2027 ANNA ZIO STORE. All rights reserved.</p>
        <p>Powered by Q-Vue</p>
        <p>Version 1.0.0</p>
        <p>Last updated: 2024-07-12</p>
      </footer>
    </q-layout>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      clicks: 0,
      showAdminButton: false
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
    },
    incrementClicks() {
      this.clicks++;
      if (this.clicks >= 5) {
        this.showAdminButton = true;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
.logo {
  height: 80px;
  width: auto;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
  align-self: start;
}

.title {
  font-size: 45px;
  font-family: Nunito;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;  
}


.header {
  background-color: #37B7C3;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
}

footer {
  background-color: #37B7C3;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-top: 50px;
}

@media (max-width :480px) {
  .logo {
    height: 60px;
    width: auto;
    margin-bottom: 5%;
  }

  .title {
    font-size: 20px;
    display: flex;
    flex-direction: column;
  }
}
</style>
