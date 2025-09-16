// -------------------- Funções Auxiliares --------------------

// Converte x/y em porcentagem
function calcPercent(valor) {
    if (!valor) return 0;
    const parts = valor.split('/');
    const numerador = parseFloat(parts[0]) || 0;
    const denominador = parseFloat(parts[1]) || 1;
    return (numerador / denominador) * 100;
}

// Formata para 1 casa decimal
function pct(valor) {
    return (valor || 0).toFixed(1);
}

// Limpa todos os inputs
function limparCampos() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    document.getElementById('resultado').innerHTML = '';
}

// Preenche exemplo
function preencherExemplo() {
    // Time Casa
    document.getElementById('nomeCasa').value = 'Juventus';
    document.getElementById('vitoriasCasa').value = '3/5';
    document.getElementById('vitoriasCasaEmCasa').value = '3/5';
    document.getElementById('vitoriasCasaFora').value = '2/5';
    document.getElementById('naoVenceuCasa').value = '2/5';
    document.getElementById('mais1_5Casa').value = '4/5';
    document.getElementById('maisGolsCasa').value = '3/4';
    document.getElementById('menosGolsCasa').value = '1/4';
    document.getElementById('menosGolsCasaFora').value = '1/4';
    document.getElementById('marcouPrimeiroCasa').value = '3/4';
    document.getElementById('vencePrimeiroTempoCasa').value = '2/4';
    document.getElementById('ambosMarcamCasa').value = '3/4';

    // Time Visitante
    document.getElementById('nomeFora').value = 'Borussia';
    document.getElementById('vitoriasFora').value = '2/5';
    document.getElementById('vitoriasForaEmCasa').value = '2/5';
    document.getElementById('vitoriasForaFora').value = '1/5';
    document.getElementById('naoVenceuFora').value = '1/5';
    document.getElementById('mais1_5Fora').value = '3/5';
    document.getElementById('maisGolsFora').value = '2/4';
    document.getElementById('menosGolsFora').value = '1/4';
    document.getElementById('menosGolsForaFora').value = '1/4';
    document.getElementById('marcouPrimeiroFora').value = '1/4';
    document.getElementById('vencePrimeiroTempoFora').value = '1/4';
    document.getElementById('ambosMarcamFora').value = '2/4';

    // Confronto Direto
    document.getElementById('vitoriasCasaCD').value = '3/4';
    document.getElementById('vitoriasForaCD').value = '1/4';
    document.getElementById('empatesCD').value = '0/4';
    document.getElementById('ganhouEmpatouCasaCD').value = '2/4';
    document.getElementById('maisGolsCasaCD').value = '2/4';
    document.getElementById('menosGolsCasaCD').value = '1/4';
    document.getElementById('marcouPrimeiroCasaCD').value = '1/4';
    document.getElementById('vencePrimeiroTempoCasaCD').value = '1/4';
    document.getElementById('ambosMarcamCasaCD').value = '2/4';
    document.getElementById('ganhouEmpatouForaCD').value = '2/4';
    document.getElementById('maisGolsForaCD').value = '2/4';
    document.getElementById('menosGolsForaCD').value = '1/4';
    document.getElementById('marcouPrimeiroForaCD').value = '1/4';
    document.getElementById('vencePrimeiroTempoForaCD').value = '1/4';
    document.getElementById('ambosMarcamForaCD').value = '2/4';
}

