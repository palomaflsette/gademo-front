let myChart, boxPlotChart;
let previousResults = [];  // Armazena os resultados anteriores
let currentRunIndex = 0;   // Índice para a rodada atual

function toggleAside() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar.classList.contains('aside-visible')) {
        // Fechar sidebar
        sidebar.classList.remove('aside-visible');
        overlay.style.display = 'none';
    } else {
        // Abrir sidebar
        sidebar.classList.add('aside-visible');
        overlay.style.display = 'block';
    }
}

// Fechar a sidebar ao clicar no overlay
document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('sidebar').classList.remove('aside-visible');
    this.style.display = 'none'; // Esconde o overlay
});

document.getElementById('steady_state_without_duplicates').addEventListener('change', function () {
    const gapInput = document.getElementById('gap');
    if (this.checked) {
        gapInput.disabled = false;  // Habilita o campo "Gap"
    } else {
        gapInput.disabled = true;  // Desabilita o campo "Gap"
        gapInput.value = '';  // Limpa o valor
    }
});

document.getElementById('normalize_linear').addEventListener('change', function () {
    const minInput = document.getElementById('normalize_min');
    const maxInput = document.getElementById('normalize_max');
    if (this.checked) {
        minInput.disabled = false;  // Habilita o campo "Min"
        maxInput.disabled = false;  // Habilita o campo "Max"
    } else {
        minInput.disabled = true;  // Desabilita o campo "Min"
        maxInput.disabled = true;  // Desabilita o campo "Max"
        minInput.value = '';  // Limpa o valor
        maxInput.value = '';  // Limpa o valor
    }
});

// Adicionando as funções showSpinner e hideSpinner
function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

// Função para armazenar novos resultados
function storeResults(runData) {
    const keepChart = document.getElementById('keep_chart').checked;

    // Se "Keep Graph" NÃO estiver marcado, reinicia os resultados
    if (!keepChart) {
        previousResults = [];  // Limpa os resultados anteriores
        currentRunIndex = 0;   // Reinicia o índice
    }

    previousResults.push(runData);
    currentRunIndex = previousResults.length - 1;
    updateTableNavigationButtons();
    updateTableTitle(); // Atualiza o título com a rodada correta
    updateUsedParametersDescription(runData.params, runData.numOfExperiments, runData.objective); // Atualiza os parâmetros
    updateExecutionStats(runData); // Passa o numExp e o runData
}


// Função para atualizar o estado dos botões de navegação
function updateTableNavigationButtons() {
    document.getElementById('prev-run').disabled = currentRunIndex === 0;
    document.getElementById('next-run').disabled = currentRunIndex === previousResults.length - 1;
}

// Função para atualizar o título com o número da rodada atual
function updateTableTitle() {
    const titleElement = document.getElementById('table-title');
    const executionStats = document.getElementById("status-tittle")
    executionStats.innerText = `Execution (Run ${currentRunIndex + 1})`;
    titleElement.innerText = `Best Fitness Per Generation & Experiments (Run ${currentRunIndex + 1})`; // +1 para exibir como 1-based
}

// Listeners para os botões de navegação
document.getElementById('prev-run').addEventListener('click', function() {
    if (currentRunIndex > 0) {
        currentRunIndex--;  // Decrementa o índice da rodada atual
        renderBestValuesTableForCurrentRun();  // Renderiza a tabela para a rodada atual
        updateTableNavigationButtons();  // Atualiza os botões para habilitar/desabilitar
        updateTableTitle();  // Atualiza o título com o número da rodada
        updateUsedParametersDescription(previousResults[currentRunIndex].params, previousResults[currentRunIndex].numOfExperiments, previousResults[currentRunIndex].objective); // Atualiza os parâmetros
        updateExecutionStats(previousResults[currentRunIndex]); // Passa o numExp e runData
    }
});

document.getElementById('next-run').addEventListener('click', function() {
    if (currentRunIndex < previousResults.length - 1) {
        currentRunIndex++;  // Incrementa o índice da rodada atual
        renderBestValuesTableForCurrentRun();  // Renderiza a tabela para a rodada atual
        updateTableNavigationButtons();  // Atualiza os botões para habilitar/desabilitar
        updateTableTitle();  // Atualiza o título com o número da rodada
        updateUsedParametersDescription(previousResults[currentRunIndex].params, previousResults[currentRunIndex].numOfExperiments, previousResults[currentRunIndex].objective); // Atualiza os parâmetros
        updateExecutionStats(previousResults[currentRunIndex]); // Passa o numExp e runData
    }
});


