<template>
    <div>
        <a-button @click="handleBack" class="flex items-center mb-2"><a-icon theme="outlined"
                type="back" /><span>Back</span></a-button>
        <a-form :form="form" @submit="handleSubmit" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="Name">
                <a-input placeholder="Name"
                    v-decorator="['name', { rules: [{ required: true, message: 'Please input name' }] }]"></a-input>
            </a-form-item>
            <a-form-item label="Price">
                <a-input placeholder="Price"
                    v-decorator="['price', { rules: [{ required: true, message: 'Please input price' }] }]"
                    type="number"></a-input>
            </a-form-item>
            <a-form-item label="Desc">
                <a-textarea placeholder="Desc"
                    v-decorator="['desc', { rules: [{ required: true, message: 'Please input desc' }] }]"></a-textarea>
            </a-form-item>
            <a-form-item label="In Stock">
                <a-checkbox v-model="stock" :checked="true" @click="!stock"></a-checkbox>
            </a-form-item>
            <a-form-item>
                <a-button html-type="submit">Save</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            stock: false,
            form: this.$form.createForm(this, { name: 'productForm' }),
        }
    },
    mounted() {
        this.$helpers.setBreadcrumbFn([
            { icon: 'home', link: '/', text: 'Home' },
            { icon: 'ordered-list', link: '/', text: 'Products' },
            { text: 'Add Product' },
        ], this.setBreadcrumb);
    },
    destroyed() {
        this.$helpers.setBreadcrumbFn([], this.setBreadcrumb);
    },
    methods: {
        ...mapActions(['addProduct', 'setBreadcrumb']),
        handleBack() {
            this.$router.back();
        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields(
                (err, { name, price, desc }) => {
                    if (!err) {
                        this.addProduct({ title: name, price, desc, stock: this.stock }).then((info) => {
                            this.$message.success(info);
                        }).catch(error => {
                            this.$message.error(error, 10);
                        });
                    }
                }
            );
        }
    }
}
</script>