// -------------------- Auxiliares --------------------

// --- Fatorial para Poisson ---
function fatorial(n) {
    if (n === 0) return 1;
    let res = 1;
    for (let i = 1; i <= n; i++) res *= i;
    return res;
}

// --- Probabilidade de empate usando Poisson completo ---
function calcularProbEmpatePoisson(lambdaA, lambdaB, maxGols = 10) {
    let probEmpate = 0;
    for (let k = 0; k <= maxGols; k++) {
        const pA = (Math.pow(lambdaA, k) * Math.exp(-lambdaA)) / fatorial(k);
        const pB = (Math.pow(lambdaB, k) * Math.exp(-lambdaB)) / fatorial(k);
        probEmpate += pA * pB;
    }
    return probValidas(probEmpate * 100);
}

// --- Limita probabilidade entre 0 e 100 ---
function probValidas(p) {
    return Math.min(Math.max(p, 0), 100);
}

// -------------------- Médias --------------------

// --- Calcula médias de gols marcados e sofridos ---
function calcularMediaGols(timePrefix) {
    let somaMarcados = 0, somaSofridos = 0, jogos = 5;
    for (let i = 1; i <= jogos; i++) {
        somaMarcados += parseInt(document.getElementById(`${timePrefix}_j${i}_marcados`).value) || 0;
        somaSofridos += parseInt(document.getElementById(`${timePrefix}_j${i}_sofridos`).value) || 0;
    }
    return { mediaMarcados: somaMarcados / jogos, mediaSofridos: somaSofridos / jogos };
}

// --- Atualiza médias exibidas na tela ---
function atualizarMedias() {
    const mediaA = calcularMediaGols('timeA');
    const mediaB = calcularMediaGols('timeB');

    document.getElementById('exibeGolsMarcadosA').textContent = mediaA.mediaMarcados.toFixed(2);
    document.getElementById('exibeGolsSofridosA').textContent = mediaA.mediaSofridos.toFixed(2);
    document.getElementById('exibeGolsMarcadosB').textContent = mediaB.mediaMarcados.toFixed(2);
    document.getElementById('exibeGolsSofridosB').textContent = mediaB.mediaSofridos.toFixed(2);

    document.getElementById('mediaGolsMarcadosTimeA').value = mediaA.mediaMarcados.toFixed(2);
    document.getElementById('mediaGolsSofridosTimeA').value = mediaA.mediaSofridos.toFixed(2);
    document.getElementById('mediaGolsMarcadosTimeB').value = mediaB.mediaMarcados.toFixed(2);
    document.getElementById('mediaGolsSofridosTimeB').value = mediaB.mediaSofridos.toFixed(2);
}

// --- Adiciona eventos de atualização de médias quando inputs mudam ---
function adicionarEventosInputs() {
    const inputsJogos = document.querySelectorAll('input[id^="timeA_j"], input[id^="timeB_j"]');
    inputsJogos.forEach(input => input.oninput = atualizarMedias);
}

// -------------------- Preenchimento e Limpeza --------------------

// --- Preenche dados de exemplo automaticamente ---
function preencherAutomatico() {
    const valores = {
        valorBanca: 100,
        oddVitoriaA: 1.80,
        oddEmpate: 3.40,
        oddEmpateAnulaA: 1.20,
        oddEmpateAnulaB: 1.30,
        oddVitoriaB: 2.20,
        oddOver15: 1.50,
        oddUnder25: 1.70,
        oddAmbosSim: 1.95,
        oddAmbosNao: 1.85,
        escanteiosAlvo: 5,
        oddEscanteiosMais: 1.80,
        oddEscanteiosExato: 3.00,
        oddEscanteiosMenos: 2.50,
        oddCartoesSim: 2.10,
        oddCartoesNao: 1.70,
        oddDuplaAEmpate: 1.25,
        oddDuplaEmpateB: 1.30,
        oddDuplaAB: 1.50,

        timeA_j1_marcados: 1, timeA_j1_sofridos: 0,
        timeA_j2_marcados: 2, timeA_j2_sofridos: 1,
        timeA_j3_marcados: 1, timeA_j3_sofridos: 2,
        timeA_j4_marcados: 3, timeA_j4_sofridos: 0,
        timeA_j5_marcados: 0, timeA_j5_sofridos: 1,

        timeB_j1_marcados: 1, timeB_j1_sofridos: 2,
        timeB_j2_marcados: 1, timeB_j2_sofridos: 1,
        timeB_j3_marcados: 0, timeB_j3_sofridos: 1,
        timeB_j4_marcados: 2, timeB_j4_sofridos: 3,
        timeB_j5_marcados: 1, timeB_j5_sofridos: 0,
    };

    for (const id in valores) {
        const el = document.getElementById(id);
        if (el) el.value = valores[id];
    }

    atualizarMedias();
    gerarSugestoes();
}

