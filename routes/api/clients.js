var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {

    let clients = await req.db.any(`
        SELECT
            *
        FROM
            clients
    `)
    res.json({clients: clients })

});
router.post('/' , async function(req, res, next) {
    let client = req.body
        await req.db.none(`
    Insert into clients(label) values ($1)`, client.label)
    res.json({msg:''})
})
 router.delete('/:id/' , async function(req, res) {
     const id = parseInt(req.params.id, 10);
     if (isNaN(id)) return res.status(400).json({ error: 'Некорректный ID' });
     await req.db.none(`delete from clients where id=${id}`)
     res.json({msg:''})
 })
router.get('/:id' , async function(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Некорректный ID' });
    let client = await req.db.one(`
    SELECT * FROM clients WHERE id = $1`, id)
    res.json(client)
})
module.exports = router;