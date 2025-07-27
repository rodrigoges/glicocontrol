
import { Measurement } from '../types';
import { CLASSIFICATION_NAMES } from '../constants';

// TypeScript declarations for global libraries loaded via CDN
declare const jspdf: any;
declare const autoTable: any;

export const generatePdf = (measurements: Measurement[]): void => {
    if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
        console.error("jsPDF not loaded");
        alert("Erro: A biblioteca para gerar PDF não foi carregada.");
        return;
    }
    
    // eslint-disable-next-line new-cap
    const doc = new jspdf.jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Relatório de Glicemia - GlicoControl", 14, 22);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

    const tableColumn = ["Data e Hora", "Glicemia (mg/dL)", "Classificação"];
    const tableRows: (string | number)[][] = [];

    measurements.forEach(m => {
        const measurementData = [
            new Date(m.date).toLocaleString('pt-BR'),
            m.value,
            CLASSIFICATION_NAMES[m.classification]
        ];
        tableRows.push(measurementData);
    });

    if (doc.autoTable) {
         doc.autoTable({
            startY: 40,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] }
        });
    } else if (autoTable) {
        autoTable(doc, {
            startY: 40,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] }
        });
    } else {
        console.error("jspdf-autotable not loaded");
        alert("Erro: A biblioteca para gerar tabelas no PDF não foi carregada.");
        return;
    }

    doc.save("historico_glicemia_glicocontrol.pdf");
};
