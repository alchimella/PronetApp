import Vue from 'vue'

function buildHeader() {
    return {
        authenticationheader: {
            username: 'pronet',
            password: '123456'
        }
    }
}

export function buildLogonRequest(params) {
    if (!params) {
        console.log('Передан пустой параметр params');
    }

    return {
        envelope: {
            header: buildHeader(),
            body: { logon: { request: { login: params.login, password: params.password } } }
        }
    }
}

export function buildFillRequest(query) {
    if (!query) {
        console.log('Передан пустой параметр query');
    }

    return {
        envelope: {
            header: buildHeader(),
            body: { fill: { request: { query } } }
        }
    }
}

export function buildPackRequest(params) {
    if (!params) {
        console.log('Передан пустой параметр params');
    }

    return {
        envelope: {
            header: buildHeader(),
            body: {
                cmd: {
                    request: {
                        'package': [
                            {
                                'database_name': 'loy_db',
                                'table_name': '_reference13',
                                'auto_guid': [{ 'field_name': '_idrref' }],
                                'auto_increment': [{ 'field_name': '_code' }],
                                'auto_timestamp': [{ 'field_name': '_timestamp' }],
                                'row': [{ 'field': [{ 'field_name': '_name', 'field_value': params.deviceId }, { 'field_name': '_reference12', 'field_value': params.model }] }]
                            }
                        ]
                    }
                }
            }
        }
    }
}
