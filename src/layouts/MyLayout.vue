<template>
    <q-layout view="lHh Lpr lFf">
        <!-- <q-header bordered>
            <q-toolbar class="flex row justify-between">
                <q-btn
                    v-if="isCashier"
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
        </q-header> -->

        <q-drawer
            side="right"
            v-model="rightDrawerOpen"
            show-if-above
            bordered
            content-class="bg-grey-2"
        >
            <q-list class="q-pa-sm">
                <q-item-label header class="text-h6">Авторизация</q-item-label>
                <q-item>
                    <q-input class="full-width" v-model="url" label="URL" ref="url" :rules="[val => val && val.length > 0 || 'Заполните поле']" placeholder="cервер:порт" />
                </q-item>
                <q-item>
                    <q-input class="full-width" v-model="comment" label="Комментарий" type="textarea" :rules="[val => val && val.length > 0 || 'Заполните поле']" />
                </q-item>
                <q-item>
                    <q-badge v-if="status && color" outline class="text-body1" :color="color" :label="status" />
                </q-item>
                <div v-if="isActiveRegistrateSpinner" class="flex justify-center">
                    <q-spinner-puff color="primary" size="3em"/>
                </div>
                <q-item v-show="messageErr">
                    <p class="text-red">{{ messageErr }}</p>
                </q-item>
                <q-item>
                    <q-btn v-if="isActiveButton" color="primary" label="Авторизироваться" @click="terminalRegistration" />
                </q-item>
            </q-list>
        </q-drawer>

        <q-drawer
            v-if="isCashier"
            side="right"
            v-model="rightDrawerOpen"
            show-if-above
            bordered
            content-class="bg-grey-2"
        >
            <q-list>
                <q-item-label header class="text-h6">Настройки</q-item-label>
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
                    <q-input class="full-width" v-model="password" label="Пароль" ref="password" :type="isPwd ? 'password' : 'text'" :rules="[val => val && val.length > 0 || 'Заполните поле']">
                        <template v-slot:append>
                            <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                            />
                        </template>
                    </q-input>
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
            v-if="isCashier"
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
            <router-view v-if="isUser" :isUser="isUser" class="background"/>
            <router-view v-else :isUser="isUser" />
        </q-page-container>
    </q-layout>
</template>

