<template>
  <router-view></router-view>
</template>

<script>
import { EXCHANGE_RAGE } from './helpers';

export default {
  name: 'ProductManagementApp',
  created() {
    this.$store.dispatch('fetchProducts', {
      limit: undefined,
      exchangeRate: EXCHANGE_RAGE,
      convertToLocaleAmountOnly: this.$helpers.convertToLocaleAmountOnly
    });
  },
}
</script>

<style>
#app {
  @apply font-sans text-center text-[#2c3e50] mt-[60px] antialiased;
}
</style>
