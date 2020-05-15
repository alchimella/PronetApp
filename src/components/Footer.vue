<template>
    <q-footer class="bg-primary-dark2 q-pb-md" elevated>
        <q-tabs no-caps switch-indicator active-color="primary" indicator-color="bg-next-blue2" class="text-grey" v-model="tab">
            <q-route-tab to="/" exact>
                <img class="q-mt-sm" style="width: 30px; height: 30px" src="../assets/home.png">
                <span>Главная</span>
            </q-route-tab>
            <q-route-tab to="/coupons" exact>
                <img class="q-mt-sm" style="width: 48px; height: 30px" src="../assets/coupon.png">
                <span>Талоны</span>
            </q-route-tab>
            <q-route-tab to="/cards" exact>
                <img class="q-mt-sm" style="width: 48px; height: 30px" src="../assets/card.png">
                <span>Карты</span>
            </q-route-tab>
            <q-route-tab to="/settings" exact>
                <img class="q-mt-sm" style="width: 36px; height: 30px" src="../assets/settings.png">
                <span>Настройки</span>
            </q-route-tab>
        </q-tabs>
    </q-footer>
</template>

<script>
    export default {
        name: 'Footer',

        data() {
            return {

            }
        }
    }
</script>

<style scoped>

</style>