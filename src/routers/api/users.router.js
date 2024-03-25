import { Router } from "express";
import UsersController from "../../controllers/users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { uploaderMiddleware } from "../../utils/uploader.js";
import { buildResponsePaginatedProducts, buildResponsePaginatedUsers } from "../../utils/utils.js";

const router = Router();

router.patch("/premium/:uid", async (req, res, next) => {
  try {
    await UsersController.premiumOrNotUser(req.params);
    res.status(201).json({ message: "The user role has been changed" });
  } catch (error) {
    next(error);
  }
});

router.delete("/:uid", async (req, res, next) => {
  try {
    await UsersController.deleteById(req.params.uid);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:uid/documents",
  authMiddleware("jwt"),
  uploaderMiddleware("document").fields([
    { name: "identification" },
    { name: "proofOfAddress" },
    { name: "bankStatement" },
  ]),
  async (req, res, next) => {
    try {
      await UsersController.uploadDocuments(req.user._id, req.files);
      res.status(200).redirect("/views/profile");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", authMiddleware("jwt"), async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, search } = req.query;

    const criteria = {};
    const options = { limit, page };
    if (sort) {
      options.sort = { price: sort };
    }
    if (search) {
      criteria.category = search;
    }

    const result = await UsersController.get(criteria, options);
    console.log(result);
    res.status(200).json(buildResponsePaginatedUsers({ ...result, sort, search }));
  } catch (error) {
    next(error);
  }
});

export default router;
