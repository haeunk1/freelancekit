import html2pdf from 'html2pdf.js'

export async function exportToPdf(elementId, filename = 'document.pdf') {
  const element = document.getElementById(elementId)
  if (!element) return

  const opt = {
    margin: [8, 8, 8, 8],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }

  await html2pdf().set(opt).from(element).save()
}
