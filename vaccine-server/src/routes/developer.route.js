// ! This Route for Development Purpose only, not for the Production

"use strict";
const router = require("express").Router();

const { DeveloperController } = require("../controllers");

router.get("/roles", DeveloperController.getRolesList);

router.post("/role", DeveloperController.addRole);

router.put("/role-permissions", DeveloperController.updateRolePermissions);

router.get("/role-permissions/:role_type", DeveloperController.getRolePermissions);


module.exports = router;