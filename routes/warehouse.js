import express from "express";
import initKnex from "knex";
import configuration from "../knexfile.js";
const router = express.Router();

const knex = initKnex(configuration);
const isWarehouseValid = async (req, res, next) => {
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
  // if ((req.body.contact_phone) )
  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  //   console.log(contact_phone);
  //   if (!contact_phone)
};

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
  .post(isWarehouseValid, async (req, res) => {
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
    } catch (error) {
      return res.status(400).send("Error adding warehouse");
    }
  });

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
