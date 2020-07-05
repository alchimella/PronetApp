import Vue from 'vue'
import Vuex from 'vuex'
import { Platform } from 'quasar'

// import example from './module-example'

Vue.use(Vuex)

/*
* If not building with SSR mode, you can
* directly export the Store instantiation;
*
* The function below can be async too; either use
* async/await or return a Promise which resolves
* with the Store instance.
*/

export default function (/* { ssrContext } */) {
    const Store = new Vuex.Store({
        modules: {
            // example
        },

        state: {
            account: '',
            phone: '',
            errorMessage: '',
            coupons: [],
            isUserExist: false
        },

        getters: {
            account: state => {
                return state.account
            },
            coupons: state => {
                return state.coupons
            },
            phone: state => {
                return state.phone
            },
            errorMessage: state => {
                return state.errorMessage
            },
            isUserExist: state => {
                return state.isUserExist
            }
        },

        mutations: {
            setAccount (state, payload) {
                state.account = payload
            },
            setCoupons (state, payload) {
                Vue.set(state, 'coupons', payload);
            },
            setPhone (state, payload) {
                state.phone = payload
            },
            setErrorMessage (state, payload) {
                state.errorMessage = payload
            },
            setUserExist (state, payload) {
                state.isUserExist = payload
            }
        },

        actions: {
            loadCoupons: (context, items) => {
                context.commit('setCoupons', items);
            }
        },

        // enable strict mode (adds overhead!)
        // for dev mode only
        strict: process.env.DEV
    })

    return Store
}
