<template>
    <a-layout id="components-layout-demo-top" class="layout">
        <a-layout-content style="padding: 0 50px">
            <div class="flex items-center justify-center" :style="{ minHeight: '96.5vh' }">
                <a-card title="Login" :bordered="false" style="width: 300px">
                    <router-view></router-view>
                </a-card>
            </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
        </a-layout-footer>
    </a-layout>
</template>
<style>
#components-layout-demo-top .logo {
    @apply w-[120px] h-[31px] bg-white bg-opacity-20 m-[16px_24px_16px_0] float-left;
}
</style>