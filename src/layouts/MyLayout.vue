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
                    <q-input class="full-width" v-model="server" label="Сервер" :rules="[val => val !== null && val !== '']" />
                </q-item>
                <q-item>
                    <q-input class="full-width" v-model="port" label="Порт" :rules="[val => val !== null && val !== '']" />
                </q-item>
                <q-item>
                    <q-input class="full-width" v-model="login" label="Логин" :rules="[val => val !== null && val !== '']" />
                </q-item>
                <q-item>
                    <q-input class="full-width" v-model="password" label="Пароль" :rules="[val => val !== null && val !== '']" />
                </q-item>
                <q-item>
                    <q-select class="full-width" v-model="objects" :options="options" label="Объект" />
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-btn v-if="isActiveButton" color="blue-grey-3" label="Проверить соединение" @click="testConnection" />
                        <div v-if="isActiveSpinner" class="flex justify-center">
                            <q-spinner-puff
                                color="primary"
                                size="3em"
                            />
                            <q-tooltip :offset="[0, 8]">QSpinnerPuff</q-tooltip>
                        </div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section>
                        <q-btn color="primary" label="Сохранить" @click="save" />
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
                login: '',
                password: '',
                objects: null,
                leftDrawerOpen: false,
                rightDrawerOpen: false,
                isActiveButton: true,
                isActiveSpinner: false,
                options: []
            }
        },
        methods: {
            testConnection: function () {
                console.log('TEST CONNECTION: ');
                this.isActiveButton = false;
                this.isActiveSpinner = true;
                this.$axios.get('http://' + this.server + ':' + this.port)
                    .then(response => {
                        console.log('RESPONSE: ', response);
                        this.isActiveSpinner = false;
                        this.isActiveButton = true;
                    })
                    .catch(error => {
                        console.log('ERROR: ', error);
                        this.isActiveSpinner = false;
                        this.isActiveButton = true;
                    })
            },
            save: function () {
                console.log('TEST: ');
                this.$axios.post('http://' + this.server + ':' + this.port, {
                    login: this.login,
                    password: this.password
                })
                    .then(response => {
                        console.log('RESPONSE: ', response)
                    })
                    .catch(error => {
                        console.log('ERROR: ', error)
                    })
            }
        }
    }
</script>
