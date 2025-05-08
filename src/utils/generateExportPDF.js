import html2pdf from 'html2pdf.js'

export function downloadBudgetPDF(includeFullBreakdown = false) {
  console.log('Starting PDF generation...')
  
  // Find the export element
  const exportElement = document.getElementById('export-summary')
  if (!exportElement) {
    console.error('Export element not found')
    alert('Could not generate PDF: Export template not found')
    return
  }
  
  console.log('Export element found:', exportElement)
  
  // Apply class for full breakdown toggle
  if (!includeFullBreakdown) {
    exportElement.classList.add('summary-only')
  }
  
  // Simple options for better compatibility
  const options = {
    margin: 10,
    filename: 'Budget-Summary.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  // Show loading message
  alert('Generating PDF... This may take a moment.')
  
  console.log('Starting html2pdf conversion...')
  
  // Use a simpler approach
  html2pdf().from(exportElement).set(options).save().then(() => {
    console.log('PDF generation completed')
    
    // Remove class if added
    if (!includeFullBreakdown) {
      exportElement.classList.remove('summary-only')
    }
    
    alert('PDF generated successfully!')
  }).catch(error => {
    console.error('PDF generation error:', error)
    alert('Error generating PDF: ' + error.message)
    
    // Remove class if added
    if (!includeFullBreakdown) {
      exportElement.classList.remove('summary-only')
    }
  })
}
