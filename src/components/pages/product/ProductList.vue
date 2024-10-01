<template>
    <div>
        <a-button @click="go('/product/add')" class="flex items-center mb-2"><a-icon theme="outlined"
                type="plus" /><span>Add</span></a-button>

        <!-- settings -->
        <div class="grid grid-cols-4 gap-1 rounded border shadow p-2 mb-2
        [&>div]:border [&>div]:rounded [&>div]:p-2">
            <label name="show-tooltip" v-if="settings.filters.showPriceRange">
                Show tooltip:
                <a-switch @click="!settings.filters.alwaysShowTooltipPriceRange" size="small"
                    v-model="settings.filters.alwaysShowTooltipPriceRange"><a-icon theme="outlined"
                        type="plus" /></a-switch>
            </label>
            <label name="show-price">
                Show price:
                <a-switch @click="!settings.filters.showPriceRange" size="small"
                    v-model="settings.filters.showPriceRange"><a-icon theme="outlined" type="plus" /></a-switch>
            </label>
            <label name="show-sort">
                Show sort:
                <a-switch @click="!settings.sort.showSort" size="small" v-model="settings.sort.showSort"><a-icon
                        theme="outlined" type="plus" /></a-switch>
            </label>
        </div>

        <!-- filters /  sort -->
        <div v-if="settings.filters.showPriceRange || settings.sort.showSort" class="grid grid-cols-2 gap-4 rounded border shadow p-2 mb-2
        [&>div]:border [&>div]:rounded [&>div]:p-2">
            <div v-if="settings.filters.showPriceRange">
                Filter by price:
                <a-slider :min="10000000" :max="100000000" :step="500000" :tip-formatter="formatCurrency"
                    :default-value="5000000" :tooltip-visible="settings.filters.alwaysShowTooltipPriceRange"
                    v-model="priceRangeFilter" @afterChange="onAfterChange"></a-slider>
                <p>{{ priceRangeFilter.toLocaleString() }} đ</p>
            </div>
            <div v-if="settings.sort.showSort">
                Sort
            </div>
        </div>

        <!-- list -->
        <ul>
            <li class="border p-3 hover:bg-gray-100 flex items-center justify-between"
                v-for="(product, index) in filterdProducts" :key="index">
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
    data() {
        return {
            priceRangeFilter: 10000000,
            settings: {
                filters: {
                    alwaysShowTooltipPriceRange: true,
                    showPriceRange: true,
                },
                sort: {
                    showSort: true,
                }
            }
        }
    },
    computed: {
        ...mapGetters(['products']),
        filterdProducts() {
            return this.products.filter(item => this.priceRangeFilter <= item.price);
        }
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
        formatCurrency(value) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(value);
        },
        onAfterChange(value) {
            this.priceRangeFilter = value;
        },
    },
};
</script>
<style></style>