// --- Limpa todos os campos e resultados ---
function limparCampos() {
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('sugestaoForte').innerHTML = '';
    document.getElementById('sugestaoSimples').innerHTML = '';

    document.getElementById('exibeGolsMarcadosA').textContent = '-';
    document.getElementById('exibeGolsSofridosA').textContent = '-';
    document.getElementById('exibeGolsMarcadosB').textContent = '-';
    document.getElementById('exibeGolsSofridosB').textContent = '-';
}

// -------------------- Sugestões --------------------

// --- Sugestões simples ---
function gerarSugestoesSimples(banca, mercados) {
    return mercados
        .filter(m => m.odd && m.odd > 1)
        .map(m => ({
            nome: m.nome,
            odd: m.odd,
            probabilidade: probValidas(m.prob),
            tipo: m.prob >= 65 ? 'Alta' : 'Média',
            valorAposta: (probValidas(m.prob) / 100) * banca * 0.1
        }))
        .sort((a, b) => b.probabilidade - a.probabilidade);
}

// --- Sugestões duplas aprimoradas ---
function gerarSugestoesDuplas(banca, mercadosSimples, mercadosDupla) {
    const combinacoes = [];

    mercadosDupla.forEach(d => {
        mercadosSimples.forEach(s => {
            if ((d.nome.includes("Time A") && s.nome.includes("Time A")) ||
                (d.nome.includes("Time B") && s.nome.includes("Time B")) ||
                (d.nome.includes("Empate") && s.nome.includes("Empate"))) return;

            const probD = isNaN(d.prob) ? 50 : d.prob;
            const probS = isNaN(s.prob) ? 50 : s.prob;

            combinacoes.push({
                mercados: [d.nome, s.nome],
                oddCombinada: d.odd * s.odd,
                mediaProb: (probD + probS) / 2,
                valorAposta: ((probD + probS) / 2 / 100) * banca * 0.1
            });
        });
    });

    combinacoes.sort((a, b) => b.mediaProb - a.mediaProb);

    const primeira = combinacoes[0] || null;
    const segunda = combinacoes.find(c =>
        !primeira.mercados.some(m => c.mercados.includes(m))
    ) || null;

    return [primeira, segunda].filter(Boolean);
}

