<template>
    <div>
        <template v-if="!settings">
            <a-skeleton avatar :paragraph="{ rows: 4 }" />
        </template>
        <template v-else>
            <a-button @click="go('/product/add')" class="flex items-center mb-2" type="primary">
                <a-icon theme="outlined" type="plus" /><span>Add</span></a-button>

            <!-- settings -->
            <div v-if="sharedData && !sharedData.isMobileMode" class="grid grid-cols-4 gap-1 rounded border shadow p-2 mb-2
        [&>div]:border [&>div]:rounded [&>div]:p-2">
                <label name="show-price">
                    Show filter:
                    <a-switch @click="!settings.filters.showPriceRange" size="small"
                        v-model="settings.filters.showPriceRange"
                        @change="onChangeSettings('filters', { showPriceRange: !settings.filters.showPriceRange })"></a-switch>
                </label>
            </div>

            <!-- filters /  sort -->
            <div v-if="settings.filters.showPriceRange" class="grid rounded border shadow p-2 mb-2
        [&>div]:border [&>div]:rounded [&>div]:p-2"
                :class="(sharedData ? !sharedData.isMobileMode ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-2' : '')">
                <div v-if="settings.filters.showPriceRange">
                    {{ (sharedData ? !sharedData.isMobileMode ? 'Filter by price:' : 'Price:' : '') }}
                    <a-slider range :default-value="priceRangeFilter" :min="100000" :max="10000000" :step="100000"
                        :tip-formatter="formatCurrency" v-model="priceRangeFilter"
                        @afterChange="onAfterChange"></a-slider>
                    <p>{{ (sharedData ? !sharedData.isMobileMode ? 'From ' : '' : '') +
                        priceRangeFilter[0].toLocaleString() + (sharedData ? !sharedData.isMobileMode ? 'đ to ' : 'đ - '
                            : '') +
                        priceRangeFilter[1].toLocaleString() +
                        'đ' }}
                    </p>
                </div>
                <div class="flex"
                    :class="sharedData ? !sharedData.isMobileMode ? 'flex-row gap-1' : 'flex-col gap-3' : ''">
                    Instock
                    <label name="show-price">
                        <a-switch @click="!settings.filters.inStock" size="small" v-model="settings.filters.inStock"
                            @change="onChangeSettings('filters', { inStock: settings.filters.inStock === undefined ? true : !settings.filters.inStock })"></a-switch>
                    </label>
                </div>
            </div>
        </template>

        <template v-if="!filteredProducts">
            <a-skeleton avatar :paragraph="{ rows: 4 }" />
        </template>
        <template v-else>
            <!-- new UI product list -->
            <a-list ref="productList" size="small" :data-source="filteredProducts"
                class="border rounded sm:my-2 sm:p-3 max-sm:[&_.ant-list-header]:py-0"
                :style="{ minHeight: `${minHeightContent}px` }" :loading="loading"
                :itemLayout="(sharedData ? !sharedData.isMobileMode ? 'horizontal' : 'vertical' : 'horizontal')">
                <!-- header zone -->
                <div slot="header" class="border p-3 hover:bg-gray-100 flex items-center justify-between"
                    :class="sort.type === 'title' && '[>span]:font-bold'">
                    <span class=" flex items-center gap-1 cursor-pointer">
                        <span @click="setSort('title')"
                            class="flex items-center justify-between hover:opacity-75 hover:underline">
                            <a-icon
                                :type="`arrow-${sort.currentSort && sort.currentSort.type === 'title' && sort.currentSort.by ? 'up' : 'down'}`"
                                v-show="sort.enable && sort.currentSort.type === 'title'"></a-icon>
                            Product's info
                        </span>
                        <a-icon v-if="sort.currentSort && sort.currentSort.type === 'title'" type="close"
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
                <a-list-item slot="renderItem" slot-scope="item"
                    class="product-item hover:border-green-500 hover:bg-gray-100 p-2">
                    <a-button slot="actions" @click="go(`/product/edit/${item.id}`)" class="flex items-center"><a-icon
                            theme="outlined" type="edit" /></a-button>
                    <a-button slot="actions" @click="handleDelete(item.id)" type="danger"
                        class="flex items-center"><a-icon type="delete" /></a-button>

                    <a-list-item-meta :description="item.desc" @click="go(`/product/edit/${item.id}`)">
                        <a slot="title">{{ item.name }}</a>
                        <a-avatar slot="avatar" :src="item.thumbnail"></a-avatar>
                    </a-list-item-meta>
                    <div class="list-item-price text-green-500 font-bold">{{ item.price.toLocaleString() }}đ</div>
                </a-list-item>
            </a-list>
        </template>
    </div>
