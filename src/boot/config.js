import Vue from 'vue'
import { buildFillRequest } from '../boot/options';
import axios from 'axios'

let appConf = {
    userStatus: '',
    userDeviceId: 'cb2a8213-9da2-4756-93ea-549ae7cfe6c1'
}

function loadUserStatus () {
    let query = `select * from _reference13 where _cid = '${appConf.userDeviceId}'`;
    let envelope = buildFillRequest(query);

    let options = {
        method: 'post',
        url: 'http://web.pronet.kg:1082',
        data: envelope
    };

    axios(options)
        .then(response => {
            let res = response.data.envelope.body.response.data[0];
            appConf.userStatus = res['_status']
            console.warn('t',appConf.userStatus)
        })
        .catch(err => {
            console.error('Произошла ошибка при поиске статуса пользователя: ', err)
            appConf.userStatus = null
        })
}

export default async ({ Vue }) => {
    // loadUserStatus()
    Vue.prototype.$config = appConf;
}