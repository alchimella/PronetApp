<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar class="flex row justify-between">
                <q-btn
                    flat
                    dense
                    round
                    @click="leftDrawerOpen = !leftDrawerOpen"
                    icon="menu"
                    aria-label="Menu"
                    class="flex col-2"
                />
                <q-toolbar-title class="flex col-8"></q-toolbar-title>
                <q-btn
                    flat
                    dense
                    round
                    @click="rightDrawerOpen = !rightDrawerOpen"
                    icon="fas fa-cogs"
                    aria-label="Menu"
                    class="flex col-2"
                />
            </q-toolbar>
        </q-header>

        <q-drawer
            side="right"
            v-model="rightDrawerOpen"
            show-if-above
            bordered
            content-class="bg-grey-2"
        >
            <q-list>
                <q-item-label header>Настройки</q-item-label>
                <q-item>
                    <q-input class="full-width" v-model="server" label="Сервер" ref="server" :rules="[val => val && val.length > 0 || 'Заполните поле']" />
                </q-item>
                <q-item>
                    <q-input class="full-width" v-model="port" label="Порт" ref="port" :rules="[val => val && val.length > 0 || 'Заполните поле']" />
                </q-item>
                <q-item>
                    <q-input class="full-width" v-model="login" label="Логин" ref="login" :rules="[val => val && val.length > 0 || 'Заполните поле']" />
                </q-item>
                <q-item>
                    <q-input class="full-width" v-model="password" label="Пароль" ref="password" type="password" :rules="[val => val && val.length > 0 || 'Заполните поле']" />
                </q-item>
                <q-item>
                    <q-item-section>
                        <p v-if="messageSuccessful" class="text-green">{{ messageSuccessful }}</p>
                        <p v-if="messageError" class="text-red">{{ messageError }}</p>

                        <q-btn v-if="isActiveButton" color="blue-grey-3" label="Проверить соединение" @click="testConnection" />
                        <div v-if="isActiveSpinner" class="flex justify-center">
                            <q-spinner-puff color="primary" size="3em"/>
                        </div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-btn v-if="isActiveButton" color="primary" label="Сохранить" @click="save" />
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-select
                        class="full-width"
                        v-model="model"
                        :options="objects"
                        map-options
                        emit-value
                        label="Объект"
                        :disable="!isActiveSelect"
                    />
                </q-item>
                <q-item>
                    <q-item-section>
                        <p v-if="isActiveRegistrateButton && messageRegistrateSuccessful" class="text-green">{{ messageRegistrateSuccessful }}</p>
                        <p v-if="isActiveRegistrateButton && messageRegistrateError" class="text-red">{{ messageRegistrateError }}</p>

                        <q-btn v-if="isActiveRegistrateButton" color="primary" label="Зарегистрировать устройство" @click="registrate" />
                        <div v-if="isActiveRegistrateSpinner" class="flex justify-center">
                            <q-spinner-puff color="primary" size="3em"/>
                        </div>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-drawer
            side="left"
            v-model="leftDrawerOpen"
            show-if-above
            bordered
            content-class="bg-grey-2"
        >
            <q-list>
                <q-item-label header></q-item-label>
                <q-item clickable @click.native="$router.replace('ticket')">
                    <q-item-section avatar>
                        <q-icon name="receipt" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Талоны</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
    import { buildLogonRequest, buildFillRequest, buildPackRequest } from '../boot/options';

    export default {
        name: 'MyLayout',

        data () {
            return {
                server: '',
                port: '',
                login: '',
                password: '',
                messageSuccessful: null,
                messageError: null,
                messageRegistrateSuccessful: null,
                messageRegistrateError: null,
                model: null,
                leftDrawerOpen: false,
                rightDrawerOpen: false,
                isActiveButton: true,
                isActiveRegistrateButton: false,
                isActiveSpinner: false,
                isActiveRegistrateSpinner: false,
                isActiveSelect: false,
                objects: [],
                deviceId: device.uuid
            }
        },
        methods: {
            testConnection: async function () {
                console.log('Запушен процесс проверки соединения');

                this.$refs.server.validate();
                this.$refs.port.validate();

                if (this.$refs.server.hasError || this.$refs.port.hasError) {
                    this.formHasError = true
                }

                let options = {
                    method: 'get',
                    url: 'http://' + this.server + ':' + this.port,
                };

                this.isActiveButton = false;
                this.isActiveSpinner = true;
                this.messageSuccessful = null;
                this.messageError = null;

                this.$axios(options)
                    .then(response => {
                        console.log('Соединение с сервером прошло успешно!', response);

                        this.isActiveSpinner = false;
                        this.isActiveButton = true;
                        this.messageSuccessful = 'Успешное соединение!';
                    })
                    .catch(err => {
                        console.log('Произошла ошибка при соединении с сервером: ', err);

                        this.isActiveSpinner = false;
                        this.isActiveButton = true;
                        this.messageError = 'Произошла ошибка при соединении с сервером!';
                    })
            },
            save: async function () {
                console.log('Запушен процесс авторизации');

                this.$refs.server.validate();
                this.$refs.port.validate();
                this.$refs.login.validate();
                this.$refs.password.validate();

                if (this.$refs.server.hasError || this.$refs.port.hasError || this.$refs.login.hasError || this.$refs.password.hasError) {
                    this.formHasError = true;
                    return;
                }

                let params = { login: this.login, password: this.password };
                let envelope = buildLogonRequest(params);

                let options = {
                    method: 'post',
                    url: 'http://' + this.server + ':' + this.port,
                    data: envelope
                };

                this.isActiveButton = false;
                this.isActiveSpinner = true;

                this.$axios(options)
                    .then(response => {
                        let isSuccess = response.data.envelope.body.logon.response.auth_result.success;

                        console.log('Результат запроса: ', response);

                        this.isActiveSpinner = false;
                        this.isActiveButton = true;

                        if (isSuccess) {
                            this.isActiveSelect = true;
                            this.isActiveRegistrateButton = true;
                            this.messageSuccessful = 'Успешно авторизирован!';
                            this.messageRegistrateError = 'Необходимо зарегистрировать устройство';
                            this.messageError = false;
                            this.getObjects();

                            localStorage.setItem('server', this.server);
                            localStorage.setItem('port', this.port);
                        } else {
                            console.log('Произошла ошибка при авторизации. Неправильный логин или пароль');

                            this.isActiveSelect = false;
                            this.isActiveRegistrateButton = false;
                            this.messageRegistrateError = false;
                            this.messageSuccessful = false;
                            this.messageRegistrateError = false;
                            this.messageError = 'Неправильный логин или пароль!';
                        }
                    })
                    .catch(err => {
                        console.log('Произошла ошибка при соединении с сервером: ', err);

                        this.isActiveSpinner = false;
                        this.isActiveButton = true;
                        this.messageError = 'Произошла ошибка при соединении с сервером!';
                    })
            },
            registrate: function () {
                console.log('Запушен процесс регистрации');

                if (!this.deviceId || !this.model) {
                    console.log('Приходят пустые значения deviceId - ' + this.deviceId + ' или model - ' + this.model);

                    this.isActiveRegistrateButton = true;
                    this.isActiveRegistrateSpinner = false;
                    this.messageRegistrateSuccessful = false;
                    this.messageRegistrateError = false;
                    return
                }

                if (this.deviceId && this.model) {
                    let params = { deviceId: this.deviceId, model: this.model };
                    let envelope = buildPackRequest(params);

                    let options = {
                        method: 'post',
                        url: 'http://' + this.server + ':' + this.port,
                        data: envelope
                    };

                    this.isActiveRegistrateButton = false;
                    this.isActiveRegistrateSpinner = true;

                    this.$axios(options)
                        .then(response => {
                            console.log('RES: ', JSON.stringify(response));

                            this.isActiveRegistrateSpinner = false;
                            this.isActiveRegistrateButton = true;
                            this.messageRegistrateError = false;
                            this.messageRegistrateSuccessful = 'Устройство успешно зарегистрировано!';
                            localStorage.setItem('model', this.model);
                        })
                        .catch(err => {
                            console.log('Произошла ошибка при регистрации устройства на объект: ', err);

                            this.isActiveRegistrateSpinner = false;
                            this.isActiveRegistrateButton = true;
                            this.messageRegistrateSuccessful = false;
                            this.messageRegistrateError = 'Произошла ошибка при регистрации устройства на объект!';
                        })
                }
            },
            getObjects: async function () {
                let query = 'select * from _reference12';
                let envelope = buildFillRequest(query);

                let options = {
                    method: 'post',
                    url: 'http://' + this.server + ':' + this.port,
                    data: envelope
                };

                try {
                    let response = await this.$axios(options);
                    let data = response.data.envelope.body.response.data;

                    data.map(item => {
                        let result = { label: item._name, value: item._idrref };
                        this.objects.push(result);
                    });

                    localStorage.setItem('objects', JSON.stringify(this.objects));
                } catch (err) {
                    console.log('Произошла ошибка при загрузке объектов: ', err);

                    this.isError = true;
                    this.message = 'Произошла ошибка при загрузке объектов!'
                }
            }
        },
        mounted() {
            let server = localStorage.getItem('server');
            let port = localStorage.getItem('port');
            let objects = JSON.parse(localStorage.getItem('objects'));
            let model = localStorage.getItem('model');

            if (!objects || !model) {
                this.model = model;
                this.messageRegistrateSuccessful = false;
                this.messageRegistrateError = 'Необходимо зарегистрировать устройство!';
            } else {
                this.model = model;
                this.messageRegistrateError = false;
                this.messageRegistrateSuccessful = 'Устройство успешно зарегистрировано!';
            }

            if (!server || !port) {
                console.log('Пользователь не авторизирован!');

                this.isActiveSelect = false;
                this.isActiveRegistrateButton = false;
                this.isActiveSpinner = false;
                this.isActiveButton = true;
                this.messageSuccessful = false;
                this.messageError = 'Необходимо авторизироваться!';
            } else {
                this.isActiveSelect = true;
                this.isActiveRegistrateButton = true;
                this.messageError = false;
                this.isActiveButton = true;
                this.isActiveSpinner = false;
                this.objects = objects;
                this.messageSuccessful = 'Успешно авторизирован!';
            }
        }
    }
</script>
