import XLSX from "xlsx";
import path from "path";
import fs from "fs";
import rowService from "./rowService.js";

class ExcelService {
  /**
   * Validate Excel file
   */
  validateExcelFile(filePath) {
    try {
      if (!filePath) {
        return { valid: false, message: "File path is required" };
      }

      if (!fs.existsSync(filePath)) {
        return { valid: false, message: "File does not exist" };
      }

      const ext = path.extname(filePath).toLowerCase();
      const validExtensions = [".xlsx", ".xls", ".csv"];

      if (!validExtensions.includes(ext)) {
        return { valid: false, message: "Invalid file extension. Only .xlsx, .xls, or .csv are allowed" };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, message: "Validation failed: " + error.message };
    }
  }

  /**
   * Membaca file Excel dan mengubahnya menjadi JSON array
   */
  parseExcel(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error("Uploaded file not found on server");
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  }

  /**
   * Read Excel file and return full data array
   */
  readExcelData(filePath) {
    return this.parseExcel(filePath);
  }

  /**
   * Read Excel file headers and metadata
   */
  readExcelHeaders(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error("Uploaded file not found on server");
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Get data to extract headers
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    // Extract headers from first row
    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    // Get file name from path
    const fileName = path.basename(filePath);

    // Get row count
    const rowCount = data.length;

    return {
      headers,
      fileName,
      rowCount,
      sheetName
    };
  }

  /**
   * Terapkan MAPPING COLUMNS (Column Mode)
   * Backend TIDAK BOLEH ERROR jika mapping kosong.
   */
  applyColumnMapping(data, columnMappings) {
    if (!columnMappings || !Array.isArray(columnMappings) || columnMappings.length === 0) {
      console.warn("⚠ No column mappings provided → returning original data");
      return data;
    }

    return data.map((row) => {
      const newRow = {};

      columnMappings.forEach((m) => {
        if (!m) return;

        const src = m.sourceColumn;
        const tgt = m.targetColumn;

        if (!src || !tgt) return;

        let value = row[src];

        if (m.transform === "number") value = Number(value) || 0;
        if (m.transform === "string") value = String(value || "");

        newRow[tgt] = value ?? "";
      });

      return newRow;
    });
  }

  /**
   * Apply ROW RULES (Row Mode) using rowService
   */
  applyRowRules(data, rowRules) {
    // Check if rowRules is an object with filters/transforms/reorder
    if (!rowRules || typeof rowRules !== 'object') {
      console.warn("⚠ No row rules provided → skipping row editing");
      return data;
    }

    // Check if there are any actual rules to apply
    const hasFilters = rowRules.filters && rowRules.filters.length > 0;
    const hasTransforms = rowRules.transforms && rowRules.transforms.length > 0;
    const hasReorder = rowRules.reorder && rowRules.reorder.length > 0;

    if (!hasFilters && !hasTransforms && !hasReorder) {
      console.warn("⚠ No row rules provided → skipping row editing");
      return data;
    }

    // Use rowService for proper row processing
    return rowService.applyRowRules(data, rowRules);
  }

  /**
   * Jalankan konversi lengkap
   */
  convertExcel(filePath, template) {
    if (!template) throw new Error("Template is missing");

    const rowRules = template.rowRules || [];
    const columnMappings = template.columnMappings || [];

    const originalData = this.parseExcel(filePath);

    // ROW MODE terlebih dahulu
    const rowProcessed = this.applyRowRules(originalData, rowRules);

    // COLUMN MODE berikutnya
    const finalData = this.applyColumnMapping(rowProcessed, columnMappings);

    return finalData;
  }

  /**
   * Simpan hasil convert ke Excel
   */
  exportToExcel(data, outputPath) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Result");

    XLSX.writeFile(workbook, outputPath);
    return outputPath;
  }
}

export default new ExcelService();
