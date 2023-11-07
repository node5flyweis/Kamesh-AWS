const Banner = require('../Models/bannerModel')
require('dotenv').config();

const imagePattern = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
    cloud_name: 'dtijhcmaa', 
    api_key: '624644714628939', 
    api_secret: 'tU52wM1-XoaFD2NrHbPrkiVKZvY' 
  });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});

const upload = multer({ storage: storage });
exports.AddBanner = async (req, res) => {
  try {
    let findBanner = await Banner.findOne({ name: req.body.name });
    console.log(req.body.name)
    if (findBanner) {
      res.status(409).json({ message: "Banner already exit.", status: 404, data: {} });
    } else {
      upload.single("image")(req, res, async (err) => {
        if (err) { return res.status(400).json({ msg: err.message }); }
        // console.log(req.file);
        const fileUrl = req.file ? req.file.path : "";
        const data = { name: req.body.name, image: fileUrl };
        const banner = await Banner.create(data);
        res.status(200).json({ message: "Banner add successfully.", status: 200, data: banner });
      })
    }

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};

exports.getBanner = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({ success: true, banners: banners });

  } catch (error) {
    res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
  }
};


exports.getbannerbyId= async (req, res) => {

    try {
        const bannerId = req.params.id;
    
        // Fetch the brand by its ID from the database
        const banners = await Banner.findById(bannerId);
    
        if (!banners) {
          return res.status(404).json({ message: 'banners not found' });
        }
    
        res.json({ banners });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    };
    
exports.updateBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) {
    res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
  }
  upload.single("image")(req, res, async (err) => {
    if (err) { return res.status(400).json({ msg: err.message }); }
    const fileUrl = req.file ? req.file.path : "";
    banner.image = fileUrl || banner.image;
    banner.name = req.body.name;
    let update = await banner.save();
    res.status(200).json({ message: "Updated Successfully", data: update });
  })
};

exports.removeBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) {
    res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
  } else {
    await Banner.findByIdAndDelete(banner._id);
    res.status(200).json({ message: "Banner Deleted Successfully !" });
  }
};