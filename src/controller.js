const router = require("express").Router();

router.get("/", (req, res) => {
    res.json({ hello: "hi" });
});

module.exports = router;
