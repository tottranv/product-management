<template>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div class="logo" />
        <a-menu v-model="current" mode="horizontal" theme="dark" style="line-height: 64px">
            <a-sub-menu>
                <span slot="title"><a-icon type="laptop" />Product</span>
                <a-menu-item key="1">
                    <router-link to="/">
                        <a-icon type="ordered-list" />
                        List product
                    </router-link>
                </a-menu-item>
                <a-menu-item key="2">
                    <router-link to="/product/add">
                        <a-icon type="plus" />
                        Add product
                    </router-link>
                </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2">
                <span slot="title"><a-icon type="user" /><span>User</span></span>
                <a-menu-item key="3">
                    <router-link to="/profile">
                        <a-icon type="user" />
                        Profile
                    </router-link>
                </a-menu-item>
            </a-sub-menu>
            <a-menu-item key="4">
                <a-icon type="logout" />
                <span class="nav-text" @click="handleSignout">Logout</span>
            </a-menu-item>
        </a-menu>
    </a-layout-header>
</template>
<script>
export default {
    name: 'HeaderComponent',
    data() {
        return {
            current: ['mail']
        }
    },
    methods: {
        handleSignout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.$router.push('/auth/login');
        },
        onCollapse(collapsed) {
            localStorage.setItem('sidebarCollapsed', collapsed ? 1 : 0);
        },
    }
}
</script>
