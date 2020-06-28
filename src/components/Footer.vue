<template>
    <q-footer class="l-footer q-pb-md no-shadow">
        <q-tabs no-caps active-color="bg-qr-bg-button-selected" indicator-color="bg-qr-bg-button-active" class="text-grey" v-model="tab">
            <q-route-tab name="/" to="/" exact>
                <img style="width: 24px; height: 22px" src="../assets/wallet_icon.png">
                <span>Кошелёк</span>
            </q-route-tab>
            <q-route-tab name="coupons" to="/map" exact>
                <img style="width: 19px; height: 24px" src="../assets/map.png">
                <span>Карта АЗС</span>
            </q-route-tab>
            <q-route-tab class="l-footer-qr-scan-tab" to="/qr" exact>
                <img class="q-mt-sm q-mb-sm" style="width: 40px; height: 40px" src="../assets/qrcode-scan.png">
            </q-route-tab>
            <q-route-tab name="cards" to="/coupons" exact>
                <img style="width: 25px; height: 24px" src="../assets/discount_icon.png">
                <span>Акции</span>
            </q-route-tab>
            <q-route-tab name="settings" to="/settings" exact>
                <img style="width: 24px; height: 7px" src="../assets/more_icon.png">
                <span>Ещё</span>
            </q-route-tab>
        </q-tabs>
    </q-footer>
</template>

<script>
    export default {
        name: 'Footer',
        props: ["clickedQRScan"],

        data() {
            return {
                tab: ''
            }
        }
    }
</script>

<style scoped>

</style>
