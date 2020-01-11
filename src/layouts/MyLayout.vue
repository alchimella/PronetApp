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

                <q-toolbar-title>
                    <!--          Quasar App-->
                </q-toolbar-title>

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
                    <q-select class="full-width" v-model="objects" :options="options" label="Объект" :disable="!isActiveSelect" />
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
    export default {
        name: 'MyLayout',

        data () {
            return {
                server: 'web.pronet.kg',
                port: '1092',
                login: 'admin',
                password: 'SVPmySunz1',
                messageSuccessful: null,
                messageError: null,
                objects: null,
                leftDrawerOpen: false,
                rightDrawerOpen: false,
                isActiveButton: true,
                isActiveSpinner: false,
                isActiveSelect: false,
                options: []
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

                let options = {
                    method: 'post',
                    url: 'http://' + this.server + ':' + this.port,
                    data: {
                        envelope: {
                            header: {
                                authenticationheader: {
                                    username: 'pronet',
                                    password: '123456'
                                }
                            },
                            body: {
                                logon: {
                                    request: {
                                        login: this.login,
                                        password: this.password
                                    }
                                }
                            }
                        }
                    }
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
                            this.messageSuccessful = 'Успешно авторизирован!';
                            this.messageError = false;

                            localStorage.setItem('server', this.server);
                            localStorage.setItem('port', this.port);
                        } else {
                            console.log('Произошла ошибка при авторизации. Неправильный логин или пароль');

                            this.isActiveSelect = false;
                            this.messageSuccessful = false;
                            this.messageError = 'Неправильный логин или пароль!';
                        }
                    })
                    .catch(err => {
                        console.log('Произошла ошибка при соединении с сервером: ', err);

                        this.isActiveSpinner = false;
                        this.isActiveButton = true;
                        this.messageError = 'Произошла ошибка при соединении с сервером!';
                    })
            }
        },
        mounted() {
            let server = localStorage.getItem('server');
            let port = localStorage.getItem('port');

            if (!server || !port) {
                console.log('Пользователь не авторизирован!');

                this.isActiveSelect = false;
                this.isActiveSpinner = false;
                this.isActiveButton = true;
                this.messageSuccessful = false;
                this.messageError = 'Необходимо авторизироваться!';
            } else {
                this.isActiveSelect = true;
                this.messageError = false;
                this.isActiveButton = true;
                this.isActiveSpinner = false;
                this.messageSuccessful = 'Успешно авторизирован!';
            }
        }
    }
</script>
