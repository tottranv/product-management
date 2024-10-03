<template>
    <a-layout-sider v-model="collapsed" collapsible>
        <div class="logo" />
        <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
            <a-sub-menu key="sub1">
                <span slot="title"><a-icon type="laptop" /><span>Product</span></span>
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
    </a-layout-sider>
</template>
<script>
export default {
    name: 'SiderBar',
    data() {
        return {
            collapsed: false
        }
    },
    methods: {
        handleSignout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.$router.push('/auth/login');
        }
    }
}
</script>