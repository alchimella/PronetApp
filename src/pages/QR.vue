<template>
    <q-page class="flex justify-center items-center content-center q-pa-md qr-background">
        <img src="https://barcode.tec-it.com/barcode.ashx?data=8266aaf99b346b7b723d368e1dba75f&code=QRCode&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=&qunit=Mm&quiet=0&eclevel=L" alt="">
    </q-page>
</template>

<script>

    export default {
        name: 'QR',
        data () {
            return {

            }
        }
    }
</script>

<style scoped>
    .qr-background {
        background-color: #0B95AF
    }
    img {
        width: 70%;
    }
</style>
