import type { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";

const upload = multer({
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter(_req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(new Error("Only image files are allowed"));
    }
  },
}).array("images", 5);

export const uploadRouteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload(req, res, function (err) {
    if (err instanceof MulterError) {
      console.log(err);
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    next();
  });
};