// --- Gera todas as sugestões e exibe na tela ---
function gerarSugestoes() {
    const banca = parseFloat(document.getElementById('valorBanca').value);
    const resultado = document.getElementById('resultado');
    const sugestaoForteDiv = document.getElementById('sugestaoForte');
    const sugestaoSimplesDiv = document.getElementById('sugestaoSimples');

    resultado.innerHTML = '';
    sugestaoForteDiv.innerHTML = '';
    sugestaoSimplesDiv.innerHTML = '';

    if (isNaN(banca) || banca <= 0) {
        resultado.innerHTML = '<p style="color:red;">Por favor, informe uma banca válida.</p>';
        return;
    }

    const escanteiosAlvo = parseInt(document.getElementById('escanteiosAlvo').value) || 5;

    const timeA = {
        golsMarcadosMed: parseFloat(document.getElementById('mediaGolsMarcadosTimeA').value) || 0,
        golsSofridosMed: parseFloat(document.getElementById('mediaGolsSofridosTimeA').value) || 0,
    };
    const timeB = {
        golsMarcadosMed: parseFloat(document.getElementById('mediaGolsMarcadosTimeB').value) || 0,
        golsSofridosMed: parseFloat(document.getElementById('mediaGolsSofridosTimeB').value) || 0,
    };

    const probVitoriaA = Math.max(0, timeA.golsMarcadosMed / (timeA.golsMarcadosMed + timeB.golsSofridosMed) * 100);
    const probVitoriaB = Math.max(0, timeB.golsMarcadosMed / (timeB.golsMarcadosMed + timeA.golsSofridosMed) * 100);
    const probEmpate = calcularProbEmpatePoisson(timeA.golsMarcadosMed, timeB.golsMarcadosMed);

    const mercadosSimples = [
        { nome: "Vitória Time A", odd: parseFloat(document.getElementById('oddVitoriaA').value), prob: probVitoriaA },
        { nome: "Empate", odd: parseFloat(document.getElementById('oddEmpate').value), prob: probEmpate },
        { nome: "Vitória Time B", odd: parseFloat(document.getElementById('oddVitoriaB').value), prob: probVitoriaB },
        { nome: "Over 1.5 Gols", odd: parseFloat(document.getElementById('oddOver15').value), prob: (timeA.golsMarcadosMed + timeB.golsMarcadosMed > 2) ? 80 : 50 },
        { nome: "Under 2.5 Gols", odd: parseFloat(document.getElementById('oddUnder25').value), prob: (timeA.golsMarcadosMed + timeB.golsMarcadosMed < 2.5) ? 70 : 40 },
        { nome: "Ambos Marcam - Sim", odd: parseFloat(document.getElementById('oddAmbosSim').value), prob: (timeA.golsMarcadosMed > 0.5 && timeB.golsMarcadosMed > 0.5) ? 65 : 35 },
        { nome: "Ambos Marcam - Não", odd: parseFloat(document.getElementById('oddAmbosNao').value), prob: 100 - ((timeA.golsMarcadosMed > 0.5 && timeB.golsMarcadosMed > 0.5) ? 65 : 35) },
        { nome: `Mais de ${escanteiosAlvo} Escanteios`, odd: parseFloat(document.getElementById('oddEscanteiosMais').value), prob: 75 },
        { nome: "Exatamente Escanteios", odd: parseFloat(document.getElementById('oddEscanteiosExato').value), prob: 20 },
        { nome: "Menos de Escanteios", odd: parseFloat(document.getElementById('oddEscanteiosMenos').value), prob: 25 },
        { nome: "Cartões Ambos - Sim", odd: parseFloat(document.getElementById('oddCartoesSim').value), prob: 50 },
        { nome: "Cartões Ambos - Não", odd: parseFloat(document.getElementById('oddCartoesNao').value), prob: 50 }
    ].filter(m => !isNaN(m.odd));

    const mercadosDupla = [
        { nome: "Dupla Hipótese: Time A ou Empate", odd: parseFloat(document.getElementById('oddDuplaAEmpate').value), prob: probValidas(probVitoriaA + probEmpate) },
        { nome: "Dupla Hipótese: Empate ou Time B", odd: parseFloat(document.getElementById('oddDuplaEmpateB').value), prob: probValidas(probVitoriaB + probEmpate) },
        { nome: "Dupla Hipótese: Time A ou Time B", odd: parseFloat(document.getElementById('oddDuplaAB').value), prob: probValidas(probVitoriaA + probVitoriaB) }
    ].filter(d => !isNaN(d.odd));

    const sugestoesSimples = gerarSugestoesSimples(banca, mercadosSimples);
    const duplasSelecionadas = gerarSugestoesDuplas(banca, sugestoesSimples, mercadosDupla);

    resultado.innerHTML = duplasSelecionadas.map(d => `
        <div class="sugestao dupla">
            <strong>Sugestão Dupla:</strong><br>
            ${d.mercados.join(' + ')}<br>
            Odd Combinada: ${d.oddCombinada.toFixed(2)} | Prob. Combinada: ${d.mediaProb.toFixed(1)}%<br>
            <span class="valor-aposta">Sugestão: R$ ${d.valorAposta.toFixed(2)}</span>
        </div>
    `).join('');

    sugestaoSimplesDiv.innerHTML = sugestoesSimples.map(s => `
        <div class="sugestao simples">
            ${s.nome}<br>
            Odd: ${s.odd.toFixed(2)} | Prob: ${s.probabilidade.toFixed(1)}%<br>
            Sugestão: R$ ${s.valorAposta.toFixed(2)}
        </div>
    `).join('');

    if (sugestoesSimples.length > 0) {
        const forte = sugestoesSimples[0];
        sugestaoForteDiv.innerHTML = `
            <div class="sugestao forte">
                🎯 Sugestão Forte:<br>
                ${forte.nome}<br>
                Odd: ${forte.odd.toFixed(2)} | Probabilidade: ${forte.probabilidade.toFixed(1)}%<br>
                Valor Aposta: R$ ${forte.valorAposta.toFixed(2)}
            </div>
        `;
    }
}

// -------------------- Inicialização --------------------
document.addEventListener('DOMContentLoaded', () => {
    adicionarEventosInputs();

    document.getElementById('btnPreencher').onclick = preencherAutomatico;
    document.getElementById('btnLimpar').onclick = limparCampos;
    document.getElementById('btnGerar').onclick = gerarSugestoes;

    atualizarMedias();
});
























