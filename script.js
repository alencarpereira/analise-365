// --- Atualiza médias quando qualquer input dos jogos é alterado ---
function adicionarEventosInputs() {
    const inputsJogos = document.querySelectorAll('input[id^="timeA_j"], input[id^="timeB_j"]');
    inputsJogos.forEach(input => {
        input.oninput = () => {
            atualizarMedias();
        };
    });
}

// --- Função para preencher dados de exemplo automaticamente ---
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

        timeA_j1_marcados: 1,
        timeA_j1_sofridos: 0,
        timeA_j2_marcados: 2,
        timeA_j2_sofridos: 1,
        timeA_j3_marcados: 1,
        timeA_j3_sofridos: 2,
        timeA_j4_marcados: 3,
        timeA_j4_sofridos: 0,
        timeA_j5_marcados: 0,
        timeA_j5_sofridos: 1,

        timeB_j1_marcados: 1,
        timeB_j1_sofridos: 2,
        timeB_j2_marcados: 1,
        timeB_j2_sofridos: 1,
        timeB_j3_marcados: 0,
        timeB_j3_sofridos: 1,
        timeB_j4_marcados: 2,
        timeB_j4_sofridos: 3,
        timeB_j5_marcados: 1,
        timeB_j5_sofridos: 0,
    };

    for (const id in valores) {
        const el = document.getElementById(id);
        if (el) el.value = valores[id];
    }
    atualizarMedias();
    gerarSugestoes();
}

