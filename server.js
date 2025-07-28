const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://seednettw510:as3156791@cluster0.z8oz9tx.mongodb.net/tourshop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ 已成功連接 MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB 連接失敗", err));

const Tour = mongoose.model("Tour", {
  title: String,
  description: String,
  rating: String,
  image: String,
});

const Order = mongoose.model("Order", {
  items: [
    {
      title: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  createdAt: { type: Date, default: Date.now },
});

app.get("/api/tours", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "無法取得旅遊資料" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    //讓新訂單排最前面
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "無法取得訂單資料" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { items, total } = req.body;
    const order = new Order({ items, total });
    await order.save();
    res.status(201).json({ success: true, message: "訂單儲存成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "儲存失敗" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
