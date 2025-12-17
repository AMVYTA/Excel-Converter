import excelService from "../services/excelService.js";
import path from "path";
import fs from "fs";

export const convertExcelFile = async (req, res) => {
  try {
    const { sourceFilePath, template } = req.body;

    if (!sourceFilePath) {
      return res.status(400).json({ success: false, message: "Missing sourceFilePath" });
    }

    const safeTemplate = {
      rowRules: template?.rowRules ?? { filters: [], transforms: [], reorder: [] },
      columnMappings: template?.columnMappings ?? [],
      name: template?.name ?? "Untitled Template",
    };

    const result = excelService.convertExcel(sourceFilePath, safeTemplate);

    const outputFileName = "converted_" + Date.now() + ".xlsx";
    const outputPath = path.join("uploads", outputFileName);

    excelService.exportToExcel(result, outputPath);

    return res.json({
      success: true,
      message: "Conversion completed",
      downloadUrl: `/api/convert/download?filePath=${outputPath}`,
      filePath: outputPath,
    });
  } catch (error) {
    console.error("Conversion ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Conversion failed: " + error.message,
    });
  }
};


// ✅ Tambahkan fungsi download agar ROUTES tidak error lagi
export const downloadConvertedFile = async (req, res) => {
  try {
    const filePath = req.query.filePath;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "Missing filePath",
      });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Converted file not found",
      });
    }

    return res.download(filePath);
  } catch (error) {
    console.error("Download ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Download failed: " + error.message,
    });
  }
};

export const getRowRulesPreview = async (req, res) => {
  try {
    const { rowRules } = req.body || {};
    return res.json({
      success: true,
      rowRules: rowRules ?? [],
    });
  } catch (error) {
    return res.json({
      success: false,
      rowRules: [],
    });
  }
};
