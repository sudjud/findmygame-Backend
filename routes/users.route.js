const { Router } = require("express");
const { userController } = require("../controllers/users.controller");
const router = Router();

//Эта функция нужна для валидации тела запроса
const { body } = require("express-validator");
//Импортируем middleware для проверки авторизации
const authMiddleware = require("../middlewares/auth-middleware");

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 4, max: 10 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", userController.getUsers);

module.exports = router;
