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
            //prepare accessToken
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                try {
                    // fetch me by accessToken
                    const firstGetMeResponse = await fetchMe(accessToken);

                    // accessToken expired:
                    if(firstGetMeResponse.status === 401){
                        // prepare refreshToken
                        const refreshToken = localStorage.getItem('refreshToken');
                        if(refreshToken) {

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
                                return Promise.reject('Fail re get accessToken.', refreshResponse);
                            }

                            // if ok:
                            const refetchTokenData = await refreshResponse.json();//re get tokens

                            // check tokens:
                            if(refetchTokenData && 'accessToken' in refetchTokenData && 'refreshToken' in refetchTokenData) {
                                // save tokens:
                                localStorage.setItem('accessToken', refetchTokenData.accessToken);
                                localStorage.setItem('refreshToken', refetchTokenData.refreshToken);

                                // re get me:
                                const secondGetMeResponse = await fetchMe(refetchTokenData.accessToken);
                                
                                // get me failed:
                                if(!secondGetMeResponse.ok) {
                                    return Promise.reject('Fail get me again', secondGetMeResponse);
                                }

                                // if re get me ok:
                                const reGetMeData = await secondGetMeResponse.json();
                                if('username' in reGetMeData) {
                                    // console.log('getted user at 2', reGetMeData);
                                    
                                    commit('me', reGetMeData);
                                    return Promise.resolve('Success re get me.');
                                } else {
                                    return Promise.reject('User is unvalid');
                                }
                            } else {
                                return Promise.reject('Re get tokens unvalid');
                            }
                        } else {
                            return Promise.reject('Refresh token expired');
                        }
                    } else {
                        const meData = await firstGetMeResponse.json();
                        // console.log('getted user at 1', meData);

                        commit('me', meData);
                        return Promise.resolve('Success to get user info');
                    }
                } catch (error) {
                    return Promise.reject('Fail to get user info');
                }
            } else {
                return Promise.reject('Dont have access token. Please login.');
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
                      expiresInMins: 30,
                    }),
                    // credentials: 'include'
                });

                if(!response.ok) {
                    if(response.status===400) {
                        return Promise.reject('Invalid username or password!');
                    } else {
                        const jsonError = await response.json();
                        if('message' in jsonError) {
                            return Promise.reject(`Error: ${jsonError.message}`);
                        }
                        // throw new Error(`HTTP error! status: ${response.status}`);
                        return Promise.reject(`Error: ${JSON.stringify(jsonError)}`);
                    }
                }

                const jsonLogin = await response.json();
                localStorage.setItem('accessToken', jsonLogin.accessToken);
                localStorage.setItem('refreshToken', jsonLogin.refreshToken);
                commit('login', jsonLogin);
                return Promise.resolve('Success to login');
            } catch (error) {
                return Promise.reject('Error login:', 'message' in error ? error.message : error);
            }
        },
        async fetchProducts({ commit, state }, {query: { limit = 10, sortBy, order }, exchangeRate = 24600, convertToLocaleAmountOnly, isLoadMore = false}) {
            const skip = isLoadMore ? state.products.length - 1 : 0;
            const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}${sortBy ? `&sortBy=${sortBy}` : ''}${order ? `&order=${order}` : ''}&select=id,title,price,description,stock,images,thumbnail`;
            try {
                const response = await fetch(url);
                if(!response.ok) {
                    // throw new Error(`HTTP error! status: ${response.status}`);
                    return Promise.reject(`HTTP error! status: ${response.status}`);
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
                    return Promise.resolve('Success to fetch product.');
                } else {
                    return Promise.reject('Invalid data format:', products);
                }
            } catch (error) {
                return Promise.reject('Error fetching products:', error);
            }
        },
        async getProductById({ commit }, { id }) {
            try {
                const response = await fetch(`https://dummyjson.com/products/${id}`);
                if(!response.ok) {
                    return Promise.reject(`Fetch product ${id} failed. ${JSON.stringify(response.statusText)}`);
                }
                const result = await response.json();
                if(result) {
                    commit('getProductById', result);
                    return Promise.resolve(result);
                }
            } catch (error) {
                return Promise.reject(`Fetch product ${id} failed. ${JSON.stringify(error)}`);
            }
        },
        async addProduct({ commit }, product) {
            const response = await fetch('https://dummyjson.com/products/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...product,
                })
            });

            if(!response.ok) {
                return Promise.reject(`Add failed! ${response.statusText}`);
            }

            const productResponse = await response.json();
            if(productResponse) {
                commit('addProduct', product);
                return Promise.resolve('Successfully! This product only local added. This product not visible in list because the data loaded from mock server.');
            } else {
                return Promise.reject(`Add has some problem. ${JSON.stringify(productResponse)}`);
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
    },
    getters: {
        products:  (state) => state.products,
        viewProduct: (state) => state.viewProduct,
        user: (state) => state.user,
    }
});
