import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import evaluationRoutes from "./routes/evaluation.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/evaluate", evaluationRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EduManage AI Server Running 🚀",
  });
});


const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});