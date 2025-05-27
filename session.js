const md5 = require('md5')
const crypto = require('crypto')

exports.sessions = {
}

exports.login = async function(req, login, pass) {

    let cookies = req.cookies
    let secret = cookies['app_user']

    let user = await req.db.one('SELECT * FROM users WHERE login = $1', login)
    const passHash = md5(pass);
    if (user && (user.pass == passHash)) {
        secret = 'secret';
        let hash = crypto.createHmac('sha256', secret)
            .update(login)
            .digest('hex');

        let cookie = login + '--' + hash;
        exports.sessions[login] = {
            active:    1,
            timestamp: new Date().getTime(),
        }
        exports.sessions[login].user = user
        return cookie;
    }
    return 0;
}

exports.auth = function(req) {

    let cookies = req.cookies

    let secret = cookies['app_user']

    if (!secret) {
        return {}
    }
    let res = secret.split('--');

    if(!res.length) {
        return {}
    }
    let session = exports.sessions[res[0]]
    if (!session) {
        return {};
    }
    let current_timestamp = new Date().getTime()

    if (!session.active || ((current_timestamp - session.timestamp) > 43200*1000)) {
        return {};
    }
    return session;
}

exports.can = function(user) {

    let res = {}

    res.view_users = user && user.id_role === 1
    res.view_payments = user && user.id_role <= 2
    res.view_orders = user && user.id_role <= 3
    res.view_clients = user && user.id_role <= 2
    res.edit_orders = user && user.id_role === 2
    res.process_payments = user && user.id_role === 2
    console.log(res)
    return res
}

exports.logout = function(login) {
    exports.sessions[login] = {
    }
}