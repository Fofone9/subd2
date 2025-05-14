var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {

    let clients = await req.db.any(`
        SELECT
            *
        FROM
            clients
    `)
    console.log(clients)
    res.json({clients: clients })

});
router.post('/' , async function(req, res, next) {
    let client = req.body
        await req.db.none(`
    Insert into clients(label) values ($1)`, client.label)
    res.json({msg:''})
})
 router.delete('/:id/' , async function(req, res) {
     let id = req.params.id
     await req.db.none(`delete from clients where id=${id}`)
     res.json({msg:''})
 })
router.get('/:id' , async function(req, res) {
    let id = req.params.id
    let client = await req.db.one(`
    SELECT * FROM clients WHERE id = $1`, id)
    res.json(client)
})
module.exports = router;