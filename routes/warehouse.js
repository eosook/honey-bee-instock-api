import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
import { body, validationResult, matchedData } from "express-validator";
const router = express.Router();

const knex = initKnex(configuration);

router
  .route("/")
  .get(async (_req, res) => {
    try {
      const listOfWarehouses = await knex.select("*").from("warehouses");
      res.json(listOfWarehouses);
    } catch {
      return res.status(500).send("Error getting Warehouses");
    }
  })
  .post(
    body().notEmpty(),
    body("contact_phone").matches(
      /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    ),
    body("contact_email").isEmail(),
    async (req, res) => {
      const validData = validationResult(req);
      if (validData.isEmpty()) {
        try {
          const {
            warehouse_name,
            address,
            city,
            country,
            contact_name,
            contact_position,
            contact_phone,
            contact_email,
          } = req.body;
          const newWarehouse = {
            warehouse_name,
            address,
            city,
            country,
            contact_name,
            contact_position,
            contact_phone,
            contact_email,
          };
          await knex("warehouses").insert(newWarehouse);
          res.status(201).json({
            message: "Warehouse added successfully",
            warehouse: newWarehouse,
          });
          // console.log(validData);
          // next();
        } catch (error) {
          return res.status(400).send("Error adding warehouse");
        }
      }
      return res.status(400).send({ errors: validData.array() });
    }
  );

router
  .route("/:id")
  .get(async (req, res) => {
    const id = req.params.id;
    try {
      const warehouse = await knex
        .select("*")
        .from("warehouses")
        .where("id", id);
      res.json(warehouse);
    } catch {
      return res.status(500).send("Error getting Warehouse");
    }
  })
  .delete(async (req, res) => {
    const id = req.params.id;
    try {
      const warehouse = await knex
        .select("*")
        .from("warehouses")
        .where("id", id);
      res.status(204).json(warehouse).send("delete succesfull");
    } catch {
      return res.status(404).send("Warehouse ID not found");
    }
  });

router.route("/:id/inventories").get(async (req, res) => {
  const id = req.params.id;
  try {
    const inventory = await knex
      .select("*")
      .from("inventories")
      .where("warehouse_id", id);
    res.status(201).json(inventory).send("Got Warehouse Inventory!");
  } catch {
    return res.status(500).send("Error getting Warehouse inventory");
  }
});

export default router;
