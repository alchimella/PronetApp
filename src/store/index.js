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
      coupons: []
    },

    getters: {
      account: state => {
        return state.account
      },
      coupons: state => {
        return state.coupons
      }
    },

    mutations: {
      setAccount (state, payload) {
        state.account = payload
      },
      setCoupons (state, payload) {
        Vue.set(state, 'coupons', payload);
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
