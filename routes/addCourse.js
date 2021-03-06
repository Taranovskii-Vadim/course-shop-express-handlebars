const { Router } = require("express");
const { validationResult } = require("express-validator");

const { courseValidators } = require("../utils/validators");

// Models
const Course = require("../models/course");

// MiddleWares
const isProtectedRoute = require("../middlewares/isProtectedRoute");

const router = Router();

router.get("/", isProtectedRoute, (req, res) => {
  res.render("addCourse", {
    title: "Добавить курс",
    isAdd: true,
  });
});

router.post("/", isProtectedRoute, courseValidators, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("addCourse", {
        title: "Добавить курс",
        isAdd: true,
        error: errors.array()[0].msg,
        data: {
          title: req.body.title,
          price: req.body.price,
          img: req.body.img,
        },
      });
    }
    const course = new Course({
      title: req.body.title,
      price: req.body.price,
      img: req.body.img,
      userId: req.user,
    });
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
