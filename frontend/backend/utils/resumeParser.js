const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const parseResume = async (filePath, mimeType) => {
  console.log("FILE PATH:", filePath);
  console.log("MIME TYPE:", mimeType);

  const fileBuffer = fs.readFileSync(filePath);

  console.log("FILE SIZE:", fileBuffer.length);

  if (mimeType === "application/pdf") {
    console.log("PARSING PDF...");

    const data = await pdfParse(fileBuffer);

    console.log("PDF PARSED SUCCESSFULLY");

    return data.text;
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    console.log("PARSING DOCX...");

    const result = await mammoth.extractRawText({
      buffer: fileBuffer,
    });

    console.log("DOCX PARSED SUCCESSFULLY");

    return result.value;
  }

  if (mimeType === "application/msword") {
    return "DOC file uploaded. DOC text extraction will be added next.";
  }

  throw new Error("Unsupported resume format");
};

module.exports = parseResume;