// Função para renderizar a tabela para a rodada atual
function renderBestValuesTableForCurrentRun() {
    const runData = previousResults[currentRunIndex];
    renderBestValuesTable(runData.bestValuesPerGeneration, runData.meanBestIndividualsPerGeneration);
    updateTableTitle(); // Atualiza o título com o número da rodadaupdateExecutionStatus();
    updateUsedParametersDescription(runData.params, runData.numOfExperiments, runData.objective); // Atualiza os parâmetros
    updateExecutionStats(runData);
}

function updateUsedParametersDescription(params, numOfExp, objective) {
    const textElement = document.getElementById("used-parameters");
    textElement.innerHTML = `
        <table id="used-parameters-table">
            <tr><td>Number of Experiments:</td><td>${numOfExp || 'N/A'}</td></tr>
            <tr><td>Number of Generations:</td><td>${params.num_generations || 'N/A'}</td></tr>
            <tr><td>Population Size:</td><td>${params.population_size || 'N/A'}</td></tr>
            <tr><td>Crossover Rate:</td><td>${params.crossover_rate + "%"|| 'N/A'}</td></tr>
            <tr><td>Mutation Rate:</td><td>${params.mutation_rate + "%"|| 'N/A'}</td></tr>
            <tr><td>Intent:</td><td>${objective || 'N/A'}</td></tr>
            <tr><td>Interval:</td><td>${params.interval ? '['+params.interval[0]+','+params.interval[1]+']' : 'N/A'}</td></tr>
            <tr><td>Crossover Type:</td><td>${params.crossover_type ? (params.crossover_type.one_point ? 'One Point' : params.crossover_type.two_point ? 'Two Point' : 'Uniform') : 'N/A'}</td></tr>
            <tr><td>Normalize Linear:</td><td>${params.normalize_linear ? '['+params.normalize_min+','+params.normalize_max+']' : 'No'}</td></tr>
            <tr><td>Elitism:</td><td>${params.elitism ? 'Yes' : 'No'}</td></tr>
            <tr><td>Steady State:</td><td>${params.steady_state ? 'Yes' : 'No'}</td></tr>
            <tr><td>Steady State Without Duplicates:</td><td>${params.steady_state_without_duplicates ? 'Yes' : 'No'}</td></tr>
            <tr><td>Gap:</td><td>${params.gap ? params.gap+'%' : 'No'}</td></tr>
        </table>
    `;
}



