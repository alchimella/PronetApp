<template>
    <q-page class="flex q-pa-lg">
        <div v-if="!coupons.length" class="flex row justify-center content-center items-center">
            <img class="col-10" src="../assets/coupon-background.png" alt="" style="height: 138px">
        </div>

        <div v-else class="flex row justify-between content-start items-start full-width">
            <q-card v-for="item in coupons" :key="item.reference14_idrref" @click="getCouponDetail(item)" class="col-xs-5 col-sm-5 col-md-5 col-md-5 q-ma-sm q-pa-sm bg-primary-dark2" dark style="height: 200px">
                <q-card-section class="text-overline">ЛC: {{ account }}</q-card-section>
                <q-card-section class="flex justify-center text-h6">{{ item._reference14_name }}</q-card-section>
                <q-card-section class="flex justify-center" style="font-size: 4vh;">{{ item._accumreg1_amount }}</q-card-section>
            </q-card>
        </div>

        <q-dialog v-if="Object.keys(coupon).length > 0" v-model="alert">
            <q-card class="bg-primary-dark3" style="width: 50vh" dark>
                <q-card-section class="flex justify-center">
                    <div class="text-h5">{{ coupon._reference14_name }} - {{ coupon._accumreg1_amount }}</div>
                </q-card-section>

                <q-card-section>
                    <q-item-label class="flex justify-center">Вы уверены что хотите списать данный талон?</q-item-label>
                </q-card-section>

                <q-card-actions class="q-ma-sm" align="between">
                    <q-btn label="Отмена" flat v-close-popup />
                    <q-btn label="Да" class="bg-next-blue1" @click="deductOfCoupon(coupon)" :loading="submitting" :disable="!isButtonActive" v-close-popup="!alert" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="successAlert">
            <q-card class="bg-primary-dark3" style="width: 40vh" dark>
                <q-card-section align="center">
                    <div class="text-h5">Талон успешно списан</div>
                </q-card-section>

                <q-card-section>
                    <q-item-label class="flex justify-center">
                        <transition
                            appear
                            enter-active-class="animated fadeIn"
                            leave-active-class="animated fadeOut"
                            >
                            <q-icon class="q-mt-lg q-mb-lg" name="done_outline" size="xl" style="color: #43745C" />
                        </transition>
                    </q-item-label>
                </q-card-section>

                <q-card-actions class="q-ma-sm" align="right">
                    <q-btn label="Ok" flat v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <div class="flex row justify-end q-pa-lg full-width" style="position: absolute; bottom: 0; left: 0">
            <FloatActionButton :isScaned="isScaned" @spinner="isScaned = $event" />
        </div>
    </q-page>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import FloatActionButton from '../components/FloatActionButton'

export default {
    name: 'Coupons',
    components: { FloatActionButton },

    data() {
        return {
            alert: false,
            successAlert: false,
            account: localStorage.account,
            coupon: {},
            signature: 'a80ef6f574652d870113226ba0cbe72c',
            idrref: localStorage.idrref,
            date: moment().format('YYYYMMDDhhmmss'),
            submitting: false,
            isScaned: false,
            isButtonActive: true,
            isCouponsListEmpty: true
        }
    },

    watch: {
        isScaned: function (v) {
            if (this.isScaned) this.$q.loading.show({ delay: 400 })
            if (!this.isScaned) this.$q.loading.hide()
        }
    },

    computed: {
        ...mapGetters(["coupons"]),
        coupons: function () {
            return this.$store.getters.coupons
        }
    },

    methods: {
        getCouponDetail: function (item) {
            this.alert = true;
            this.coupon = item;
        },
        deductOfCoupon: function (item) {
            this.submitting = true;
            this.isButtonActive = false;

            let options = {
                method: 'post',
                url: `http://pn.pronet.kg:1072/api/81a05d419edf445b9a1d4964eade2c01?op=5&date_time=${this.date}&value=${item._reference1_idrref.replace(/[-]/g, '')}&ir4=${this.idrref}&r14=${item._reference14_idrref}&amount=-${item._accumreg1_amount}&signature=${this.signature}`
            };

            this.$axios(options)
                .then(res => {
                    this.alert = false;
                    this.submitting = false;
                    this.isButtonActive = true;
                    this.successAlert = true;
                    this.$store.dispatch('loadCoupons', [])
                })
                .catch(err => {
                    console.log('Произошла ошибка при списании талона: ', err);

                    this.submitting = false;
                    this.isButtonActive = true;
                })
        }
    }
}
</script>

<style scoped>

</style>
