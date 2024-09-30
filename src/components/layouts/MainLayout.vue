<template>
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
        <Sidebar />
        <a-layout>
            <Header />
            <a-layout-content style="margin: 0 16px">
                <a-breadcrumb style="margin: 16px 0">
                    <a-breadcrumb-item>Product</a-breadcrumb-item>
                    <a-breadcrumb-item>Laptop</a-breadcrumb-item>
                </a-breadcrumb>
                <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
                    <router-view />
                </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center">
                Ant Design ©2018 Created by Ant UED
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script>
import Header from './Header.vue';
import Sidebar from './Sidebar.vue';

export default {
    components: {
        Sidebar,
        Header,
    },
};
</script>

<style>
#components-layout-demo-side .logo {
    @apply h-[32px] bg-white bg-opacity-20 m-[16px];
}
</style>