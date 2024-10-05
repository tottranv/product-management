import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

async function fetchMe(accessToken) {
    return await fetch('https://dummyjson.com/auth/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`, // Pass JWT via Authorization header
        },
        // credentials: 'include' // Include cookies (e.g., accessToken) in the request
    });
}

export default new Vuex.Store({
    state: {
        products: [],
        user: null,
        viewProduct: null,
        breadcrumb: []
    },
    mutations: {
        me(state, user) {
            state.user = user;
        },
        login(state, user) {
            state.user = user;
        },
        initialProducts(state, products) {
            state.products = products;
        },
        loadMoreProducts(state, moreProducts) {
            state.products = state.products.concat(moreProducts);
        },
        getProductById(state, product) {
            state.viewProduct = product;
        },
        addProduct(state, product) {
            state.products.push(product);
        },
        updateProduct(state, product) {
            state.viewProduct = product;
        },
        deleteProduct(state, id) {
            const idx = state.products.findIndex(item => item.id === id);
            state.products.splice(idx, 1);
        },
    },
    actions: {
        async me({ commit }) {
            try {
                let errorMessage = '';
                // ACCESS TOKEN TO GET API ME: prepare accessToken
                const accessToken = localStorage.getItem('accessToken');
                if(!accessToken) {
                    throw new Error('Do not have access token. Please login.');
                }

                // GET: fetch me by accessToken
                const firstGetMeResponse = await fetchMe(accessToken);

                // IF OK:
                if(!firstGetMeResponse.ok) {
                    // IF FAIL BECAUSE OTHER CASES:
                    if(firstGetMeResponse.status !== 401) {
                        errorMessage = await firstGetMeResponse.json();
                        throw new Error(`Fail token because other case. Cause ${errorMessage.message}`);
                    }

                    // IF ACCESS TOKEN EXPIRED: prepare refreshToken
                    const refreshToken = localStorage.getItem('refreshToken');
                    if(!refreshToken) {
                        throw new Error('Prepare refresh token has been failed.');
                    }

                    // re get accessToken by refreshToken:
                    const refreshResponse = await fetch('https://dummyjson.com/auth/refresh', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            refreshToken, // Optional, if not provided, the server will use the cookie
                            expiresInMins: 60 * 24 * 30, //30 days // optional (FOR ACCESS TOKEN), defaults to 60
                        }),
                        // credentials: 'include' // Include cookies (e.g., accessToken) in the request
                    });

                    // re get accessToken error:
                    if(!refreshResponse.ok) {
                        errorMessage = await refreshResponse.json();
                        throw new Error('Fail refresh accessToken. Cause ' + errorMessage.message);
                    }

                    // if ok:
                    const refetchTokenData = await refreshResponse.json();//re get tokens
                    // check tokens:
                    if(!refetchTokenData && !('accessToken' in refetchTokenData) && !('refreshToken' in refetchTokenData)) {
                        throw new Error('The tokens refreshed was unvalid.');
                    }

                    // save tokens:
                    localStorage.setItem('accessToken', refetchTokenData.accessToken);
                    localStorage.setItem('refreshToken', refetchTokenData.refreshToken);

                    // re get me:
                    const getMeAgainResponse = await fetchMe(refetchTokenData.accessToken);
                    
                    // get me failed:
                    if(!getMeAgainResponse.ok) {
                        errorMessage = await getMeAgainResponse.json();
                        throw new Error('Fail get me again. Cause ' + errorMessage.message);
                    }

                    // if re get me ok:
                    const getMeAgainJsonData = await getMeAgainResponse.json();
                    if(!('username' in getMeAgainJsonData)) {
                        throw new Error('Getted user data is unvalid');
                    }

                    commit('me', getMeAgainJsonData);
                    return 'Success get me again';
                }

                const meData = await firstGetMeResponse.json();
                commit('me', meData);
                return 'Success to get user info.';
            } catch (error) {
                throw new Error(error);
            }
        },
        async login({ commit }, { username, password }) {
            try {
                const response = await fetch('https://dummyjson.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      username,
                      password,
                      expiresInMins: 5,
                    }),
                    // credentials: 'include'
                });

                if(!response.ok) {
                    const errorMessage = await response.json();
                    throw new Error(errorMessage.message);
                }

                const loginJsonData = await response.json();
                localStorage.setItem('accessToken', loginJsonData.accessToken);
                localStorage.setItem('refreshToken', loginJsonData.refreshToken);

                commit('login', loginJsonData);
                
                return 'Login successfully!';
            } catch (error) {
                throw new Error(error.message);
            }
        },
        async fetchProducts({ commit, state }, {query: { limit = 10, sortBy, order }, exchangeRate = 24600, convertToLocaleAmountOnly, isLoadMore = false}) {
            const skip = isLoadMore ? state.products.length - 1 : 0;
            const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}${
                sortBy ? `&sortBy=${sortBy}` : ''}${
                order ? `&order=${order}` : ''
            }&select=id,title,price,description,stock,images,thumbnail`;
            try {
                const response = await fetch(url);
                if(!response.ok) {
                    const errorMessage = await response.json();
                    throw new Error(errorMessage.message);
                }
                const { products } = await response.json();
                if(products && Array.isArray(products)) {
                    const convertProducts = products.map(({
                        id,title,price,description,stock,images,thumbnail
                    }) => ({
                        id, name: title,
                        price: convertToLocaleAmountOnly(exchangeRate, price), description,
                        images, thumbnail,
                        in_stock: stock,
                    }));
                    commit(isLoadMore ? 'loadMoreProducts' : 'initialProducts', convertProducts);
                    return 'Success to fetch product.';
                } else {
                    throw new Error('Invalid data format ' + JSON.stringify(products));
                }
            } catch (error) {
                throw new Error(error.message);
            }
        },
        async getProductById({ commit }, { id }) {
            try {
                const response = await fetch(`https://dummyjson.com/products/${id}`);
                if(!response.ok) {
                    const errorMessage = await response.json();
                    throw new Error(errorMessage.message);
                }
                const product = await response.json();
                if(product) {
                    commit('getProductById', product);
                    return 'Get product successfully!';
                }
            } catch (error) {
                throw new Error(error.message);
            }
        },
        async addProduct({ commit }, product) {
            try {
                const response = await fetch('https://dummyjson.com/products/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...product,
                    })
                });
    
                const jsonResponse = await response.json();

                if(!response.ok) {
                    throw new Error(`Add failed! ${jsonResponse.message}`);
                }
    
                if(jsonResponse) {
                    commit('addProduct', jsonResponse);
                    return 'Mock server response successfully add api.';
                } else {
                    throw new Error(JSON.stringify(jsonResponse));
                }
            } catch (error) {
                throw new Error(error.message);
            }    
        },
        async updateProduct({ commit }, { id, title }) {
            /* updating title of product with id */
            const response = await fetch(`https://dummyjson.com/products/${id}`, {
                method: 'PATCH', /* or PATCH */
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                })
            });
            
            if(!response.ok) {
                return Promise.reject(`Update failed! ${response.statusText}`);
            }

            const productResponse = await response.json();
            commit('updateProduct', productResponse);
            return Promise.resolve('Product is updated');
        },
        async deleteProduct({ commit }, id) {
            /* delete product with id */
            const response = await fetch(`https://dummyjson.com/products/${id}`, {
                method: 'DELETE',
            });
            
            if(!response.ok) {
                return Promise.reject(`Delete failed! ${response.statusText}`);
            }

            commit('deleteProduct', id);
            return Promise.resolve('Product is deleted');
        },
        setBreadcrumb: ({state}, breadcrumb) => {
            state.breadcrumb = breadcrumb;
        },
    },
    getters: {
        products:  (state) => state.products,
        viewProduct: (state) => state.viewProduct,
        user: (state) => state.user,
    }
});
