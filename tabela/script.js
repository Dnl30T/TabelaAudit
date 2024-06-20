// script.js
$(document).ready(function() {
    const setoresAcoes = {
        "RT": ["Estoque DMB/TREF", "Rodando TREF", "Estoque Final RT"],
        "RO": ["Estoque Inicio RO", "Rodando TT99", "Estoque TT99", "Rodando M40", "Estoque M40/M32", "Rodando M32"],
        "RCD1": ["Estoque Inicio RCD1", "Rodando LT160", "Rodando TB4", "LT160/M137","Rodando M137", "Estoque Final RCD1"],
        "RCD2": ["Estoque Inicio RCD2", "Rodando M55", "Rodando teleférico"],
        "RCD3": ["Estoque Inicio RCD3", "Rodando LT160", "Estoque LT160/M137", "Rodando M137", "Estoque Final RCD3"],
        "RCD4": ["Estoque Inicio RCD4", "Rodando LT160", "Estoque LT160/M137", "Rodando M137", "Estoque Final B80"]
    };
    
    const perguntas = ["Tem LB?", "Tem UB?", "Sem rastreabilidade?", "Sem Etiqueta?"];
    
    const tbody = $("#setorTable tbody");

    for (const [setor, acoes] of Object.entries(setoresAcoes)) {
        acoes.forEach(acao => {
            const row = $("<tr></tr>");
            row.append(`<td>${setor}</td>`);
            row.append(`<td>${acao}</td>`);
            perguntas.forEach(pergunta => {
                const cell = $("<td></td>");
                for (let i = 0; i < 10; i++) {
                    cell.append(`<input type="checkbox" class="question-checkbox" data-setor="${setor}" data-acao="${acao}" data-pergunta="${pergunta}">`);
                }
                row.append(cell);
            });
            tbody.append(row);
        });
    }

    $("#exportBtn").click(function() {
        const stats = {};

        for (const [setor, acoes] of Object.entries(setoresAcoes)) {
            stats[setor] = {};
            acoes.forEach(acao => {
                stats[setor][acao] = {};
                perguntas.forEach(pergunta => {
                    const checkboxes = $(`input[data-setor='${setor}'][data-acao='${acao}'][data-pergunta='${pergunta}']`);
                    const count = checkboxes.filter(":checked").length;
                    stats[setor][acao][pergunta] = count;
                });
            });
        }

        const reportHTML = generateReportHTML(stats);
        const blob = new Blob([reportHTML], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = $("<a></a>").attr("href", url).attr("download", "relatorio.html").appendTo("body");
        a[0].click();
        a.remove();
    });

    function generateReportHTML(stats) {
        let report = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Relatório de Estatísticas</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
                    th { background-color: #f4f4f4; }
                </style>
            </head>
            <body>
                <h1>Relatório de Estatísticas</h1>
        `;

        for (const [setor, acoes] of Object.entries(stats)) {
            report += `<h2>Setor: ${setor}</h2>`;
            for (const [acao, perguntas] of Object.entries(acoes)) {
                report += `<h3>Ação: ${acao}</h3>`;
                report += `
                    <table>
                        <thead>
                            <tr>
                                <th>Pergunta</th>
                                <th>Contagem</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                for (const [pergunta, count] of Object.entries(perguntas)) {
                    report += `
                        <tr>
                            <td>${pergunta}</td>
                            <td>${count}</td>
                        </tr>
                    `;
                }
                report += `</tbody></table>`;
            }
        }

        report += `</body></html>`;
        return report;
    }
});
