<template>
    <div>
        <a-card>
            <template v-if="!user">
                <a-skeleton avatar :paragraph="{ rows: 4 }" />
            </template>
            <template v-else>
                <img slot="cover" alt="example" :src="user.image" class="h-40 object-cover" />
                <a-card-meta :title="user.firstName + ' ' + user.lastName"
                    :description="user.company && user.company.name">
                    <a-avatar slot="avatar" :src="user.image" />
                </a-card-meta>
            </template>
        </a-card>
    </div>
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
                this.$helpers.showCountdownMessage(() => {
                    this.$router.push('/auth/login');
                }, 3);
            }
        }
    },
}
</script>