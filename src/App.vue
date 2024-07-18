<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
import router from './router';

export default defineComponent({
  name: 'App',
  components:{ router }
});
</script>