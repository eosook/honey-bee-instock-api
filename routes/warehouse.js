import express from 'express'
import initKnex from 'knex';
import configuration from '../knexfile.js'
const router = express.Router();

const knex = initKnex(configuration);

router
    .route('/')
    .get( async (_req, res) => {
        try {
            const listOfWarehouses = await knex.select('*').from('warehouses')
            res.json(listOfWarehouses)
        } catch {
            return res.status(500).send('Error getting Warehouses')
        }
})

router
    .route('/:id')
    .get( async (req, res) => {
        const id = req.params.id
        try {
            const warehouse = await knex.select('*').from('warehouses').where('id', id)
            res.json(warehouse)
        } catch {
            return res.status(500).send('Error getting Warehouse')

        }
    })
    .delete(async (req, res) => {
        const id = req.params.id
        try {
            await knex.select('*').from('warehouses').where('id', id).del()
            res.send('delete succesfull')
        } catch {
            return res.status(404).send('Warehouse ID not found')
        }
    })


export default router

