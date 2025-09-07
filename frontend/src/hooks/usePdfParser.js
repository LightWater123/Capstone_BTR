import axios from "../api/api";

export async function parsePdf(pdfFile, category) {
  const formData = new FormData();
  formData.append("pdf", pdfFile);
  formData.append("mode", category);

  try {
    const res = await axios.post("/api/parse-pdf", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    return res.data.data || [];
  } catch (err) {
    console.error("PDF parse failed:", err);
    throw err;
  }
}
