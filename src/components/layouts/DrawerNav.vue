<template>
    <a-drawer title="Product Management" placement="left" :closable="true" :visible="visible" @close="onClose">
        <a-menu theme="light" class="border-r-0" :default-selected-keys="['1']" mode="inline" @select="selectChange">
            <a-sub-menu key="product">
                <span slot="title"><a-icon type="laptop" /><span>Product</span></span>
                <a-menu-item key="listProduct">
                    <router-link to="/">
                        <a-icon type="ordered-list" />
                        List product
                    </router-link>
                </a-menu-item>
                <a-menu-item key="addProduct">
                    <router-link to="/product/add">
                        <a-icon type="plus" />
                        Add product
                    </router-link>
                </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="user">
                <span slot="title"><a-icon type="user" /><span>User</span></span>
                <a-menu-item key="profile">
                    <router-link to="/profile">
                        <a-icon type="user" />
                        Profile
                    </router-link>
                </a-menu-item>
            </a-sub-menu>
            <a-menu-item key="logout">
                <a-icon type="logout" />
                <span class="nav-text" @click="handleSignout">Logout</span>
            </a-menu-item>
        </a-menu>
    </a-drawer>
</template>
<script>
export default {
    inject: ['sharedData'],
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    methods: {
        handleSignout() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.$router.push('/auth/login');
        },
        onClose(value) {
            this.$emit('onClose', value);
        },
        selectChange(value) {
            if (this.sharedData.isMobileMode) {
                this.onCollapse(!!value);
            }
        },
    }
}
</script>
<style></style>