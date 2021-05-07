const mqtt = require('mqtt');
const cliente = mqtt.connect('mqtt://localhost:1883');
let arrayA = [];
let arrayB = [];
let operacaoA, operacaoB;
let resultados = [];

cliente.on('connect', function () {
    cliente.subscribe('vetorA');
    cliente.publish('novaOperacao', 'Inicio');
    cliente.subscribe('operacaoA');

    // Seta um timeOut para esperar o script fazer os cálculos e retorna o array para o servidor
    setTimeout(function(){ 
       cliente.publish('soma', resultA); 
    }, 3000);
})

cliente.on('connect', function () {
    cliente.subscribe('vetorB');
    cliente.publish('novaOperacao', 'Inicio');
    cliente.subscribe('operacaoB');   

    // Seta um timeOut para esperar o script fazer os cálculos e retorna o array para o servidor
    setTimeout(function(){ 
        cliente.publish('diferenca', resultB); 
    }, 3000); 
});


// Função assíncriona para pegar os valores que o servidor envia e retornar para váriaveis globais
async function sendVariables(arrayParaSomar, arrayName) {
    let promise = new Promise((resolve, reject) => {
        var variables = [];
        variables.push(arrayParaSomar);
        variables.push(arrayName);
        resolve(variables);
    });
    return await promise;
}

cliente.on('message', function (client, topic, message) {
    cliente.subscribe('message', client, topic, message)
    const arrayValores = message.payload.toString();
    const arrayName = message.topic;

    (async () => {
        // Pega os valores que o servidor envia através da função sendVariables
        result = await sendVariables(arrayValores, arrayName);

        // Verifica o nome da operação e atribui a váriavel enviada pelo servidor a váriaveis
        // Globais para realizar os cálculos posteriormente 
        if (arrayName === "vetorA") {
            arrayA = arrayValores;
        } else if (arrayName == "vetorB") {
            arrayB = arrayValores;
        } else if (arrayName == "operacaoA") {
            operacaoA = arrayValores;
        } else {
            operacaoB = arrayValores;
            // Na última verificação chama a função calcular para efetuar os cálculos
            resultados = calcular(arrayA, arrayB, operacaoA, operacaoB);
        }
    })();
})

// Cria dois arrays globais para armazenar os valores finais dos arrays
let resultA = [];
let resultB = [];

function calcular(arrayA, arrayB, operacaoA, operacaoB) {
    // Usa um .split para dividir a operação do número que o servidor envia
    operacaoA = operacaoA.split('');
    operacaoB = operacaoB.split('');

    // Pega os números que serão usados para os arrays A e B
    numA = operacaoA[1];
    numB = operacaoB[1];

    // Pega as operações que serão usadas nos arrays A e B 
    operacaoA = operacaoA[0];
    operacaoB = operacaoB[0];

    console.log(arrayA);
    console.log(arrayB);

    // Transforma em objetos para fazermos os cálculos
    arrayA = JSON.parse(arrayA);
    arrayB = JSON.parse(arrayB);

    console.log("Operação A: " + operacaoA + " / Número: " + numA);
    console.log("Operação B: " + operacaoB + " / Número: " + numB);

    let arrayC = [];
    let arrayD = [];
    let arrayE = [];
    let arrayF = [];
    
    // Faz verificação de cada operação e a efetua
    for (let i = 0; i < arrayA.length; i++) {
        if (operacaoA == "+") {
            arrayC[i] = arrayA[i] + parseInt(numA);
        } else if (operacaoA == "-") {
            arrayC[i] = arrayA[i] - parseInt(numA);
        } else if (operacaoA == "*") {
            arrayC[i] = arrayA[i] * parseInt(numA);
        } else if (operacaoA == "/") {
            arrayC[i] = arrayA[i] / parseInt(numA);
        } else if (operacaoA == "^") {
            arrayC[i] = arrayA[i] ** parseInt(numA);
        }

        if (operacaoB == "+") {
            arrayD[i] = arrayB[i] + parseInt(numB);
        } else if (operacaoB == "-") {
            arrayD[i] = arrayB[i] - parseInt(numB);
        } else if (operacaoB == "*") {
            arrayD[i] = arrayB[i] * parseInt(numB);
        } else if (operacaoB == "/") {
            arrayD[i] = arrayB[i] / parseInt(numB);
        } else if (operacaoB == "^") {
            arrayD[i] = arrayB[i] ** parseInt(numB);
        }

        for (let i = 0; i < arrayC.length; i++) {
            arrayE[i] = arrayC[i] + arrayD[i];
        }

        for (let i = 0; i < arrayC.length; i++) {
            arrayF[i] = arrayC[i] - arrayD[i];
        }
    }

    // Pega os arrays temporários e passam para os globais usando a funçáo .push
    for (let i = 0; i < arrayE.length; i++) {
        resultA.push(arrayE[i]);
    }

    for (let i = 0; i < arrayF.length; i++) {
        resultB.push(arrayF[i]);
    }

    // Coloca os resultados em váriaveis globais transformando-as em String e adicionando [ ]
    resultA = "[" + resultA.toString() + "]";
    resultB = "[" + resultB.toString() + "]";
    console.log("Result A: " + resultA);
    console.log("Result B:" + resultB);
}