<script>
    import { buildRegTRequest, buildLogonRequest, buildFillRequest, buildPackRequest } from '../boot/options';

    export default {
        name: 'MyLayout',

        data () {
            return {
                url: localStorage.url,
                server: '',
                port: '',
                login: '',
                password: '',
                isPwd: true,
                comment: localStorage.comment,
                status: localStorage.status,
                color: localStorage.color,
                isUser: true,
                isCashier: false,
                messageSuccessful: null,
                messageError: null,
                messageErr: null,
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
                deviceId: device.uuid,
                // deviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfc6d4',
                test: ''
            }
        },
        watch: {
            url : function(v) {
                this.url = v.toLowerCase().trim();
            },
            server : function(v) {
                this.server = v.toLowerCase().trim();
            },
            login : function(v) {
                this.login = v.toLowerCase().trim();
            },
            test: function(v) {
                console.warn(this.isCashier)
                if (this.isCashier) clearInterval(v)
            }
        },
        methods: {
            terminalRegistration: function () {
                console.log('Запушен процесс регистрации терминала');

                this.$refs.url.validate();
                this.isActiveRegistrateSpinner = true;
                this.isActiveButton = false;

                let params = { deviceId: this.deviceId, comment: this.comment };
                let envelope = buildRegTRequest(params);

                if (this.$refs.url.hasError) this.formHasError = true;

                let options = {
                    method: 'post',
                    url: 'http://' + this.url,
                    data: envelope
                };

                let _this = this;

                this.$axios(options)
                    .then(response => {
                        console.log('Запрос на регистрацию терминала прошел успешно. Ожидается подтверждение!', response);

                        let idrref = response.data.envelope.body.response.data[0]["_idrref"];
                        localStorage.idrref = idrref;
                        localStorage.url = this.url;
                        localStorage.comment = this.comment;
                        // this.getStatus(idrref);
                        this.test = setInterval(async () => await this.getStatus(idrref), 10000);
                        this.messageErr = false;
                        this.isActiveRegistrateSpinner = false;
                        this.status = 'В ожидании';
                        this.color = 'orange';
                        localStorage.status = this.status;
                        localStorage.color = this.color;
                        this.isActiveButton = true;
                    })
                    .catch(err => {
                        console.warn(err)
                        console.error('Произошла ошибка при регистрации терминала: ', err);
                        this.messageErr = 'Произошла ошибка при регистрации терминала! Проверьте поля.';
                        this.isActiveRegistrateSpinner = false;
                        this.isActiveButton = true;
                    });
            },

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
                        console.error('Произошла ошибка при соединении с сервером: ', err);

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
                            localStorage.setItem('login', this.login);
                            localStorage.setItem('password', this.password);
                        } else {
                            console.error('Произошла ошибка при авторизации. Неправильный логин или пароль');

                            this.isActiveSelect = false;
                            this.isActiveRegistrateButton = false;
                            this.messageRegistrateError = false;
                            this.messageSuccessful = false;
                            this.messageRegistrateError = false;
                            this.messageError = 'Неправильный логин или пароль!';
                        }
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при соединении с сервером: ', err);

                        this.isActiveSpinner = false;
                        this.isActiveButton = true;
                        this.messageError = 'Произошла ошибка при соединении с сервером!';
                    })
            },
            registrate: function () {
                console.log('Запушен процесс регистрации');

                if (!this.deviceId || !this.model) {
                    console.error('Приходят пустые значения deviceId - ' + this.deviceId + ' или model - ' + this.model);

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
                            localStorage.setItem('deviceId', this.deviceId);
                            localStorage.setItem('model', this.model);
                        })
                        .catch(err => {
                            console.error('Произошла ошибка при регистрации устройства на объект: ', err);

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

                    let _this = this;
                    data.forEach(function(item) {
                        let res = { label: item._name, value: item._idrref };
                        _this.objects.push(res);
                    });

                    localStorage.setItem('objects', JSON.stringify(this.objects));
                } catch (err) {
                    console.error('Произошла ошибка при загрузке объектов: ', err);

                    this.isError = true;
                    this.message = 'Произошла ошибка при загрузке объектов!'
                }
            },

            getStatus: function (idrref) {
                let vm = this;

                if (!idrref || !idrref.length || idrref == undefined) {
                    console.error('Передано пустое значение idrref');
                    clearInterval(this.test);
                    return
                }

                let query = `select * from _reference13 where _idrref = '${idrref}'`;
                let envelope = buildFillRequest(query);

                let options = {
                    method: 'post',
                    url: 'http://' + this.url,
                    data: envelope
                };

                this.$axios(options)
                    .then(response => {
                        let res = response.data.envelope.body.response.data[0]["_status"];

                        if (res == 0) {
                            vm.status = 'В ожидании';
                            vm.color = 'orange';
                            localStorage.status = vm.status;
                            localStorage.color = vm.color;
                        }
                        if (res == 1) {
                            vm.status = 'Принято';
                            vm.color = 'green';
                            localStorage.isUser = false;
                            localStorage.isCashier = true;
                            vm.isUser = false;
                            vm.isCashier = true;
                            clearInterval(this.test);
                        }
                        if (res == 2) {
                            vm.status = 'Отклонено';
                            vm.color = 'red';
                            localStorage.status = vm.status;
                            localStorage.color = vm.color;
                            clearInterval(this.test);
                        }

                        this.isActiveRegistrateSpinner = false;
                        this.isActiveButton = true;
                    })
                    .catch(err => {
                        console.error('Произошла ошибка при запросе статуса терминала: ', err);
                        clearInterval(vm.test);
                    })
            }
        },
        created() {
            if (localStorage.isCashier) {
                this.isUser = false;
                this.isCashier = true;
            }

            if (this.url.length && this.isUser && !localStorage.isCashier) {
                this.test = setInterval(async () => await this.getStatus(localStorage.idrref), 10000);
            } else {
                clearInterval(this.test);
            }
        },
        mounted() {
            let server = localStorage.getItem('server');
            let port = localStorage.getItem('port');
            let login = localStorage.getItem('login');
            let password = localStorage.getItem('password');
            let objects = JSON.parse(localStorage.getItem('objects'));
            let model = localStorage.getItem('model');

            if (localStorage.isCashier) {
                this.isUser = false;
                this.isCashier = true;
            }

            if (this.url.length && this.isUser && !localStorage.isCashier) {
                this.test = setInterval(async () => await this.getStatus(localStorage.idrref), 10000);
            } else {
                clearInterval();
            }

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
                this.server = server;
                this.port = port;
                this.login = login;
                this.password = password;
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

<style scoped>
    .background {
        background: url("../statics/background.png");
        background-size: cover;
    }

</style>
