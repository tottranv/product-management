<template>
    <a-layout id="components-layout-demo-side" style="min-height: 100vh">
        <Sidebar />
        <a-layout>
            <Header />
            <a-layout-content style="margin: 16px 16px 0 16px">
                <Breadcrumb />
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
export default {
    components: {
        Sidebar: () => import('./Sidebar.vue'),
        Header: () => import('./Header.vue'),
        Breadcrumb: () => import('./Breadcrumb.vue'),
    },
};
</script>

<style>
#components-layout-demo-side .logo {
    @apply h-[32px] bg-white bg-opacity-20 m-[16px];
}
</style>