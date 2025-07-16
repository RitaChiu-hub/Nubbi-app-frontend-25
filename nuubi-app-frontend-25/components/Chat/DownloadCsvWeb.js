import { saveAs } from "file-saver";

export const downloadCSVWeb = (csvString, filename = "group-analytics.csv") => {
  try {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
    // console.log("CSV download triggered on web");
  } catch (e) {
    // console.error("downloadCSVWeb error:", e);
    alert("Failed to download CSV on web.");
  }
};
