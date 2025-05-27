var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {

    let orders = await req.db.any(`
        SELECT
            orders.id AS id,
            orders.label AS label,
            order_statuses.label AS order_status_label,
            clients.label AS client_label,
            orders.amount AS amount
        FROM
            orders
        INNER JOIN
            clients ON clients.id = orders.id_client
        INNER JOIN
            order_statuses ON order_statuses.id = orders.id_status
    `)
     let clients = await req.db.any(`
        SELECT
            *
        FROM
            clients
    `)
    let user = session.auth(req).user
    let can = session.can(user)
    res.render('orders/list', { title: 'Заказы', orders: orders, clients: clients, can:can })

});

router.post('/create', async function(req, res, next) {

    let order = req.body

    await req.db.none('INSERT INTO orders(label, id_client, amount) VALUES(${label}, ${id_client}, ${amount})', order);

    res.send({msg: ''})

});


router.get('/:id', async function(req, res) {

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Некорректный ID' });

    let order = await req.db.one(`
        SELECT
            orders.id AS id,
            orders.label AS label,
            order_statuses.label AS order_status_label,
            clients.label AS client_label,
            orders.amount AS amount
        FROM
            orders
                INNER JOIN
            clients ON clients.id = orders.id_client
                INNER JOIN
            order_statuses ON order_statuses.id = orders.id_status
        WHERE
            orders.id = $1
    `, [id]);

    res.render('orders/view', { title: 'Заказ' + order.label, order: order })

});

router.get('/order/:id', async function(req, res, next) {
    const id = parseInt(req.params.id, 10); console.log('ID из URL:', req.params.id);
    if (isNaN(id)) return res.status(400).send('Некорректный ID');
    try {
        const order = await req.db.oneOrNone(`
            SELECT
                orders.id AS id,
                orders.label AS label,
                order_statuses.label AS order_status_label,
                clients.label AS client_label,
                orders.amount AS amount
            FROM
                orders
            INNER JOIN clients ON clients.id = orders.id_client
            INNER JOIN order_statuses ON order_statuses.id = orders.id_status
            WHERE orders.id = $1
        `, [id]);

        if (!order) return res.status(404).send('Заказ не найден');

        res.json(order
        );

    } catch (err) {
        console.error('Ошибка при получении заказа:', err);
        next(err);
    }
});
const session = require('../session');
router.post('/:id/change-status', async (req, res) => {
    const userSession = session.auth(req)
    const can = session.can(userSession.user)

    if (!can.edit_orders) {
        return res.status(403).send({ msg: 'Нет доступа' })
    }

    const { id } = req.params
    const { new_status } = req.body

    try {
        await req.db.none('UPDATE orders SET id_status = $1 WHERE id = $2', [new_status, id])
        res.send({ msg: '' })
    } catch (err) {
        console.error('Ошибка при обновлении статуса заказа:', err)
        res.status(500).send({ msg: 'Ошибка сервера' })
    }
})

router.post('/:id/process-payment', async (req, res) => {
    const userSession = session.auth(req)
    const can = session.can(userSession.user)


    if (!can.process_payments) {
        return res.status(403).send({ msg: 'Нет доступа' })
    }

    const { id } = req.params
    const { amount } = req.body

    if (!amount || isNaN(amount)) {
        return res.status(400).send({ msg: 'Неверные данные' })
    }

    let id_payment_type = 20;

    try {
        // Вставляем запись о платеже
        await req.db.none(
            'INSERT INTO payments (id_order, id_payment_type, amount) VALUES ($1, $2, $3)',
            [parseInt(id), parseInt(id_payment_type), parseFloat(amount)]
        )

        // Обновляем статус заказа (если нужно)
        //   await req.db.none(
        //     `UPDATE orders SET id_status = (SELECT id FROM order_statuses WHERE label = 'Оплачен' LIMIT 1) WHERE id = $1`,
        //     [parseInt(id)]
        //   )

        res.send({ msg: '' })
    } catch (err) {
        console.error('Ошибка при проведении платежа:', err)
        res.status(500).send({ msg: err })
    }
})
module.exports = router;
