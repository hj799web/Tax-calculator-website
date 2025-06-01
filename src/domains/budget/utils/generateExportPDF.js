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
  } else {
    exportElement.classList.remove('summary-only')
  }
  
  // Enhanced options for better quality and professional output
  const options = {
    margin: [15, 15, 15, 15],
    filename: 'Federal-Budget-Summary.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: ['h2', 'h3', 'table']
    }
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
