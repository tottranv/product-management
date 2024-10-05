<template>
    <div>
        <template v-if="!viewProduct">
            <a-skeleton avatar :paragraph="{ rows: 4 }" />
        </template>
        <template v-else>
            <a-button @click="handleBack">Back</a-button>
            <a-form :form="form" @submit="handleSubmit" :wrapper-col="{ span: 24 }">
                <img v-for="(image, index) in viewProduct.images" :key="index"
                    :alt="`${viewProduct.name}'s image ${++index}'`" :src="image" class="w-20" />
                <a-form-item label="Name">
                    <a-input v-decorator="['name', { rules: [{ required: true, message: 'Please input name' }] }]" />
                </a-form-item>
                <a-form-item label="Price">
                    <a-input v-decorator="['price', { rules: [{ required: true, message: 'Please input price' }] }]" />
                </a-form-item>
                <a-form-item label="desc">
                    <a-input v-decorator="['desc', { rules: [{ required: true, message: 'Please input desc' }] }]" />
                </a-form-item>
                <a-form-item label="In Stock">
                    <a-checkbox v-model="in_stock" @click="!in_stock" :checked="viewProduct.in_stock" />
                </a-form-item>
                <a-form-item>
                    <a-button html-type="submit">Save</a-button>
                </a-form-item>
            </a-form>
        </template>
    </div>
</template>
<script>
import { EXCHANGE_RAGE } from '@/helpers';
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            in_stock: false,
            form: this.$form.createForm(this, { name: 'productEditForm' }),
            id: this.$route.params.id,
        }
    },
    computed: {
        ...mapState(['viewProduct']),
    },
    created() {
        this.onGetProduct();
    },
    mounted() {
        this.$helpers.setBreadcrumbFn([
            { icon: 'home', link: '/', text: 'Home' },
            { icon: 'ordered-list', link: '/', text: 'Products' },
            { text: 'Edit Product' },
        ], this.setBreadcrumb);
    },
    destroyed() {
        this.$helpers.setBreadcrumbFn([], this.setBreadcrumb);
    },
    methods: {
        ...mapActions(['getProductById', 'updateProduct', 'setBreadcrumb']),
        handleBack() {
            this.$router.back();
        },
        async onGetProduct() {
            try {
                await this.getProductById({ id: this.id });
            } catch (error) {
                this.$message.error(error.message);
            }
        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields(async (err, { name, price, desc }) => {
                if (err) {
                    this.$message.error('Form input invalid!');
                } else {
                    try {
                        const result = await this.updateProduct({
                            id: this.viewProduct.id,
                            title: name,
                            price,
                            description: desc,
                            stock: this.in_stock,
                        });
                        this.$message.success(result);
                        this.$router.push({ name: 'productList' });
                    } catch (error) {
                        this.$message.error(error.message);
                    }
                }
            });
        },
    },
    watch: {
        viewProduct: {
            handler(viewProduct) {
                if (viewProduct) {
                    this.form.getFieldDecorator('name', { initialValue: viewProduct.title });
                    this.form.getFieldDecorator('price', { initialValue: this.$helpers.convertToLocaleAmountOnly(EXCHANGE_RAGE, viewProduct.price).toLocaleString() });
                    this.form.getFieldDecorator('desc', { initialValue: viewProduct.description });
                    this.in_stock = viewProduct.stock > 0;
                }
            },
            immediate: true,
        }
    },
}
</script>