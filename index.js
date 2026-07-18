import express from "express";
import { connectDB, Product } from "./db.js";

const app = express();
const PORT = 5000;

app.use(express.json());

// Redirect root to API products page to prevent 'Cannot GET /' error
app.get("/", (req, res) => {
  res.redirect("/api/products");
});

// Redirect singular route to plural api route
app.get("/product", (req, res) => {
  res.redirect("/api/products");
});

app.get("/products", (req, res) => {
  res.redirect("/api/products");
});

app.get("/api/product", (req, res) => {
  res.redirect("/api/products");
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll();

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const newProduct = await Product.create({
      name,
      price: Number(price),
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, price } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.update({
      name: name ?? product.name,
      price: price ?? product.price,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect database:", error);
  }
};

startServer();
