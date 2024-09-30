<template>
    <a-layout-sider v-model="collapsed" collapsible>
        <div class="logo" />
        <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
            <a-menu-item key="1">
                <a-icon type="user" />
                <span>Profile</span>
            </a-menu-item>
            <a-sub-menu key="sub1">
                <span slot="title"><a-icon type="laptop" /><span>Product</span></span>
                <a-menu-item key="3">
                    <a-icon type="ordered-list" />
                    List product
                </a-menu-item>
                <a-menu-item key="4">
                    <a-icon type="plus" />
                    Add product
                </a-menu-item>
            </a-sub-menu>
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
    }
}
</script>