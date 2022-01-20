const express = require("express");
const router = express.Router();
const HomeController = require("../app/controllers/HomeController");
const AuthController = require("../app/controllers/AuthController");
const NewsController = require("../app/controllers/NewsController");
const MyNewsController = require("../app/controllers/MyNewsController");
const AuthorController = require("../app/controllers/AuthorController");

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/sign-up", AuthController.signUp);
router.post("/sign-up-gmail", AuthController.signUpGmail);
router.get("/homepage-news", HomeController.news);
router.get("/homepage-news/:offset", HomeController.news);
router.get("/news-detail/:id", NewsController.detail);
router.post("/news-autocomplete", NewsController.autoComplete);
router.get("/my-news/:id", MyNewsController.list);
router.post("/my-news", MyNewsController.insert);
router.get("/author-detail/:id", AuthorController.detail);

module.exports = router;
