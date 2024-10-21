let myChart;

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

    // Mostra o spinner
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

    const apiUrl = `/api/run-experiments?func_str=${encodeURIComponent(funcStr)}&num_experiments=${numExperiments}`;

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
        const numGenerationsValue = requestBody.num_generations;

        renderChart(meanBestIndividuals, numGenerationsValue);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Esconde o spinner
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
