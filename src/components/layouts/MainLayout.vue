<template>
    <a-layout id="components-layout-demo-fixed" style="min-height: 100vh">
        <Sidebar v-if="!sharedData.isMobileMode" />
        <a-layout>
            <Header v-if="sharedData.isMobileMode" />
            <a-layout-content class="main-layout-content">
                <Breadcrumb />
                <div class="main-content-inner">
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
import Vue from 'vue';

export default {
    components: {
        Sidebar: () => import('./Sidebar.vue'),
        Header: () => import('./Header.vue'),
        Breadcrumb: () => import('./Breadcrumb.vue'),
    },
    data() {
        return {
            sharedData: Vue.observable({
                isMobileMode: this.getMobileMode(window.innerWidth),
                width: window.innerWidth,
                height: window.innerHeight,
            }),
        };
    },
    provide() {
        return {
            sharedData: this.sharedData,
        }
    },
    mounted() {
        const debounced = this.$helpers.debounce(this.onResize, 250);
        window.addEventListener('resize', debounced);
    },
    destroyed() {
        window.removeEventListener('resize', this.onResize);
    },
    methods: {
        getMobileMode(width) {
            return width < 640;
        },
        onResize(event) {
            this.sharedData.isMobileMode = event.currentTarget && this.getMobileMode(event.currentTarget.innerWidth);
            this.sharedData.width = window.innerWidth;
            this.sharedData.height = window.innerHeight;
        }
    },
};
</script>

<style scoped lang="scss">
#components-layout-demo-fixed {
    .logo {
        @apply w-[80px] sm:w-[120px] h-[32px] bg-white/20 float-left my-4 sm:m-4;
    }

    .main-layout-content {
        @apply m-[60px_0_0_0] sm:m-4;

        .main-content-inner {
            @apply p-3 sm:p-4 bg-white min-h-screen;
        }
    }
}
</style>
