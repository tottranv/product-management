<template>
    <a-layout-header class="main-layout-header" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <a-button
            class="trigger text-white inline-flex items-center justify-center shadow-lg bg-transparent border-0 [&_i]:scale-[1.25]"
            type="default" icon="menu" size="small" @click="handleCollapse">
        </a-button>
        <div class="logo" />
    </a-layout-header>
</template>
<script>
export default {
    name: 'HeaderComponent',
    props: {
        collapsed: {
            type: Boolean,
        },
    },
    data() {
        return {
            current: ['profile'],
        }
    },
    methods: {
        handleSignout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.$router.push('/auth/login');
        },
        handleCollapse() {
            this.$emit('onCollapseChange', !this.collapsed);
        },
    }
}
</script>
<style scoped>
.main-layout-header {
    @apply pl-4 h-[54px] flex items-center;
}
</style>