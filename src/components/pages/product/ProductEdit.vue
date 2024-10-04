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
        }
    },
    computed: {
        ...mapState(['viewProduct']),
    },
    methods: {
        ...mapActions(['getProductById', 'updateProduct']),
        handleBack() {
            this.$router.back();
        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.updateProduct({
                        id: this.product.id,
                        name: values.name,
                        price: values.price,
                        desc: values.desc,
                        in_stock: this.in_stock,
                    }).then(() => {
                        this.$message.success('Product updated successfully');
                    }).catch(error => {
                        this.$message.error(error);
                    });
                }
            });
        },
        async getProduct(id) {
            this.product = await this.getProductById(id);
        },
    },
    mounted() {
        const id = Number(this.$route.params.id);
        this.getProduct({
            id,
            exchangeRate: EXCHANGE_RAGE,
            convertToLocaleAmountOnly: this.$helpers.convertToLocaleAmountOnly,
        });
    },
    watch: {
        viewProduct: {
            handler(viewProduct) {
                if (viewProduct) {
                    this.form.getFieldDecorator('name', { initialValue: viewProduct.title });
                    this.form.getFieldDecorator('price', { initialValue: viewProduct.price });
                    this.form.getFieldDecorator('desc', { initialValue: viewProduct.description });
                    this.in_stock = viewProduct.stock > 0;
                }
            },
            immediate: true,
        }
    },
}
</script>