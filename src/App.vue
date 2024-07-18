<template>
  <div id="app">
    <q-layout>
      <q-header class="header" style="margin-bottom: 50px">
        <q-toolbar>
          
          <q-toolbar-title class="title">
            <q-avatar class="logo" @click="incrementClicks">
              <img src="logo-shop.png" alt="Logo ANNA ZIO STORE" />
            </q-avatar>
            <a>
              <span>A</span><span>N</span><span>N</span><span>A</span> 
              <span>Z</span><span>I</span><span>O</span> 
              <span>S</span><span>T</span><span>O</span><span>R</span><span>E</span>
            </a>
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
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
.logo {
  height: 80px;
  width: auto;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 10px;
  align-self: start;
  /**tambahkan transisi atau hover pada logo ini */
  transition: transform 0.3s;

}

.logo:hover {
  transform: scale(1.1);
}

.title {
  font-size: 50px;
  font-family: Roboto, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 5px;  
  position: relative;
  display: inline-block;
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
  text-align: center;
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
    font-size: 23px;
    display: flex;
    flex-direction: column;
    text-transform: uppercase;
    letter-spacing: 3px; 
    }
}
</style>
