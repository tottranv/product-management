<template>
    <div>
        <template v-if="!breadcrumb">
            <a-skeleton avatar :paragraph="{ rows: 1 }" />
        </template>
        <template v-else>
            <a-breadcrumb class="pl-4 sm:pl-1 pt-3 sm:mb-3">
                <a-breadcrumb-item v-for="item in breadcrumb" :key="item.text">
                    <router-link v-if="item.link" :to="item.link">
                        <a-icon v-if="item.icon" :type="item.icon" class="mr-1" />
                        <span v-if="item.text">{{ item.text }}</span>
                    </router-link>
                    <span v-else>
                        <a-icon v-if="item.icon" :type="item.icon" class="mr-1" />
                        <span v-if="item.text">{{ item.text }}</span>
                    </span>
                </a-breadcrumb-item>
            </a-breadcrumb>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'BreadcrumbComponent',
    computed: {
        ...mapState(['breadcrumb']),
    }
}
</script>
