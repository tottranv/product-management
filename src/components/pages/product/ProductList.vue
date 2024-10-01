<template>
    <div>
        <a-button @click="go('/product/add')" class="flex items-center mb-2"><a-icon theme="outlined"
                type="plus" /><span>Add</span></a-button>
        <ul>
            <li class="border p-3 hover:bg-gray-100 flex items-center justify-between"
                v-for="(product, index) in products" :key="index">
                {{ product.name }}
                <a-button-group class="flex gap-x-2">
                    <a-button @click="go(`/product/edit/${product.id}`)" class="flex items-center"><a-icon
                            theme="outlined" type="edit" /></a-button>
                    <a-button @click="handleDelete(product.id)" type="danger" class="flex items-center"><a-icon
                            type="delete" /></a-button>
                </a-button-group>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters(['products']),
    },
    methods: {
        ...mapActions(['deleteProduct']),
        go(path) {
            this.$router.push(path);
        },
        handleDelete(id) {
            this.$confirm({
                content: 'Are you sure delete this product item?',
                onOk: () => {
                    this.deleteProduct(id).then(() => {
                        this.$message.success('Product deleted successfully');
                    }).catch(error => {
                        this.$message.error(error);
                    });
                },
                onCancel: () => {
                    // console.log('Cancel');
                },
            });
        },
    },
};
</script>
<style></style>