// --- Calcula médias de gols marcados e sofridos para um time ---
function calcularMediaGols(timePrefix) {
    let somaMarcados = 0;
    let somaSofridos = 0;
    let jogos = 5;

    for (let i = 1; i <= jogos; i++) {
        const marcados = parseInt(document.getElementById(`${timePrefix}_j${i}_marcados`).value) || 0;
        const sofridos = parseInt(document.getElementById(`${timePrefix}_j${i}_sofridos`).value) || 0;
        somaMarcados += marcados;
        somaSofridos += sofridos;
    }

    return {
        mediaMarcados: somaMarcados / jogos,
        mediaSofridos: somaSofridos / jogos,
    };
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

// --- Função para alternar modo debug ---
function alternarDebug() {
    const debugBox = document.getElementById("debug");
    debugBox.style.display = debugBox.style.display === "none" ? "block" : "none";
}

// --- Função para limpar todos os campos ---
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

// --- Atualiza valores ao trocar de jogo ---
function onJogoChange() {
    const seletor = document.getElementById('seletorJogo');
    const valor = seletor.value;
    const jogos = {
        jogo1: {
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
        },
        jogo2: {
            timeA_j1_marcados: 2, timeA_j1_sofridos: 1,
            timeA_j2_marcados: 1, timeA_j2_sofridos: 0,
            timeA_j3_marcados: 3, timeA_j3_sofridos: 1,
            timeA_j4_marcados: 2, timeA_j4_sofridos: 2,
            timeA_j5_marcados: 1, timeA_j5_sofridos: 1,
            timeB_j1_marcados: 0, timeB_j1_sofridos: 2,
            timeB_j2_marcados: 2, timeB_j2_sofridos: 1,
            timeB_j3_marcados: 1, timeB_j3_sofridos: 1,
            timeB_j4_marcados: 0, timeB_j4_sofridos: 2,
            timeB_j5_marcados: 1, timeB_j5_sofridos: 3,
        }
    };

    if (jogos[valor]) {
        for (const id in jogos[valor]) {
            const el = document.getElementById(id);
            if (el) el.value = jogos[valor][id];
        }
        atualizarMedias();
    }
}

// --- Inicialização ---
window.onload = () => {
    adicionarEventosInputs();
    document.getElementById("debug").style.display = "none";
};

// --- Função pura: gera sugestões simples ---
function gerarSugestaoSimples(mercados) {
    const sugestoes = [];
    mercados.forEach(m => {
        if (m.odd && m.odd > 1) {
            const probabilidade = 100 / m.odd;
            const tipo = m.odd < 2 ? 'Alta' : 'Média';
            sugestoes.push({
                nome: m.nome,
                odd: m.odd,
                probabilidade,
                tipo,
                valorAposta: (probabilidade / 100) * 10
            });
        }
    });
    return sugestoes;
}

// --- Função principal: gera sugestões ---
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

    const mercadosSimples = [
        { nome: "Vitória Time A", odd: parseFloat(document.getElementById('oddVitoriaA').value) },
        { nome: "Empate", odd: parseFloat(document.getElementById('oddEmpate').value) },
        { nome: "Empate Anula A", odd: parseFloat(document.getElementById('oddEmpateAnulaA').value) },
        { nome: "Empate Anula B", odd: parseFloat(document.getElementById('oddEmpateAnulaB').value) },
        { nome: "Vitória Time B", odd: parseFloat(document.getElementById('oddVitoriaB').value) },
        { nome: "Over 1.5 Gols", odd: parseFloat(document.getElementById('oddOver15').value) },
        { nome: "Under 2.5 Gols", odd: parseFloat(document.getElementById('oddUnder25').value) },
        { nome: "Ambos Marcam - Sim", odd: parseFloat(document.getElementById('oddAmbosSim').value) },
        { nome: "Ambos Marcam - Não", odd: parseFloat(document.getElementById('oddAmbosNao').value) },
        { nome: `Mais de ${escanteiosAlvo} Escanteios`, odd: parseFloat(document.getElementById('oddEscanteiosMais').value) },
        { nome: "Exatamente Escanteios", odd: parseFloat(document.getElementById('oddEscanteiosExato').value) },
        { nome: "Menos de Escanteios", odd: parseFloat(document.getElementById('oddEscanteiosMenos').value) },
        { nome: "Cartões Ambos - Sim", odd: parseFloat(document.getElementById('oddCartoesSim').value) },
        { nome: "Cartões Ambos - Não", odd: parseFloat(document.getElementById('oddCartoesNao').value) }
    ];

    const mercadosDuplaHipotese = [
        { nome: "Dupla Hipótese: Time A ou Empate", odd: parseFloat(document.getElementById('oddDuplaAEmpate').value) },
        { nome: "Dupla Hipótese: Empate ou Time B", odd: parseFloat(document.getElementById('oddDuplaEmpateB').value) },
        { nome: "Dupla Hipótese: Time A ou Time B", odd: parseFloat(document.getElementById('oddDuplaAB').value) }
    ];

    let sugestoesSimples = gerarSugestaoSimples(mercadosSimples);

    if (timeA.golsMarcadosMed > 1 && timeB.golsMarcadosMed > 1) {
        sugestoesSimples = sugestoesSimples.filter(s => s.nome !== "Ambos Marcam - Não");
    }
    const soma = timeA.golsMarcadosMed + timeA.golsSofridosMed + timeB.golsMarcadosMed + timeB.golsSofridosMed;
    if (soma > 3.5) {
        sugestoesSimples = sugestoesSimples.filter(s => s.nome !== "Under 2.5 Gols");
    }

    let sugestoesDuplaHipotese = gerarSugestaoSimples(mercadosDuplaHipotese);

    const temDuplaHipotese = sugestoesDuplaHipotese.length > 0;
    let sugestoesSimplesFiltradas = temDuplaHipotese
        ? sugestoesSimples.filter(s => !["Vitória Time A", "Empate", "Empate Anula A", "Empate Anula B", "Vitória Time B"].includes(s.nome))
        : sugestoesSimples;

    sugestoesSimplesFiltradas.sort((a, b) => b.probabilidade - a.probabilidade);

    if (sugestoesSimplesFiltradas.length === 0) {
        sugestaoSimplesDiv.innerHTML = `<p>Nenhuma sugestão simples gerada. Preencha as odds corretamente.</p>`;
    } else {
        sugestaoSimplesDiv.innerHTML = sugestoesSimplesFiltradas.map(s => `
            <div class="sugestao ${s.tipo === 'Alta' ? 'alta' : 'media'}" style="margin-bottom:8px; padding:6px; border-radius:5px; border:1px solid #ccc;">
                <strong>${s.nome}</strong><br>
                Odd: ${s.odd.toFixed(2)} | Prob: ${s.probabilidade.toFixed(1)}%<br>
                Tipo: ${s.tipo} confiança<br>
                <span style="color:#006600;">Sugestão: Apostar R$ ${s.valorAposta.toFixed(2)}</span>
            </div>
        `).join('');
    }

    // Melhor dupla sugestão
    let melhorDupla = null;
    for (let i = 0; i < sugestoesSimplesFiltradas.length; i++) {
        for (let j = i + 1; j < sugestoesSimplesFiltradas.length; j++) {
            const s1 = sugestoesSimplesFiltradas[i];
            const s2 = sugestoesSimplesFiltradas[j];
            const oddCombinada = s1.odd * s2.odd;
            if (oddCombinada < 1.6) continue;
            const mediaProb = (s1.probabilidade + s2.probabilidade) / 2;
            if (!melhorDupla || mediaProb > melhorDupla.mediaProb) {
                melhorDupla = { nome: `${s1.nome} + ${s2.nome}`, oddCombinada, mediaProb, valorAposta: banca * 0.05 };
            }
        }
    }

    for (let d = 0; d < sugestoesDuplaHipotese.length; d++) {
        for (let s = 0; s < sugestoesSimplesFiltradas.length; s++) {
            const dupla = sugestoesDuplaHipotese[d];
            const simples = sugestoesSimplesFiltradas[s];
            const oddCombinada = dupla.odd * simples.odd;
            if (oddCombinada < 1.6) continue;
            const mediaProb = (dupla.probabilidade + simples.probabilidade) / 2;
            if (!melhorDupla || mediaProb > melhorDupla.mediaProb) {
                melhorDupla = { nome: `${dupla.nome} + ${simples.nome}`, oddCombinada, mediaProb, valorAposta: banca * 0.05 };
            }
        }
    }

    if (melhorDupla) {
        resultado.innerHTML = `
            <div class="sugestao dupla" style="margin-top:10px; padding:8px; border:2px solid #007700; border-radius:6px;">
                <strong>Sugestão Dupla:</strong><br>
                ${melhorDupla.nome}<br>
                Odd Combinada: ${melhorDupla.oddCombinada.toFixed(2)} | Prob. Média: ${melhorDupla.mediaProb.toFixed(1)}%<br>
                <span class="valor-aposta" style="color:#004400;">Sugestão: Apostar R$ ${melhorDupla.valorAposta.toFixed(2)}</span>
            </div>
        `;
    }

    const nomesDaDupla = melhorDupla ? melhorDupla.nome.split(' + ').map(n => n.trim()) : [];
    const sugestoesFortes = sugestoesSimplesFiltradas.filter(s =>
        s.probabilidade >= 65 && s.tipo === "Alta" && s.odd >= 1.5 && s.odd <= 2.2 && !nomesDaDupla.includes(s.nome)
    );

    sugestoesFortes.sort((a, b) => b.probabilidade - a.probabilidade);
    if (sugestoesFortes.length > 0) {
        const melhor = sugestoesFortes[0];
        sugestaoForteDiv.innerHTML = `
            <div style="margin-top:10px; padding:8px; border:2px solid #cc0000; border-radius:6px;">
                <strong>🎯 Sugestão Forte:</strong><br>
                ${melhor.nome}<br>
                Odd: ${melhor.odd.toFixed(2)} | Probabilidade: ${melhor.probabilidade.toFixed(1)}%<br>
                <span style="color:#aa0000;">Sugestão: Apostar R$ ${(banca * 0.1).toFixed(2)}</span>
            </div>
        `;
    }

    exibirDebug(`Foram geradas ${sugestoesSimplesFiltradas.length} sugestões simples e ${sugestoesDuplaHipotese.length} sugestões dupla hipótese.`);
}

// --- Função de debug ---
function exibirDebug(texto) {
    const debugBox = document.getElementById("debug");
    debugBox.textContent = texto;
}


// Apenas inicializa debug escondido
document.getElementById("debug").style.display = "none";



















