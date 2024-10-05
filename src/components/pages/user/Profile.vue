<template>
    <a-card>
        <template v-if="!user">
            <a-skeleton avatar :paragraph="{ rows: 4 }" />
        </template>
        <template v-else>
            <img slot="cover" alt="example" :src="user.image" class="h-40 object-cover" />
            <template slot="actions">
                <a-icon key="setting" type="setting" />
                <a-icon key="edit" type="edit" />
                <a-icon key="ellipsis" type="ellipsis" />
            </template>
            <a-card-meta :title="user.firstName + ' ' + user.lastName" :description="user.company && user.company.name">
                <a-avatar slot="avatar" :src="user.image" />
            </a-card-meta>
        </template>
    </a-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'ProfilePage',
    mounted() {
        this.fetchMe();
        this.$helpers.setBreadcrumbFn([
            { icon: 'home', link: '/', text: 'Home' },
            { text: 'Profile' },
        ], this.setBreadcrumb);
    },
    destroyed() {
        this.$helpers.setBreadcrumbFn([], this.setBreadcrumb);
    },
    computed: {
        ...mapGetters(['user']),
    },
    methods: {
        ...mapActions(['me', 'setBreadcrumb']),
        async fetchMe() {
            try {
                await this.me();
            } catch (error) {
                this.$message.error(error.message);
                this.$helpers.showCountdownMessage(5, () => {
                    this.$router.push('/auth/login');
                });
            }
        }
    },
}
</script>