const router = require("express").Router();
const users = require("../controllers/userController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    router.post("/", checkJwt, users.create);
    router.get("/:id", users.findOne);
    router.get("/guid/:guid", users.findByGuid);
    router.delete("/:guid", checkJwt, users.delete);
    router.patch("/event/:guid/:eventTitle", checkJwt, users.attendEvent);
    app.use('/api/users', router);
};