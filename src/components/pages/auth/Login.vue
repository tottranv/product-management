<template>
    <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
            <a-input v-decorator="[
                'username',
                { rules: [{ required: true, message: 'Please input your username!' }] },
            ]" placeholder="Username">
                <a-icon slot="prefix" type="user" class="text-tran25" />
            </a-input>
        </a-form-item>
        <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
            <a-input v-decorator="[
                'password',
                { rules: [{ required: true, message: 'Please input your Password!' }] },
            ]" type="password" placeholder="Password">
                <a-icon slot="prefix" type="lock" class="text-tran25" />
            </a-input>
        </a-form-item>
        <p>Hint: <code>emilys</code>/<code>emilyspass</code></p>
        <a-form-item>
            <a-button type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError())">
                Log in
            </a-button>
        </a-form-item>
    </a-form>
</template>

<script>
import { mapActions } from 'vuex';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
    name: 'LoginPage',
    data() {
        return {
            hasErrors,
            form: this.$form.createForm(this, { name: 'horizontal_login' }),
        };
    },
    mounted() {
        this.$nextTick(() => {
            // To disabled submit button at the beginning.
            this.form.validateFields();
        });
    },
    methods: {
        ...mapActions(['login']),
        // Only show error after a field is touched.
        userNameError() {
            const { getFieldError, isFieldTouched } = this.form;
            return isFieldTouched('username') && getFieldError('username');
        },
        // Only show error after a field is touched.
        passwordError() {
            const { getFieldError, isFieldTouched } = this.form;
            return isFieldTouched('password') && getFieldError('password');
        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err) => {//,values
                if (!err) {
                    // console.log('Received values of form: ', values);
                    const username = this.form.getFieldValue('username');
                    const password = this.form.getFieldValue('password');
                    try {
                        this.login({ username, password }).then(() => {
                            this.$router.push('/product/list');
                            this.$message.success(err);
                        }).catch(err => {
                            this.$message.error(err);
                        })
                    } catch (error) {
                        this.$message.error(`Login fail you to some problems: ${error}`);
                    }
                }
            });
        },
    },
};
</script>