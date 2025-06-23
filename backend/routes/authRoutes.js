const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

const upload = require("../middleware/uploadMiddleware");
const uploadToCloudinary = require("../utils/cloudinaryUploader");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  const imageUrl =`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // Local URL for testing

  res.status(200).json({ imageUrl });

  /*try {
    const imageUrl = await uploadToCloudinary(req.file.path);
    res.status(200).json({ imageUrl }); // this is now the Cloudinary URL
  } catch (err) {
    res.status(500).json({ message: "Image upload failed", error: err.message });
  }*/
});

module.exports = router;