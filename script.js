function gerarSugestoes() {
    const timeA = {
        golsMarcadosMed: parseFloat(document.getElementById('mediaGolsMarcadosTimeA').value) || 0,
        golsSofridosMed: parseFloat(document.getElementById('mediaGolsSofridosTimeA').value) || 0,
    };

    const timeB = {
        golsMarcadosMed: parseFloat(document.getElementById('mediaGolsMarcadosTimeB').value) || 0,
        golsSofridosMed: parseFloat(document.getElementById('mediaGolsSofridosTimeB').value) || 0,
    };

    const banca = parseFloat(document.getElementById('valorBanca').value);
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';

    if (isNaN(banca) || banca <= 0) {
        resultado.innerHTML = '<p style="color:red;">Por favor, informe uma banca válida.</p>';
        return;
    }

    const sugestoesSimples = [];
    const sugestoesDuplaHipotese = [];

    function avaliarOdd(nome, odd, isDuplaHipotese = false, is1X2 = false) {
        if (!isNaN(odd) && odd >= 1) {
            const probabilidade = 100 / odd;
            const tipo = probabilidade >= 70 ? 'Alta' : 'Baixa';
            const percentual = probabilidade >= 70 ? 0.05 : 0.02;
            const valorAposta = banca * percentual;

            const obj = {
                nome,
                odd,
                probabilidade,
                tipo,
                valorAposta,
                isDuplaHipotese,
                is1X2
            };

            if (isDuplaHipotese) {
                sugestoesDuplaHipotese.push(obj);
            } else {
                sugestoesSimples.push(obj);
            }
        }
    }

    // Avaliação das odds 1X2
    avaliarOdd("Vitória Time A", parseFloat(document.getElementById('oddVitoriaA').value), false, true);
    avaliarOdd("Empate", parseFloat(document.getElementById('oddEmpate').value), false, true);
    avaliarOdd("Empate Anula A", parseFloat(document.getElementById('oddEmpateAnulaA').value), false, true);
    avaliarOdd("Empate Anula B", parseFloat(document.getElementById('oddEmpateAnulaB').value), false, true);
    avaliarOdd("Vitória Time B", parseFloat(document.getElementById('oddVitoriaB').value), false, true);

    // Outras odds
    avaliarOdd("Over 1.5 Gols", parseFloat(document.getElementById('oddOver15').value));
    avaliarOdd("Under 2.5 Gols", parseFloat(document.getElementById('oddUnder25').value));
    avaliarOdd("Ambos Marcam - Sim", parseFloat(document.getElementById('oddAmbosSim').value));
    avaliarOdd("Ambos Marcam - Não", parseFloat(document.getElementById('oddAmbosNao').value));
    avaliarOdd("Escanteios Mais de", parseFloat(document.getElementById('oddEscanteiosMais').value));
    avaliarOdd("Escanteios Exatamente", parseFloat(document.getElementById('oddEscanteiosExato').value));
    avaliarOdd("Escanteios Menos de", parseFloat(document.getElementById('oddEscanteiosMenos').value));
    avaliarOdd("Cartões Ambos - Sim", parseFloat(document.getElementById('oddCartoesSim').value));
    avaliarOdd("Cartões Ambos - Não", parseFloat(document.getElementById('oddCartoesNao').value));

    // Odds dupla hipótese (só para sugestão dupla)
    avaliarOdd("Dupla Hipótese: Time A ou Empate", parseFloat(document.getElementById('oddDuplaAEmpate').value), true);
    avaliarOdd("Dupla Hipótese: Empate ou Time B", parseFloat(document.getElementById('oddDuplaEmpateB').value), true);
    avaliarOdd("Dupla Hipótese: Time A ou Time B", parseFloat(document.getElementById('oddDuplaAB').value), true);

    function ajustarSugestoesPorMedias() {
        if (timeA.golsMarcadosMed > 1 && timeB.golsMarcadosMed > 1) {
            const idx = sugestoesSimples.findIndex(s => s.nome === "Ambos Marcam - Não");
            if (idx !== -1) sugestoesSimples.splice(idx, 1);
        }

        const soma = timeA.golsMarcadosMed + timeA.golsSofridosMed + timeB.golsMarcadosMed + timeB.golsSofridosMed;
        if (soma > 3.5) {
            const idx = sugestoesSimples.findIndex(s => s.nome === "Under 2.5 Gols");
            if (idx !== -1) sugestoesSimples.splice(idx, 1);
        }
    }

    ajustarSugestoesPorMedias();

    const temDuplaHipotese = sugestoesDuplaHipotese.length > 0;
    let sugestoesSimplesFiltradas = sugestoesSimples;
    if (temDuplaHipotese) {
        sugestoesSimplesFiltradas = sugestoesSimples.filter(s => !s.is1X2);
    }

    sugestoesSimplesFiltradas.sort((a, b) => b.probabilidade - a.probabilidade);

    let html = '';

    sugestoesSimplesFiltradas.forEach(s => {
        html += `
            <div class="sugestao ${s.tipo === 'Alta' ? 'alta' : 'baixa'}">
                <strong>${s.nome}</strong><br>
                Odd: ${s.odd} | Prob: ${s.probabilidade.toFixed(1)}%<br>
                Tipo: ${s.tipo} confiança<br>
                <span class="valor-aposta">Sugestão: Apostar R$ ${s.valorAposta.toFixed(2)}</span>
            </div>
        `;
    });

    let melhorDupla = null;

    for (let i = 0; i < sugestoesSimplesFiltradas.length; i++) {
        for (let j = i + 1; j < sugestoesSimplesFiltradas.length; j++) {
            const s1 = sugestoesSimplesFiltradas[i];
            const s2 = sugestoesSimplesFiltradas[j];
            const oddCombinada = s1.odd * s2.odd;
            if (oddCombinada < 1.6) continue;
            const mediaProb = (s1.probabilidade + s2.probabilidade) / 2;
            if (!melhorDupla || mediaProb > melhorDupla.mediaProb) {
                melhorDupla = {
                    nome: `${s1.nome} + ${s2.nome}`,
                    oddCombinada,
                    mediaProb,
                    valorAposta: banca * 0.05
                };
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
                melhorDupla = {
                    nome: `${dupla.nome} + ${simples.nome}`,
                    oddCombinada,
                    mediaProb,
                    valorAposta: banca * 0.05
                };
            }
        }
    }

    if (melhorDupla) {
        html += `
            <div class="sugestao dupla">
                <strong>Sugestão Dupla:</strong><br>
                ${melhorDupla.nome}<br>
                Odd Combinada: ${melhorDupla.oddCombinada.toFixed(2)} | Prob. Média: ${melhorDupla.mediaProb.toFixed(1)}%<br>
                <span class="valor-aposta">Sugestão: Apostar R$ ${melhorDupla.valorAposta.toFixed(2)}</span>
            </div>
        `;
    }

    resultado.innerHTML = html;
}

