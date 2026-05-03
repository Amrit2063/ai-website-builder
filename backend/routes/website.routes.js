import express from "express";
import isAuth from "../middleware/isAuth.js";
import { generateWebsite,getWebsiteById,getAll,changes, safeSave,deploy,getBySlug } from "../controllers/website.controllers.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate",isAuth, generateWebsite);
websiteRouter.put("/update/:id",isAuth, changes);
websiteRouter.get("/get-by-id/:id",isAuth, getWebsiteById);
websiteRouter.get("/get-all",isAuth, getAll);
websiteRouter.put("/safe-save/:id",isAuth, safeSave);
websiteRouter.get("/deploy/:id",isAuth, deploy);
websiteRouter.get("/get-by-slug/:slug",isAuth, getBySlug);


export default websiteRouter;