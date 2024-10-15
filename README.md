# Genetic Algorithm Experiments

Projeto de experimentos de Algoritmo Genético desenvolvido com HTML, CSS e JavaScript. A aplicação permite aos usuários configurar vários parâmetros de um algoritmo genético e visualizar os resultados em um gráfico.

## Estrutura do Projeto

O projeto está organizado da seguinte maneira:

```
├── index.html
├── style.css
└── script.js
```

### Arquivos

* **index.html** : Contém a estrutura principal da aplicação, incluindo o formulário de entrada de dados, teclado virtual e o container do gráfico.
* **style.css** : Contém o estilo CSS para a aplicação, definindo a aparência e o layout dos elementos.
* **script.js** : Contém a lógica JavaScript para manipular a interação do usuário, enviar os dados do formulário para o backend e renderizar o gráfico.

## Funcionalidades

* **Teclado Matemático Virtual** : Permite ao usuário inserir funções matemáticas de maneira interativa.
* **Formulário de Parâmetros** : Permite ao usuário configurar parâmetros do algoritmo genético, como número de gerações, tamanho da população, taxa de crossover e mutação, entre outros.
* **Gráfico de Resultados** : Exibe os resultados dos experimentos em um gráfico de linha.




### Configuração Docker

$ Docker Execute no terminal:

    Caso não tenha somente o frontend execute:

    ```
    bash start.sh
    ```

Ou

Caso ja tenha os 2 projetos em paralelo
    ```
    docker compose up --build
    ```

Necessário ter o clone da API E Front em diretórios irmãos
```
├──gademo-front/
└──GAdemo-api/
```


### Configuração Tradicional


### Pré-requisitos

Para rodar a aplicação localmente, você precisa ter instalado:

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)

### Instalação

1. Clone o repositório:

```
git clone [HTTPS]
```

2. Navegue até o diretório do projeto:

```
cd genetic-algorithm-experiments/src
```

3. Instale as dependências:

```
npm install
```

4. Inicie o servidor:

```
npm start
```


5. Abra o navegador e acesse:

```
http://localhost/
```

## Uso

### Inserção de Função

* Você pode optar por utilizar o teclado virtual ou não para inserir a função que deseja usar no experimento.

### Configuração dos Parâmetros

* Preencha os campos no formulário do menu lateral para configurar os parâmetros do algoritmo genético. Você pode definir o número de gerações, tamanho da população, taxas de crossover e mutação, tipo de crossover, intervalo de valores, entre outros.

### Executar o Experimento

* Clique no botão "Run" para executar o experimento. Os resultados serão exibidos no gráfico abaixo do teclado matemático.
