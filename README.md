const mqtt = require('mqtt');
const cliente = mqtt.connect('mqtt://localhost:1883');
let arrayA = [];
let arrayB = [];
let operacaoA, operacaoB;
let resultados = [];
function pegarNumero(array) {
    return array;
};

cliente.on('connect', function () {
    cliente.subscribe('vetorA');
    cliente.publish('novaOperacao', 'Inicio');
    cliente.subscribe('operacaoA');
})

cliente.on('connect', function () {
    cliente.subscribe('vetorB');
    cliente.publish('novaOperacao', 'Inicio');
    cliente.subscribe('operacaoB');    
});

async function enviarValores(arrays) {
    let firstArray = arrays[0].toString();
    let scndArray = arrays[1].toString();

    let promise = new Promise((resolve, reject) => {
        resolve(arrays);
    });

    return await promise;
};

(async () => {
    var ois = await enviarValores(1);
    console.log("slc" + ois);
})();

cliente.on('connect', function () {
    cliente.subscribe('vetorA');
    cliente.publish('novaOperacao', 'Inicio');
    cliente.subscribe('operacaoA'); 
    cliente.publish('soma', firstArray);
    console.log("Entrou aqui");
})

cliente.on('connect', function () {
    console.log("Entrou aqui");
    cliente.subscribe('vetorB')
    cliente.subscribe('operacaoB');   
    cliente.publish('diferenca', scndArray); 
});

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
        result = await sendVariables(arrayValores, arrayName);
        if (arrayName === "vetorA") {
            arrayA = arrayValores;
        } else if (arrayName == "vetorB") {
            arrayB = arrayValores;
        } else if (arrayName == "operacaoA") {
            operacaoA = arrayValores;
        } else {
            operacaoB = arrayValores;
            resultados = soma(arrayA, arrayB, operacaoA, operacaoB);
        }
    })();
})

function soma(arrayA, arrayB, operacaoA, operacaoB) {
    operacaoA = operacaoA.split('');
    operacaoB = operacaoB.split('');
    numA = operacaoA[1];
    numB = operacaoB[1];
    operacaoA = operacaoA[0];
    operacaoB = operacaoB[0];

    console.log(arrayA);
    console.log(arrayB);

    arrayA = JSON.parse(arrayA);
    arrayB = JSON.parse(arrayB);

    console.log("Operação A: " + operacaoA + " / Número: " + numA);
    console.log("Operação B: " + operacaoB + " / Número: " + numB);

    let arrayC = [];
    let arrayD = [];
    let arrayE = [];
    let arrayF = [];
    
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

    // enviarArrayA(arrayE);
    // enviarArrayB(arrayF);

    var results = [arrayE, arrayF];
    enviarValores(results);
}
