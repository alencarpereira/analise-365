function gerarSugestoes() {
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

    // Avaliação odds 1X2 (mercado excluído se existir dupla hipótese na aposta)
    avaliarOdd("Vitória Time A", parseFloat(document.getElementById('oddVitoriaA').value), false, true);
    avaliarOdd("Empate", parseFloat(document.getElementById('oddEmpate').value), false, true);
    avaliarOdd("Empate Anula A", parseFloat(document.getElementById('oddEmpateAnulaA').value), false, true); // Corrigido aqui
    avaliarOdd("Empate Anula B", parseFloat(document.getElementById('oddEmpateAnulaB').value), false, true); // Corrigido aqui
    avaliarOdd("Vitória Time B", parseFloat(document.getElementById('oddVitoriaB').value), false, true);

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

    // Se existir alguma dupla hipótese válida, vamos remover as odds 1X2 das sugestões simples
    const temDuplaHipotese = sugestoesDuplaHipotese.length > 0;

    // Filtrar simples para remover 1X2 se tiver dupla hipótese
    let sugestoesSimplesFiltradas = sugestoesSimples;
    if (temDuplaHipotese) {
        sugestoesSimplesFiltradas = sugestoesSimples.filter(s => !s.is1X2);
    } else {
        // Se não tiver dupla hipótese, mantemos as simples normais
        sugestoesSimplesFiltradas = sugestoesSimples;
    }

    // Ordenar odds simples filtradas por probabilidade decrescente
    sugestoesSimplesFiltradas.sort((a, b) => b.probabilidade - a.probabilidade);

    let html = '';

    // Exibir sugestões simples filtradas (sem dupla hipótese e 1X2 exclusivas)
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

    // Construir sugestão dupla: combinar uma odd dupla hipótese + uma odd simples OU duas odds simples
    let melhorDupla = null;

    // Combinações entre simples + simples (filtradas)
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

    // Combinações entre dupla hipótese + simples (apenas UMA dupla hipótese na aposta)
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

function limparCampos() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => input.value = '');
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('valorBanca').value = '';
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
















