<template>
    <q-page class="flex content-start q-pa-md">
        <div class="flex row justify-between items-start content-start full-width">
            <q-btn class="full-width q-mt-md" color="primary" label="Сканировать" @click="scan" />
            <q-btn class="full-width q-mt-md" color="primary" label="Ввести" @click="prompt = true" />
        </div>
        <q-dialog v-model="prompt" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">Введите код</div>
                </q-card-section>

                <q-card-section>
                    <q-input dense v-model="code" autofocus @keyup.enter="prompt = false" :rules="[val => val !== null && val !== '']" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn label="Отмена" color="white" text-color="black" v-close-popup />
                    <q-btn label="Ввод" color="primary" @click="onOKClick" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div v-show="isResult" class="flex full-width q-mt-xl">
            <q-list class="full-width" v-for="(index, item) in ticket" :key="index" bordered separator>
                <q-item v-ripple>
                    <q-item-section>
                        <q-item-label>Статус</q-item-label>
                    </q-item-section>

                    <q-item-section side center>
                        <q-item-label>
                            <q-icon name="fas fa-check-circle" color="green" style="font-size: 1.4em;" />
                        </q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                    <q-item-section>
                        <q-item-label>Номинал</q-item-label>
                    </q-item-section>

                    <q-item-section side center>
                        <q-item-label>{{ item.rated }}</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                    <q-item-section>
                        <q-item-label>Вид топлива</q-item-label>
                    </q-item-section>

                    <q-item-section side center>
                        <q-item-label>{{ item.gaz }}</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable v-ripple>
                    <q-item-section>
                        <q-item-label>Код</q-item-label>
                    </q-item-section>

                    <q-item-section side center>
                        <q-item-label>{{ item.code }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
        <div v-show="isResult" class="flex justify-between full-width q-mt-xl">
            <q-btn label="Отмена" color="white" text-color="black" />
            <q-btn label="Ок" color="secondary" @click="alert = true" />
        </div>
        <q-dialog v-model="alert">
            <q-card style="width: 40vh">
                <q-card-section class="flex justify-center">
                    <div class="text-h6">Успешно</div>
                </q-card-section>

                <q-card-section>
                    <q-item-label class="flex justify-center q-mb-md">
                        <q-icon name="far fa-check-circle" color="green" style="font-size: 6em;" />
                    </q-item-label>
                    <q-item-label class="flex justify-center">Транзакция прошла успешно!</q-item-label>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="OK" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

    </q-page>
</template>

<script>
    export default {
        name: 'Ticket',
        data () {
            return {
                alert: false,
                prompt: false,
                code: '',
                isResult: false,
                ticket: false
            }
        },
        methods: {
            scan: function () {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        alert('We got a barcode\n' +
                            'Result: ' + result.text + '\n' +
                            'Format: ' + result.format + '\n' +
                            'Cancelled: ' + result.cancelled)
                        return result.text
                    },
                    function (error) {
                        alert('Scanning failed: ' + error)
                    },
                    {
                        preferFrontCamera: false, // iOS and Android
                        showFlipCameraButton: true, // iOS and Android
                        showTorchButton: true, // iOS and Android
                        torchOn: false, // Android, launch with the torch switched on (if available)
                        saveHistory: true, // Android, save scan history (default false)
                        prompt: 'Place a barcode inside the scan area', // Android
                        resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                        formats: 'QR_CODE,EAN_8,EAN_13,CODE_128', // default: all but PDF_417 and RSS_EXPANDED
                        orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
                        disableAnimations: true, // iOS
                        disableSuccessBeep: false // iOS and Android
                    }
                )
            },
            onOKClick () {
                if (this.code) this.isResult = true
            }
        }
    }
</script>

<style scoped>

</style>
