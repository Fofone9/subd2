var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
    let cookies = req.cookies['app_user'];
    if (cookies == null) {
        res.status(403).render('error', {
            message: 'нельзя', error: {
                status: 403
            }
        });
        return;
    }

    let role = cookies.split('--')[0];
    if (role === 'employee')
        res.status(403).render('error', { message: 'нельзя', error:{
            status: 403
            } });
    else
        res.render('users/list', { title: 'Пользователи' });

});


module.exports = router;
