let express = require("express");
const { isAuthorizedHasSessionForAPI } = require("../sessionMiddleware");
const router = express.Router({mergeParams: true});