// js/export.js
export function generatePDF(data) {
  // Implement PDF generation logic
  alert(`Generating PDF for ${data.sampleId}`);
  // In a real implementation, you would use a library like jsPDF
}

export function generateCSV(data) {
  // Implement CSV generation logic
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add headers
  csvContent += "Field,Value\n";
  
  // Add data rows
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      csvContent += `${key},"${value.join(', ')}"\n`;
    } else if (typeof value === 'object' && value !== null) {
      for (const [subKey, subValue] of Object.entries(value)) {
        csvContent += `${key}.${subKey},"${subValue}"\n`;
      }
    } else {
      csvContent += `${key},"${value}"\n`;
    }
  }
  
  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${data.sampleId || 'sample'}_data.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}