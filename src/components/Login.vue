<template>
    <div class="login">
      <h1>Login Admin</h1>
      <form @submit.prevent="login">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.js'; // Pastikan ini adalah jalur yang benar

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push('/admin');
      } catch (err) {
        error.value = 'Invalid email or password.';
      }
    };

    return { email, password, login, error };
  }
};

  </script>
  
  <style scoped>
  .login {
    padding: 20px;
  }
  form div {
    margin-bottom: 10px;
  }
  </style>
  ../Firebase../firebase.js