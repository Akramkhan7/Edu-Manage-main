import axios from "axios";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromPDF = async (buffer) => {
  console.log("Step 1: Parsing PDF buffer...");
  const data = await pdfParse(buffer);
  console.log("Step 2: PDF Parsed");
  return data.text;
};

export const extractTextFromPDFUrl = async (fileUrl) => {
  console.log("Step 1: Downloading PDF from URL...");
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
    timeout: 15000,
  });
  console.log("Step 2: PDF Downloaded");
  return extractTextFromPDF(Buffer.from(response.data));
};