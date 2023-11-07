const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
// const cors = require("cors");
// const cloudinary = require("cloudinary");
const fileUpload = require('express-fileupload');

// app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true}));
app.get("/",(req,res)=>{
  res.send("Hello world")
})

// Route Imports
const user = require("./Routers/userRoute");
const brand = require("./Routers/brandRoute");
const fuel = require("./Routers/fuelRoute");
const transmission = require("./Routers/transmissionRoute");
const bodyType = require("./Routers/bodyTypeRoute");
const car = require("./Routers/carRoute");
const news = require("./Routers/newsRoute");
const banner = require("./Routers/bannerRoute");
const video = require("./Routers/videoRoute");
const wishlist = require("./Routers/wishlistRoute");
const policy = require('./Routers/privacyRoute');
const visitorAgg = require('./Routers/visitorAggRoute');
const advice = require('./Routers/adviceRoute');
const feedback = require('./Routers/feedbackRoute');
const notification = require('./Routers/notificationRoute');




app.use("/api/v1", user);
app.use("/api/v1/brand", brand);
app.use("/api/v1/fuel", fuel);
app.use("/api/v1/transmission", transmission);
app.use("/api/v1/body/type", bodyType);
app.use("/api/v1/car", car);
app.use("/api/v1/news", news);
app.use("/api/v1/banner", banner);
app.use("/api/v1/video", video);
app.use("/api/v1/wishlist", wishlist);
app.use('/api/v1/privacy', policy);
app.use('/api/v1/visitorAgg', visitorAgg);
app.use('/api/v1/faq', advice);
app.use('/api/v1/feedback', feedback);
app.use('/api/v1/notification', notification);



dotenv.config({ path: "config/config.env" });
const mongoose = require("mongoose");


connectDatabase = () => {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGO_URI)
      .then((con) =>
        console.log(`Mongodb connected with server: ${con.connection.host}`)
      );
  };
  
  // Connecting to database
  connectDatabase();
  
  const server = app.listen(process.env.PORT, () => {
      console.log(`Server is working on port ${process.env.PORT}`);
    }); 