function calcularMediaGolsPelaOdd(oddMais25) {
    if (!oddMais25 || isNaN(oddMais25) || oddMais25 <= 1) {
        return 0;
    }
    const probabilidade = 1 / oddMais25;
    const mediaGolsEstimativa = probabilidade * 2.8;
    return mediaGolsEstimativa.toFixed(2);
}

function carregarMediasTimes(medias) {
    console.log('Médias carregadas:', medias);
    document.getElementById('mediaGolsMarcadosTimeA').value = medias.golsMarcadosTimeA;
    document.getElementById('mediaGolsSofridosTimeA').value = medias.golsSofridosTimeA;
    document.getElementById('mediaGolsMarcadosTimeB').value = medias.golsMarcadosTimeB;
    document.getElementById('mediaGolsSofridosTimeB').value = medias.golsSofridosTimeB;

    document.getElementById('exibeGolsMarcadosA').textContent = medias.golsMarcadosTimeA.toFixed(1);
    document.getElementById('exibeGolsSofridosA').textContent = medias.golsSofridosTimeA.toFixed(1);
    document.getElementById('exibeGolsMarcadosB').textContent = medias.golsMarcadosTimeB.toFixed(1);
    document.getElementById('exibeGolsSofridosB').textContent = medias.golsSofridosTimeB.toFixed(1);
}

function limparCampos() {
    // Limpa todos os inputs tipo number
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => input.value = '');

    // Limpa resultados e gráficos
    document.getElementById('resultado').innerHTML = '';
    if (document.getElementById('chartContainer')) {
        document.getElementById('chartContainer').style.display = 'none';
    }

    // Limpa médias dos times exibidas
    document.getElementById('exibeGolsMarcadosA').textContent = '-';
    document.getElementById('exibeGolsSofridosA').textContent = '-';
    document.getElementById('exibeGolsMarcadosB').textContent = '-';
    document.getElementById('exibeGolsSofridosB').textContent = '-';

    // Zera os campos ocultos (caso esteja usando)
    document.getElementById('mediaGolsMarcadosTimeA').value = '';
    document.getElementById('mediaGolsSofridosTimeA').value = '';
    document.getElementById('mediaGolsMarcadosTimeB').value = '';
    document.getElementById('mediaGolsSofridosTimeB').value = '';

    // Destroi gráfico se existir
    if (window.myChart) {
        window.myChart.destroy();
    }
}



function onJogoChange() {
    const seletor = document.getElementById('seletorJogo');
    const valor = seletor.value;
    console.log('Jogo selecionado:', valor);
    const jogos = {
        jogo1: {
            golsMarcadosTimeA: 1.8,
            golsSofridosTimeA: 1.2,
            golsMarcadosTimeB: 1.5,
            golsSofridosTimeB: 1.4
        },
        jogo2: {
            golsMarcadosTimeA: 2.1,
            golsSofridosTimeA: 0.9,
            golsMarcadosTimeB: 1.0,
            golsSofridosTimeB: 1.6
        }
    };

    if (valor && jogos[valor]) {
        carregarMediasTimes(jogos[valor]);
        console.log('Médias carregadas:', jogos[valor]);
    }
}

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
        oddEscanteiosMais: 1.80,
        oddEscanteiosExato: 3.00,
        oddEscanteiosMenos: 2.50,
        oddCartoesSim: 2.10,
        oddCartoesNao: 1.70,
        oddDuplaAEmpate: 1.25,
        oddDuplaEmpateB: 1.30,
        oddDuplaAB: 1.50
    };

    for (const id in valores) {
        const input = document.getElementById(id);
        if (input) {
            input.value = valores[id];
        }
    }
}

function atualizarMediasPorOdds() {
    const oddMais25 = parseFloat(document.getElementById('oddOver15').value);
    const mediaEstimativa = parseFloat(calcularMediaGolsPelaOdd(oddMais25));

    const mediaTimeA = (mediaEstimativa / 2).toFixed(2);
    const mediaTimeB = (mediaEstimativa / 2).toFixed(2);

    const medias = {
        golsMarcadosTimeA: parseFloat(mediaTimeA),
        golsSofridosTimeA: parseFloat(mediaTimeB),
        golsMarcadosTimeB: parseFloat(mediaTimeB),
        golsSofridosTimeB: parseFloat(mediaTimeA)
    };

    carregarMediasTimes(medias);
}


console.log('Script carregado');

















