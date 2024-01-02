const router = require("express").Router();
const ads = require("../controllers/eventController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    router.get("/:title", ads.findOneByTitle);
    router.get("/all/:guid", ads.findAll);
    router.put("/:id", checkJwt, ads.update);
    app.use('/api/events', router);
};