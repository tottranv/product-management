<template>
    <div>
        <div v-if="product">
            <a-button @click="handleBack">Back</a-button>
            <a-form :form="form" @submit="handleSubmit" :wrapper-col="{ span: 24 }">
                <a-form-item label="Name">
                    <a-input
                        v-decorator="['name', { rules: [{ required: true, initialValue: product.name, message: 'Please input name' }] }]" />
                </a-form-item>
                <a-form-item label="Price">
                    <a-input v-decorator="['price', { rules: [{ required: true, message: 'Please input price' }] }]" />
                </a-form-item>
                <a-form-item label="desc">
                    <a-input v-decorator="['desc', { rules: [{ required: true, message: 'Please input desc' }] }]" />
                </a-form-item>
                <a-form-item label="In Stock">
                    <a-checkbox v-model="in_stock" @click="!in_stock" :checked="product.in_stock" />
                </a-form-item>
                <a-form-item>
                    <a-button html-type="submit">Save</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            in_stock: false,
            form: this.$form.createForm(this, { name: 'productEditForm' }),
            product: null,
        }
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
        this.getProduct(id);
    },
    watch: {
        product: {
            handler(product) {
                if (product) {
                    this.form.getFieldDecorator('name', { initialValue: product.name });
                    this.form.getFieldDecorator('price', { initialValue: product.price });
                    this.form.getFieldDecorator('desc', { initialValue: product.desc });
                    this.in_stock = product.in_stock;
                }
            },
            immediate: true,
        }
    },
}
</script>