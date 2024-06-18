import express from 'express'

const router = express.Router();

router
    .route('/')
    .get((_req, res) => {

})

router
    .route('/:id')
    .get((req, res) => {

    })

export default router