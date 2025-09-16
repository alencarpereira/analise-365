// Função para converter "x/y" em porcentagem
function parseXY(valor) {
    if (!valor || !valor.includes('/')) return 0;
    let partes = valor.split('/');
    let x = parseInt(partes[0]) || 0;
    let y = parseInt(partes[1]) || 0;
    if (y === 0) return 0;
    return (x / y) * 100;
}

// Função para preencher campos com exemplo
document.getElementById('preencherExemplo').addEventListener('click', () => {
    const exemplo = {
        nomeCasa: "Juventus",
        vitoriasCasa: "3/5",
        vitoriasCasaFora: "2/5",
        maisGolsCasa: "3/4",
        menosGolsCasa: "1/4",
        marcouPrimeiroCasa: "3/4",
        vencePrimeiroTempoCasa: "2/4",
        ambosMarcamCasa: "3/4",

        nomeFora: "Borussia",
        vitoriasFora: "2/5",
        vitoriasForaFora: "1/5",
        maisGolsFora: "2/4",
        menosGolsFora: "1/4",
        marcouPrimeiroFora: "1/4",
        vencePrimeiroTempoFora: "1/4",
        ambosMarcamFora: "2/4",

        vitoriasCasaCD: "3/4",
        vitoriasForaCD: "1/4",
        empatesCD: "0/4",
        maisGolsCasaCD: "2/4",
        menosGolsCasaCD: "1/4",
        marcouPrimeiroCasaCD: "1/4",
        vencePrimeiroTempoCasaCD: "1/4",
        ambosMarcamCasaCD: "2/4",
        maisGolsForaCD: "2/4",
        menosGolsForaCD: "1/4",
        marcouPrimeiroForaCD: "1/4",
        vencePrimeiroTempoForaCD: "1/4",
        ambosMarcamForaCD: "2/4"
    };

    for (let key in exemplo) {
        let input = document.getElementById(key);
        if (input) input.value = exemplo[key];
    }
});

// Função para resetar todos os campos e resultado
function resetCampos() {
    document.querySelectorAll('input').forEach(input => {
        if (input.id.includes("nome")) {
            input.value = ""; // nomes ficam vazios
        } else {
            input.value = "0/0"; // estatísticas voltam para 0/0
        }
    });
    document.getElementById('resultado').innerHTML = ""; // limpa resultado
}

// Botão para limpar campos
document.getElementById('limpar').addEventListener('click', () => {
    resetCampos();
});

// Função para gerar análise e sugestões
document.getElementById('gerar').addEventListener('click', () => {
    const dados = {};
    document.querySelectorAll('input').forEach(input => {
        dados[input.id] = input.value.trim() || (input.id.includes("nome") ? "" : "0/0");
    });

    // Converter x/y para porcentagem
    const perc = {};
    for (let key in dados) {
        perc[key] = parseXY(dados[key]);
    }

    // Análise simples de vencedor
    const casaScore = perc.vitoriasCasa + perc.vitoriasCasaFora + perc.vencePrimeiroTempoCasa + perc.marcouPrimeiroCasa;
    const foraScore = perc.vitoriasFora + perc.vitoriasForaFora + perc.vencePrimeiroTempoFora + perc.marcouPrimeiroFora;

    let vencedor = "Empate provável";
    if (casaScore > foraScore) vencedor = `${dados.nomeCasa} provável vencedor`;
    if (foraScore > casaScore) vencedor = `${dados.nomeFora} provável vencedor`;

    // Análise de gols
    const maisGols = (perc.maisGolsCasa + perc.maisGolsFora + perc.maisGolsCasaCD + perc.maisGolsForaCD) / 4;
    const btts = (perc.ambosMarcamCasa + perc.ambosMarcamFora + perc.ambosMarcamCasaCD + perc.ambosMarcamForaCD) / 4;
    const over25 = maisGols >= 50 ? "Provável +2,5 gols" : "Provável -2,5 gols";
    const ambos = btts >= 50 ? "Provável Ambos Marcam (BTTS)" : "Provável Nem Ambos Marcam";

    // Montar HTML de resultado (mantendo o padrão existente)
    const resultadoHTML = `
        <h3>Análise Geral</h3>
        <p><strong>Vencedor:</strong> ${vencedor}</p>
        <p><strong>Gols:</strong> ${over25}</p>
        <p><strong>Ambos Marcam:</strong> ${ambos}</p>
        <hr>
        <h3>${dados.nomeCasa} (Time da Casa)</h3>
        <p>Vitórias: ${perc.vitoriasCasa.toFixed(1)}%</p>
        <p>Venceu fora de casa: ${perc.vitoriasCasaFora.toFixed(1)}%</p>
        <p>+2,5 gols: ${perc.maisGolsCasa.toFixed(1)}%</p>
        <p>-2,5 gols: ${perc.menosGolsCasa.toFixed(1)}%</p>
        <p>Marcou primeiro: ${perc.marcouPrimeiroCasa.toFixed(1)}%</p>
        <p>Venceu 1º tempo: ${perc.vencePrimeiroTempoCasa.toFixed(1)}%</p>
        <p>Ambos marcaram: ${perc.ambosMarcamCasa.toFixed(1)}%</p>

        <h3>${dados.nomeFora} (Time Visitante)</h3>
        <p>Vitórias: ${perc.vitoriasFora.toFixed(1)}%</p>
        <p>Venceu fora de casa: ${perc.vitoriasForaFora.toFixed(1)}%</p>
        <p>+2,5 gols: ${perc.maisGolsFora.toFixed(1)}%</p>
        <p>-2,5 gols: ${perc.menosGolsFora.toFixed(1)}%</p>
        <p>Marcou primeiro: ${perc.marcouPrimeiroFora.toFixed(1)}%</p>
        <p>Venceu 1º tempo: ${perc.vencePrimeiroTempoFora.toFixed(1)}%</p>
        <p>Ambos marcaram: ${perc.ambosMarcamFora.toFixed(1)}%</p>

        <h3>Confronto Direto</h3>
        <p>Vitórias ${dados.nomeCasa}: ${perc.vitoriasCasaCD.toFixed(1)}%</p>
        <p>Vitórias ${dados.nomeFora}: ${perc.vitoriasForaCD.toFixed(1)}%</p>
        <p>Empates: ${perc.empatesCD.toFixed(1)}%</p>

        <h4>${dados.nomeCasa} (Confronto Direto)</h4>
        <p>+2,5 gols: ${perc.maisGolsCasaCD.toFixed(1)}%</p>
        <p>-2,5 gols: ${perc.menosGolsCasaCD.toFixed(1)}%</p>
        <p>Marcou primeiro: ${perc.marcouPrimeiroCasaCD.toFixed(1)}%</p>
        <p>Venceu 1º tempo: ${perc.vencePrimeiroTempoCasaCD.toFixed(1)}%</p>
        <p>Ambos marcaram: ${perc.ambosMarcamCasaCD.toFixed(1)}%</p>

        <h4>${dados.nomeFora} (Confronto Direto)</h4>
        <p>+2,5 gols: ${perc.maisGolsForaCD.toFixed(1)}%</p>
        <p>-2,5 gols: ${perc.menosGolsForaCD.toFixed(1)}%</p>
        <p>Marcou primeiro: ${perc.marcouPrimeiroForaCD.toFixed(1)}%</p>
        <p>Venceu 1º tempo: ${perc.vencePrimeiroTempoForaCD.toFixed(1)}%</p>
        <p>Ambos marcaram: ${perc.ambosMarcamForaCD.toFixed(1)}%</p>
    `;

    document.getElementById('resultado').innerHTML = resultadoHTML;
});



