// -------------------- Função Principal --------------------
function gerarSugestoes() {
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';

    // Captura valores
    const casa = {
        nome: document.getElementById('nomeCasa').value,
        vitorias: calcPercent(document.getElementById('vitoriasCasa').value),
        vitoriasEmCasa: calcPercent(document.getElementById('vitoriasCasaEmCasa').value),
        vitoriasFora: calcPercent(document.getElementById('vitoriasCasaFora').value),
        naoVenceu: calcPercent(document.getElementById('naoVenceuCasa').value),
        mais1_5: calcPercent(document.getElementById('mais1_5Casa').value),
        mais2_5: calcPercent(document.getElementById('maisGolsCasa').value),
        menos2_5: calcPercent(document.getElementById('menosGolsCasa').value),
        menos2_5Fora: calcPercent(document.getElementById('menosGolsCasaFora').value),
        marcouPrimeiro: calcPercent(document.getElementById('marcouPrimeiroCasa').value),
        venceuPrimeiroTempo: calcPercent(document.getElementById('vencePrimeiroTempoCasa').value),
        ambosMarcam: calcPercent(document.getElementById('ambosMarcamCasa').value)
    };

    const visitante = {
        nome: document.getElementById('nomeFora').value,
        vitorias: calcPercent(document.getElementById('vitoriasFora').value),
        vitoriasEmCasa: calcPercent(document.getElementById('vitoriasForaEmCasa').value),
        vitoriasFora: calcPercent(document.getElementById('vitoriasForaFora').value),
        naoVenceu: calcPercent(document.getElementById('naoVenceuFora').value),
        mais1_5: calcPercent(document.getElementById('mais1_5Fora').value),
        mais2_5: calcPercent(document.getElementById('maisGolsFora').value),
        menos2_5: calcPercent(document.getElementById('menosGolsFora').value),
        menos2_5Fora: calcPercent(document.getElementById('menosGolsForaFora').value),
        marcouPrimeiro: calcPercent(document.getElementById('marcouPrimeiroFora').value),
        venceuPrimeiroTempo: calcPercent(document.getElementById('vencePrimeiroTempoFora').value),
        ambosMarcam: calcPercent(document.getElementById('ambosMarcamFora').value)
    };

    const confronto = {
        vitoriasCasa: calcPercent(document.getElementById('vitoriasCasaCD').value),
        vitoriasFora: calcPercent(document.getElementById('vitoriasForaCD').value),
        empates: calcPercent(document.getElementById('empatesCD').value),
        ganhouEmpatouCasa: calcPercent(document.getElementById('ganhouEmpatouCasaCD').value),
        mais2_5Casa: calcPercent(document.getElementById('maisGolsCasaCD').value),
        menos2_5Casa: calcPercent(document.getElementById('menosGolsCasaCD').value),
        marcouPrimeiroCasa: calcPercent(document.getElementById('marcouPrimeiroCasaCD').value),
        venceuPrimeiroTempoCasa: calcPercent(document.getElementById('vencePrimeiroTempoCasaCD').value),
        ambosMarcamCasa: calcPercent(document.getElementById('ambosMarcamCasaCD').value),
        ganhouEmpatouFora: calcPercent(document.getElementById('ganhouEmpatouForaCD').value),
        mais2_5Fora: calcPercent(document.getElementById('maisGolsForaCD').value),
        menos2_5Fora: calcPercent(document.getElementById('menosGolsForaCD').value),
        marcouPrimeiroFora: calcPercent(document.getElementById('marcouPrimeiroForaCD').value),
        venceuPrimeiroTempoFora: calcPercent(document.getElementById('vencePrimeiroTempoForaCD').value),
        ambosMarcamFora: calcPercent(document.getElementById('ambosMarcamForaCD').value)
    };

    // -------------------- Lógica de +1,5 e +2,5 --------------------
    let golsMais1_5 = casa.mais1_5 > 0 || visitante.mais1_5 > 0;
    let golsMais2_5 = casa.mais2_5 > 0 || visitante.mais2_5 > 0;
    let resultadoGols = '';

    if (golsMais1_5 && golsMais2_5) {
        resultadoGols = 'Anulado (campo +1,5 ou +2,5 preenchido)';
    } else if (golsMais1_5) {
        resultadoGols = 'Provável +1,5 gols';
    } else if (golsMais2_5) {
        resultadoGols = 'Provável +2,5 gols';
    } else {
        resultadoGols = 'Sem análise de gols';
    }

    // -------------------- Determinar vencedor provável --------------------
    let vencedor = casa.vitorias > visitante.vitorias ? casa.nome : visitante.nome;

    // -------------------- Ambos marcam --------------------
    let ambosMarcam = (casa.ambosMarcam + visitante.ambosMarcam) / 2 > 50 ? 'Provável Ambos Marcam (BTTS)' : 'Provável Não Ambos Marcam';

    // -------------------- Exibir resultado --------------------
    resultado.innerHTML = `
        <h3>Análise Geral</h3>
        <p>Vencedor: ${vencedor} provável vencedor</p>
        <p>Gols +1,5 / +2,5: ${resultadoGols}</p>
        <p>Ambos Marcam: ${ambosMarcam}</p>

        <h4>${casa.nome} (Time da Casa)</h4>
        <p>Vitórias: ${pct(casa.vitorias)}%</p>
        <p>Venceu em casa: ${pct(casa.vitoriasEmCasa)}%</p>
        <p>Venceu fora de casa: ${pct(casa.vitoriasFora)}%</p>
        <p>Não venceu: ${pct(casa.naoVenceu)}%</p>
        <p>+1,5 gols: ${pct(casa.mais1_5)}%</p>
        <p>+2,5 gols: ${pct(casa.mais2_5)}%</p>
        <p>-2,5 gols: ${pct(casa.menos2_5)}%</p>
        <p>-2,5 gols fora: ${pct(casa.menos2_5Fora)}%</p>
        <p>Marcou primeiro: ${pct(casa.marcouPrimeiro)}%</p>
        <p>Venceu 1º tempo: ${pct(casa.venceuPrimeiroTempo)}%</p>
        <p>Ambos marcaram: ${pct(casa.ambosMarcam)}%</p>

        <h4>${visitante.nome} (Time Visitante)</h4>
        <p>Vitórias: ${pct(visitante.vitorias)}%</p>
        <p>Venceu em casa: ${pct(visitante.vitoriasEmCasa)}%</p>
        <p>Venceu fora de casa: ${pct(visitante.vitoriasFora)}%</p>
        <p>Não venceu: ${pct(visitante.naoVenceu)}%</p>
        <p>+1,5 gols: ${pct(visitante.mais1_5)}%</p>
        <p>+2,5 gols: ${pct(visitante.mais2_5)}%</p>
        <p>-2,5 gols: ${pct(visitante.menos2_5)}%</p>
        <p>-2,5 gols fora: ${pct(visitante.menos2_5Fora)}%</p>
        <p>Marcou primeiro: ${pct(visitante.marcouPrimeiro)}%</p>
        <p>Venceu 1º tempo: ${pct(visitante.venceuPrimeiroTempo)}%</p>
        <p>Ambos marcaram: ${pct(visitante.ambosMarcam)}%</p>
    `;
}

// -------------------- Event Listeners --------------------
document.getElementById('preencherExemplo').addEventListener('click', preencherExemplo);
document.getElementById('limpar').addEventListener('click', limparCampos);
document.getElementById('gerar').addEventListener('click', gerarSugestoes);































