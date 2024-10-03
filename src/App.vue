<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ProductManagementApp',
  created() {
    this.$store.dispatch('fetchProducts', {
      limit: undefined,
      exchangeRate: 24500,
      convertToLocaleAmountOnly: this.$helpers.convertToLocaleAmountOnly
    });
  },
  methods: {
    ...mapActions(['initialProducts']),
  },
}
</script>

<style>
#app {
  @apply font-sans text-center text-[#2c3e50] mt-[60px] antialiased;
}
</style>