// Função de escuta para o envio do formulário
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
    const gap = document.getElementById('gap').value;
    
    const steadyStateWithoutDuplicateds = document.getElementById('steady_state_without_duplicates').checked;

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
        normalize_min: parseFloat(normalizeMin) || 0,
        normalize_max: parseFloat(normalizeMax) || 100,
        elitism: document.getElementById('elitism').checked,
        steady_state: document.getElementById('steady_state').checked,
        steady_state_without_duplicateds: steadyStateWithoutDuplicateds,
        gap: parseFloat(gap) || 0
    };

    try {
        const response = await fetch(`/api/run-experiments?func_str=${encodeURIComponent(funcStr)}&num_experiments=${numExperiments}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const meanBestIndividuals = data.mean_best_individuals_per_generation;
        const bestValuesPerGeneration = data.best_values_per_generation;
        const bestIndividualsPerGeneration = data.best_individuals_per_generation;
        let objective = "none";

        renderChart(meanBestIndividuals, requestBody.num_generations);
        renderBoxPlot(bestValuesPerGeneration, requestBody.num_generations);  // Adiciona o gráfico de box-plot também

        if (requestBody.maximize) {
            objective = "Maximize"
        } else { objective = "Minimize"}

        storeResults({
            bestValuesPerGeneration: bestValuesPerGeneration,
            meanBestIndividualsPerGeneration: meanBestIndividuals,
            bestIndividualsPerGeneration: bestIndividualsPerGeneration,
            params: requestBody,
            numOfExperiments: numExperiments,
            objective: objective
        });
        renderBestValuesTableForCurrentRun();

    } catch (error) {
        console.error('Error:', error);
    } finally {
        hideSpinner();
    }
});

// Função para renderizar o gráfico de linha
function renderChart(data, numGenerations) {
    const labels = Array.from({ length: numGenerations }, (_, i) => i + 1);

    const keepChart = document.getElementById('keep_chart').checked;

    document.getElementById('download-chart').addEventListener('click', function() {
        const link = document.createElement('a');
        link.href = myChart.toBase64Image();
        link.download = 'chart_image.png';
        link.click();
    });

    if (!keepChart && myChart) {
        myChart.destroy();
    }

    if (keepChart && myChart) {
        const newDataset = {
            label: `Run ${myChart.data.datasets.length + 1}`,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: getRandomColor(),
            borderWidth: 2,
            fill: false
        };
        myChart.data.datasets.push(newDataset);
        myChart.update();
    } else {
        const ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Run 1',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: '#67A5C8',
                    borderWidth: 3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Mean Best Fitness per Generation',
                        font: {
                            size: 18,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 30
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Generation'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Function Value'
                        }
                    }
                }
            }
        });
    }
}

function renderBoxPlot(bestValuesPerGeneration, numGenerations) {
    const labels = Array.from({ length: numGenerations }, (_, i) => `Gen ${i + 1}`);

    const ctx = document.getElementById("box-plot-chart").getContext("2d");

    var randomColor = Math.floor(Math.random()*16777215).toString(16);


    // Reorganizar os dados para que cada geração tenha um array com os valores de todos os experimentos
    const boxplotData = bestValuesPerGeneration[0].map((_, genIndex) => {
        return bestValuesPerGeneration.map(experiment => experiment[genIndex]);
    });

    // Dados formatados para o gráfico de box plot
    const data = {
        labels: labels,
        datasets: [{
            label: 'Best Fitness per Generation (Box Plot)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            outlierColor: '#494848',
            padding: 10,
            itemRadius: 0,
            data: boxplotData  // Dados organizados por geração, agregando todos os experimentos
        }]
    };

    if (boxPlotChart) {
        boxPlotChart.destroy();  // Destroi o gráfico anterior, se houver
    }

    boxPlotChart = new Chart(ctx, {
        type: 'boxplot',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Box Plot of Best Fitness per Generation for All Experiments',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Generation'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Best Individual Value'
                    }
                }
            }
        }
    });
}



function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Função para atualizar o contêiner de execuções
function updateExecutionStats(runData) {
    const textElement = document.getElementById("execution-status");
    textElement.innerHTML = ''; // Limpa o conteúdo anterior

    const bestValuesPerGeneration = runData.bestValuesPerGeneration;
    const bestIndividualsPerGeneration = runData.bestIndividualsPerGeneration;

    // Itera pelos experimentos e exibe as informações no contêiner
    for (let exp = 0; exp < bestValuesPerGeneration.length; exp++) {
        const bestSolution = bestValuesPerGeneration[exp][bestValuesPerGeneration[exp].length - 1];
        const bestIndividuals = bestIndividualsPerGeneration[exp];

        // Formatação da string para exibir as gerações
        let individualsHTML = '<div class="generation-values">'; // Classe adicionada aqui
        for (let genIndex = 0; genIndex < bestIndividuals.length; genIndex++) {
            individualsHTML += `${genIndex + 1} gen: [${bestIndividuals[genIndex].map(num => num.toFixed(4)).join(', ')}]<br>`;
        }
        individualsHTML += '</div>';

        // Adiciona o conteúdo ao HTML do contêiner 'execution-status'
        textElement.innerHTML += `
            <div class="result-container" > <!-- Adiciona uma div para agrupar tudo -->
                <h4 style="text-align: center; font-size: 16px">Experiment ${exp + 1}</h4>
                <p>• Best found solution: ${bestSolution.toFixed(4)}</p>
                <p>• Best individuals:</p>
                ${individualsHTML}
            </div>
            <hr>
        `;
    }
}




function renderBestValuesTable(bestValuesPerGeneration, meanBestIndividualsPerGeneration) {
    const table = document.getElementById('best-values-table');
    table.innerHTML = ''; // Limpa a tabela anterior

    const numExperiments = bestValuesPerGeneration.length;
    const numGenerations = bestValuesPerGeneration[0].length;

    let headerRow = `
        <tr>
            <th rowspan="2">Generations</th>
            <th colspan="${numExperiments}">Experiments</th>
            <th rowspan="2">Average</th>
        </tr>
        <tr>`;

    for (let i = 1; i <= numExperiments; i++) {
        headerRow += `<th>${i}º</th>`;
    }
    headerRow += '</tr>';

    table.innerHTML += headerRow;

    for (let i = 0; i < numGenerations; i++) {
        let row = `<tr><td>gen ${i + 1}</td>`;
        for (let j = 0; j < numExperiments; j++) {
            row += `<td>${bestValuesPerGeneration[j][i].toFixed(4)}</td>`;
        }
        row += `<td><strong>${meanBestIndividualsPerGeneration[i].toFixed(4)}</strong></td></tr>`;
        table.innerHTML += row;
    }
}