</template>
<script>
import { EXCHANGE_RAGE } from '@/helpers';
import { mapGetters, mapActions } from 'vuex';

const getSettingsLocal = () => (localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : {
    filters: {
        alwaysShowTooltipPriceRange: true,
        showPriceRange: true,
        inStock: true,
    },
    view: {
        layout: {
            horizontal: true,
        },
    },
});

export default {
    inject: ['sharedData'],
    data() {
        return {
            priceRangeFilter: [100000, 10000000],
            settings: getSettingsLocal(),
            //fields for product data:
            loading: false,
            loadingMore: false,
            // sorting
            sort: {
                enable: false,
                currentSort: undefined,
                sortList: [
                    { type: 'title', by: false, selected: false, },
                    { type: 'price', by: false, selected: false, },
                    //note: false='asc', true='desc'//to more easier when process switch sort
                ],
            },
            //paging
            pageSize: 10,
            //list inside a-list product:
            list: null,
        }
    },
    computed: {
        ...mapGetters(['products']),
        filteredProducts() {
            let filtered = [...this.products];

            if (this.settings.filters.showPriceRange) {
                filtered = filtered.filter(item => item.price >= this.priceRangeFilter[0] && item.price <= this.priceRangeFilter[1]);
            }

            if (this.settings.filters.inStock !== undefined) {
                filtered = filtered.filter(item => {
                    return (item.in_stock > 0) === this.settings.filters.inStock
                });
            }

            return filtered;
        },
        pagination() {
            const totalPage = Math.ceil(this.filteredProducts.length / this.pageSize);
            const totalElements = this.filteredProducts.length;
            return {
                totalPage,
                totalElements,
            };
        },
        minHeightContent() {
            return this.sharedData ? this.sharedData.isMobileMode ? this.sharedData.height - 120 : this.sharedData.height - 320 : 400;
        },
        minHeightListItemContent() {
            return this.minHeightContent ? this.sharedData.isMobileMode ? this.minHeightContent - 90 : this.minHeightContent - 100 : 300;
        },
    },
    watch: {
        filteredProducts(newVal, oldVal) {
            if (newVal.length !== oldVal.length) {
                this.$nextTick(() => {
                    this.setStyle();
                })
            }
        },
    },
    created() {
        this.onFetchProduct({
            query: {
                limit: 25,
                // 'https://dummyjson.com/products?sortBy=title&order=asc'
                ...{
                    ...(this.sort.currentSort ? { sortBy: this.sort.currentSort.type } : {}),
                    ...(this.sort.currentSort ? { order: this.sort.currentSort.by ? 'asc' : 'desc' } : {}),
                },
            },
            exchangeRate: EXCHANGE_RAGE,
            convertToLocaleAmountOnly: this.$helpers.convertToLocaleAmountOnly,
        }, () => {
            this.setStyle();
        });
    },
    mounted() {
        this.$helpers.setBreadcrumbFn([
            { icon: 'home', link: '/', text: 'Home' },
            { text: 'List Product' },
        ], this.setBreadcrumb);
    },
    destroyed() {
        if (this.list) {
            this.list.removeEventListener('scroll', this.onScroll);
        }
        this.$helpers.setBreadcrumbFn([], this.setBreadcrumb);
    },
    methods: {
        ...mapActions(['fetchProducts', 'deleteProduct', 'setBreadcrumb']),
        go(path) {
            this.$router.push(path);
        },
        handleDelete(id) {
            this.$confirm({
                content: `Are you sure delete this product item ${id}?`,
                onOk: async () => {
                    try {
                        await this.deleteProduct(id);
                        this.$message.success('Product deleted successfully');
                    } catch (error) {
                        this.$message.error(error.message);
                    }
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
        async onFetchProduct(options, cb) {
            try {
                this.loading = true;
                await this.fetchProducts(options);
                this.loading = false;
            } catch (error) {
                this.$message.error(error.message);
                this.loading = false;
            } finally {
                typeof cb === 'function' && cb();
            }
        },
        removeSort() {
            this.sort.enable = false;
            this.onFetchProduct({
                query: {
                    limit: 25,
                },
                exchangeRate: EXCHANGE_RAGE,
                convertToLocaleAmountOnly: this.$helpers.convertToLocaleAmountOnly,
            });
        },
        setSort(name) {
            this.sort.sortList = [
                ...this.sort.sortList.map(updateItem => ({ ...updateItem, selected: false })).map(item => {
                    if (item.type === name) {
                        const updatedItem = { ...item, selected: true, by: !item.by };
                        this.sort.currentSort = updatedItem;

                        this.onFetchProduct({
                            query: {
                                limit: 25,
                                // 'https://dummyjson.com/products?sortBy=title&order=asc'
                                ...{
                                    ...(this.sort.currentSort ? { sortBy: this.sort.currentSort.type } : {}),
                                    ...(this.sort.currentSort ? { order: this.sort.currentSort.by ? 'asc' : 'desc' } : {}),
                                },
                            },
                            exchangeRate: EXCHANGE_RAGE,
                            convertToLocaleAmountOnly: this.$helpers.convertToLocaleAmountOnly,
                        });

                        return updatedItem;
                    }
                    return item;
                }),
            ];
            this.sort.enable = true;
        },
        onPageSizeAfterChange(value) {
            this.pageSize = value;
        },
        async onScroll(event) {
            const target = event.target;
            // check scroll end list:
            if (!this.loading && target.scrollTop + target.clientHeight >= target.scrollHeight - 400) {
                this.onFetchProduct({
                    query: {
                        limit: 25,
                        // 'https://dummyjson.com/products?sortBy=title&order=asc'
                        ...{
                            ...(this.sort.currentSort ? { sortBy: this.sort.currentSort.type } : {}),
                            ...(this.sort.currentSort ? { order: this.sort.currentSort.by ? 'asc' : 'desc' } : {}),
                        },
                    },
                    exchangeRate: EXCHANGE_RAGE,
                    convertToLocaleAmountOnly: this.$helpers.convertToLocaleAmountOnly,
                    isLoadMore: true,
                });
            }
        },
        onChangeSettings(parentKey, updateField) {
            if (parentKey in updateField) {
                this.settings = {
                    ...this.settings,
                    filters: {
                        ...this.settings.filters,
                        ...updateField.filters,
                    }
                };
            }
            localStorage.setItem('settings', JSON.stringify(this.settings));
        },
        setStyle() {
            this.list = this.$refs.productList.$el.querySelector('ul.ant-list-items');
            if (this.list) {
                this.$nextTick(() => {
                    this.list.classList.add('overflow-auto');
                    this.list.style.maxHeight = `${this.minHeightListItemContent}px`;

                    const debounced = this.$helpers.debounce(this.onScroll, 250);
                    this.list.addEventListener('scroll', debounced);
                });
            }
        },
    },
};
</script>
<style lang="scss">
.product-item {
    @media screen and (max-width: 576px) {
        .ant-list-item-meta {
            flex-direction: column;
            align-items: center;
        }

        .ant-list-item-meta-avatar {
            .ant-avatar.ant-avatar-circle.ant-avatar-image {
                height: 80px;
                width: auto;

                img {
                    height: 80px;
                }
            }
        }

        .ant-list-item-meta-content {
            max-width: 140px;
            text-align: center;

            .ant-list-item-meta-title {
                margin: 0;
                font-size: 12px;
            }
        }

        .list-item-price {
            text-align: center;
        }

        .ant-list-item-action {
            text-align: center;
            margin-bottom: 8px;
        }
    }
}
</style>