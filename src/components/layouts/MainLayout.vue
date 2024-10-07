<template>
    <a-layout id="components-layout-demo-fixed" class="h-[100vh] overflow-hidden">
        <Sidebar v-show="!sharedData.isMobileMode" :collapsed="collapsedSidebar"
            @onCollapseSidebar="collapseSiderChange" />

        <DrawerNav v-show="sharedData.isMobileMode" :visible="visibleDrawerNav" @onClose="onClose" />
        <a-layout>
            <Header v-if="sharedData.isMobileMode" :collapsed="visibleDrawerNav"
                @onCollapseChange="collapseSiderChange" />
            <a-layout-content class="main-layout-content">
                <Breadcrumb />
                <div class="main-content-inner">
                    <router-view />
                </div>
            </a-layout-content>
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
        DrawerNav: () => import('./DrawerNav.vue'),
    },
    data() {
        return {
            collapsedSidebar: Boolean(Number(localStorage.getItem('sidebarCollapsed'))),
            visibleDrawerNav: Boolean(Number(localStorage.getItem('visibleDrawerNav'))),
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
        onResize() {
            this.sharedData.isMobileMode = this.getMobileMode(window.innerWidth);
            this.sharedData.width = window.innerWidth;
            this.sharedData.height = window.innerHeight;
        },
        collapseSiderChange(value) {
            if (this.sharedData.isMobileMode) {
                this.visibleDrawerNav = true;
                localStorage.setItem('visibleDrawerNav', 1);
            } else {
                this.collapsedSidebar = value;
                localStorage.setItem('sidebarCollapsed', value ? 1 : 0);
            }
        },
        onClose() {
            this.visibleDrawerNav = false;
            localStorage.setItem('visibleDrawerNav', 0);
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
        @apply m-[54px_0_0_0] sm:m-4;

        .main-content-inner {
            @apply p-3 p-4 min-h-screen;
        }
    }
}
</style>
