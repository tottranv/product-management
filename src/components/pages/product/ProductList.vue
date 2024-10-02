<template>
    <div>
        <a-button @click="go('/product/add')" class="flex items-center mb-2"><a-icon theme="outlined"
                type="plus" /><span>Add</span></a-button>

        <!-- settings -->
        <div class="grid grid-cols-4 gap-1 rounded border shadow p-2 mb-2
        [&>div]:border [&>div]:rounded [&>div]:p-2">
            <label name="show-price">
                Show filter:
                <a-switch @click="!settings.filters.showPriceRange" size="small"
                    v-model="settings.filters.showPriceRange"><a-icon theme="outlined" type="plus" /></a-switch>
            </label>
        </div>

        <!-- filters /  sort -->
        <div v-if="settings.filters.showPriceRange || settings.sort.showSort" class="grid grid-cols-1 gap-4 rounded border shadow p-2 mb-2
        [&>div]:border [&>div]:rounded [&>div]:p-2">
            <div v-if="settings.filters.showPriceRange">
                Filter by price:
                <a-slider :min="10000000" :max="100000000" :step="500000" :tip-formatter="formatCurrency"
                    :default-value="5000000" v-model="priceRangeFilter" @afterChange="onAfterChange"></a-slider>
                <p>{{ 'From ' + priceRangeFilter.toLocaleString() }} đ</p>
            </div>
        </div>

        <!-- new UI product list -->
        <a-list :data-source="filterdProducts" class="border rounded my-2 p-3" :loading="loading">
            <!-- header zone -->
            <div slot="header" class="border p-3 hover:bg-gray-100 flex items-center justify-between"
                :class="sort.type === ' name' && '[>span]:font-bold'">
                <span class=" flex items-center gap-1 cursor-pointer">
                    <span @click="setSort('name')"
                        class="flex items-center justify-between hover:opacity-75 hover:underline">
                        <a-icon
                            :type="`arrow-${sort.currentSort && sort.currentSort.type === 'name' && sort.currentSort.by ? 'up' : 'down'}`"
                            v-show="sort.enable && sort.currentSort.type === 'name'"></a-icon>
                        Product's info
                    </span>
                    <a-icon v-if="sort.currentSort && sort.currentSort.type === 'name'" type="close"
                        v-show="sort.enable" @click="removeSort"></a-icon>
                </span>

                <span class="flex items-center gap-1 cursor-pointer">
                    <span @click="setSort('price')"
                        class="flex items-center justify-between hover:opacity-75 hover:underline">
                        <a-icon
                            :type="`arrow-${sort.currentSort && sort.currentSort.type === 'price' && sort.currentSort.by ? 'up' : 'down'}`"
                            v-show="sort.enable && sort.currentSort.type === 'price'"></a-icon>
                        Price
                    </span>
                    <a-icon v-if="sort.currentSort && sort.currentSort.type === 'price'" type="close"
                        v-show="sort.enable" @click="removeSort"></a-icon>
                </span>

                <span>Action</span>
            </div>

            <!-- item zone -->
            <a-list-item slot="renderItem" slot-scope="item">
                <a-button slot="actions" @click="go(`/product/edit/${item.id}`)" class="flex items-center"><a-icon
                        theme="outlined" type="edit" /></a-button>
                <a-button slot="actions" @click="handleDelete(item.id)" type="danger" class="flex items-center"><a-icon
                        type="delete" /></a-button>

                <a-list-item-meta :description="item.desc">
                    <a slot="title">{{ item.name }}</a>
                    <a-avatar slot="avatar" src="https://dummyjson.com/image/80"></a-avatar>
                </a-list-item-meta>
                <div class="text-green-500 font-bold">{{ item.price.toLocaleString() }}đ</div>
            </a-list-item>
        </a-list>
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
            },
            //fields for product data:
            loading: false,
            loadingMore: false,
            // sorting
            sort: {
                enable: false,
                currentSort: undefined,
                sortList: [
                    { type: 'name', by: false, selected: false, },
                    { type: 'price', by: false, selected: false, },
                    //note: false='asc', true='desc'//to more easier when process switch sort
                ],
            },
        }
    },
    computed: {
        ...mapGetters(['products']),
        filterdProducts() {
            let filtered = [...this.products];
            filtered = filtered.filter(item => item.price <= this.priceRangeFilter);

            //if sort enabled:
            if (this.sort.enable) {
                const { by, type } = this.sort.sortList.find(item => item.selected);
                filtered = filtered.sort((a, b) => {
                    switch (type) {
                        case 'name': {
                            return by ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                        }
                        case 'price': {
                            return by ? a.price - b.price : b.price - a.price;
                        }
                        default: return 0;
                    }
                });
            }
            return filtered;
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
        removeSort() {
            this.sort.enable = false;
        },
        setSort(name) {
            this.sort.sortList = [
                ...this.sort.sortList.map(updateItem => ({ ...updateItem, selected: false })).map(item => {
                    if (item.type === name) {
                        const updatedItem = { ...item, selected: true, by: !item.by };
                        this.sort.currentSort = updatedItem;
                        return updatedItem;
                    }
                    return item;
                }),
            ];
            this.sort.enable = true;
        },
    },
};
</script>
<style></style>