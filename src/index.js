let myChart, boxPlotChart;

function toggleAside() {
    const aside = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');
    
    if (aside.classList.contains('aside-visible')) {
        aside.classList.remove('aside-visible');
        header.style.marginLeft = '0';
        main.style.marginLeft = '0';
        footer.style.marginLeft = '0';
    } else {
        aside.classList.add('aside-visible');
        header.style.marginLeft = '250px';
        main.style.marginLeft = '250px';
        footer.style.marginLeft = '250px';
    }
}

function insertSymbol(symbol) {
    const input = document.getElementById('func_str');
    input.value += symbol;
}

function clearInput() {
    const input = document.getElementById('func_str');
    input.value = '';
}

function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

document.getElementById('normalize_linear').addEventListener('change', function () {
    const normalizeMin = document.getElementById('normalize_min');
    const normalizeMax = document.getElementById('normalize_max');
    normalizeMin.disabled = !this.checked;
    normalizeMax.disabled = !this.checked;
});

document.getElementById('steady_state_without_duplicates').addEventListener('change', function () {
    const gap = document.getElementById('gap');
    gap.disabled = !this.checked;
});

document.getElementById('experimentForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    showSpinner();

    const funcStr = document.getElementById('func_str').value;
    const numExperiments = document.getElementById('num_experiments').value;
    const numGenerations = document.getElementById('num_generations').value;
    const populationSize = document.getElementById('population_size').value;
    const crossoverRate = document.getElementById('crossover_rate').value;
    const mutationRate = document.getElementById('mutation_rate').value;
    const maximize = document.querySelector('input[name="objective"]:checked').value === 'true';
    const intervalMin = document.getElementById('interval_min').value;
    const intervalMax = document.getElementById('interval_max').value;
    const crossoverType = document.querySelector('input[name="crossover_type"]:checked').value;
    const normalizeLinear = document.getElementById('normalize_linear').checked;
    const normalizeMin = document.getElementById('normalize_min').value;
    const normalizeMax = document.getElementById('normalize_max').value;
    const elitism = document.getElementById('elitism').checked;
    const steadyState = document.getElementById('steady_state').checked;
    const steadyStateWithoutDuplicates = document.getElementById('steady_state_without_duplicates').checked;
    const gap = document.getElementById('gap').value;

    const requestBody = {
        num_generations: parseInt(numGenerations),
        population_size: parseInt(populationSize),
        crossover_rate: parseFloat(crossoverRate),
        mutation_rate: parseFloat(mutationRate),
        maximize: maximize,
        interval: [parseFloat(intervalMin), parseFloat(intervalMax)],
        crossover_type: {
            one_point: crossoverType === 'one_point',
            two_point: crossoverType === 'two_point',
            uniform: crossoverType === 'uniform'
        },
        normalize_linear: normalizeLinear,
        normalize_min: parseFloat(normalizeMin),
        normalize_max: parseFloat(normalizeMax),
        elitism: elitism,
        steady_state: steadyState,
        steady_state_without_duplicates: steadyStateWithoutDuplicates,
        gap: parseInt(gap)
    };

    const apiUrl = `http://127.0.0.1:8000/run-experiments?func_str=${encodeURIComponent(funcStr)}&num_experiments=${numExperiments}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const meanBestIndividuals = data.mean_best_individuals_per_generation;
        const bestValuesPerGeneration = data.best_values_per_generation;

        renderChart(meanBestIndividuals, requestBody.num_generations);
        renderBestValuesTable(bestValuesPerGeneration, meanBestIndividuals, requestBody.num_experiments, requestBody.num_generations);

        // Chamando a função para renderizar o box plot com Plotly
        renderBoxPlot(meanBestIndividuals);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        hideSpinner();
    }
});

function renderChart(data, numGenerations) {
    const labels = Array.from({ length: numGenerations }, (_, i) => i + 1);

    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mean Best Fitness per Generation',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: '#67A5C8',
                borderWidth: 3,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Geração'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Avaliação'
                    }
                }
            }
        }
    });
}

function renderBestValuesTable(bestValuesPerGeneration, meanBestIndividualsPerGeneration) {
    const table = document.getElementById('best-values-table');
    table.innerHTML = ''; // Limpa a tabela anterior

    const numExperiments = bestValuesPerGeneration.length;
    const numGenerations = bestValuesPerGeneration[0].length;

    let headerRow = '<tr><th>Gerações</th>';
    for (let i = 1; i <= numExperiments; i++) {
        headerRow += `<th>${i}º</th>`;
    }
    headerRow += '<th>Média</th></tr>';
    table.innerHTML += headerRow;

    for (let i = 0; i < numGenerations; i++) {
        let row = `<tr><td>ger ${i + 1}</td>`;
        for (let j = 0; j < numExperiments; j++) {
            row += `<td>${bestValuesPerGeneration[j][i].toFixed(4)}</td>`;
        }
        row += `<td><strong>${meanBestIndividualsPerGeneration[i].toFixed(4)}</strong></td></tr>`;
        table.innerHTML += row;
    }
}

// Função para renderizar o box-plot abaixo do gráfico principal
function renderBoxPlot(data) {
    var trace = {
        y: data,
        type: 'box',
        // name: 'Fitness',
        boxpoints: 'all',  // Mostra todos os pontos no gráfico
        jitter: 0.3,  // Deslocamento dos pontos para evitar sobreposição
        pointpos: -1.8,  // Posição dos pontos à esquerda do boxplot
        marker: {
            color: 'blue',  // Cor dos pontos
            size: 6  // Tamanho dos pontos
        },
        line: {
            width: 2  // Largura da linha do boxplot
        },
        boxmean: true  // Adiciona uma linha indicando a média
    };

    var layout = {
        title: 'Box Plot for Fitness',
        yaxis: {
            title: 'Fitness Values',
            zeroline: true,
            gridcolor: 'light grey',  // Cor da grade do eixo Y
        },
        xaxis: {
            title: 'Fitness',
            zeroline: false,  // Remove a linha zero do eixo X
        },
        margin: {
            l: 50,  // Ajuste da margem esquerda
            r: 30,  // Ajuste da margem direita
            b: 50,  // Ajuste da margem inferior
            t: 50   // Ajuste da margem superior
        },
        paper_bgcolor: 'white',  // Cor de fundo do papel
        plot_bgcolor: 'white',  // Cor de fundo do gráfico
        showlegend: false  // Remove a legenda
    };

    Plotly.newPlot('box-plot-chart', [trace], layout);
}