const numeroSenha = document.querySelector('.parametro-senha__texto');
let tamanhoSenha = 12;
numeroSenha.textContent = tamanhoSenha;
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVXYWZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvxywz';
const numeros = '0123456789';
const simbolos = '!@%*?#$';
const botoes = document.querySelectorAll('.parametro-senha__botao');
const campoSenha = document.querySelector('#campo-senha');
const checkbox = document.querySelectorAll('.checkbox');
const forcaSenha = document.querySelector('.forca');

botoes[0].onclick = diminuiTamanho;
botoes[1].onclick = aumentaTamanho;

function diminuiTamanho() {
    if (tamanhoSenha > 1) {
        tamanhoSenha--;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}
function aumentaTamanho() {
    if (tamanhoSenha < 20) {
        tamanhoSenha++;
    }
    numeroSenha.textContent = tamanhoSenha;
    geraSenha();
}

for (i = 0; i < checkbox.length; i++) {
    checkbox[i].onclick = geraSenha;
}

geraSenha();

function geraSenha() {
    let alfabeto = '';
    if (checkbox[0].checked) {
        alfabeto = alfabeto + letrasMaiusculas;
    }
    if (checkbox[1].checked) {
        alfabeto = alfabeto + letrasMinusculas;
    }
    if (checkbox[2].checked) {
        alfabeto = alfabeto + numeros;
    }
    if (checkbox[3].checked) {
        alfabeto = alfabeto + simbolos;
    }

    // Handle case where no checkbox is selected to prevent errors
    if (alfabeto.length === 0) {
        campoSenha.value = ''; // Clear the password field
        classificaSenha(0); // Pass 0 for alphabet length to indicate no characters selected
        return; // Exit the function
    }

    let senha = '';
    for (let i = 0; i < tamanhoSenha; i++) {
        let numeroAleatorio = Math.random() * alfabeto.length;
        numeroAleatorio = Math.floor(numeroAleatorio);
        senha = senha + alfabeto[numeroAleatorio];
    }
    campoSenha.value = senha;
    classificaSenha(alfabeto.length);
}

function classificaSenha(tamanhoAlfabeto) {
    let entropia = tamanhoSenha * Math.log2(tamanhoAlfabeto);
    console.log(entropia);
    
    // Remove all existing strength classes before adding the new one
    forcaSenha.classList.remove('fraca', 'media', 'forte', 'impossivel');
    
    // Define your entropy thresholds for classification
    // Adjust these values as needed for your "impossible" definition
    if (entropia >= 85) { // Adjusted threshold for "impossivel"
        forcaSenha.classList.add('impossivel');
    } else if (entropia >= 65) { // Adjusted threshold for "forte"
        forcaSenha.classList.add('forte');
    } else if (entropia >= 40) { // Adjusted threshold for "media"
        forcaSenha.classList.add('media');
    } else { // Below all other thresholds, it's "fraca"
        forcaSenha.classList.add('fraca');
    }

    const valorEntropia = document.querySelector('.entropia');
    
    // Handle cases where entropia might be 0 (e.g., no characters selected)
    if (tamanhoAlfabeto === 0 || entropia === 0) {
        valorEntropia.textContent = "Selecione pelo menos um tipo de caractere para gerar uma senha.";
        return;
    }

    const diasParaDescobrir = Math.floor(2 ** entropia / (100e6 * 60 * 60 * 24));

    if (diasParaDescobrir === 0) {
        valorEntropia.textContent = "Esta senha pode ser descoberta instantaneamente.";
    } else if (diasParaDescobrir < 1) {
        valorEntropia.textContent = "Um computador levaria menos de um dia para descobrir esta senha.";
    } else if (diasParaDescobrir < 365) {
        valorEntropia.textContent = `Um computador levaria aproximadamente ${diasParaDescobrir} dias para descobrir esta senha.`;
    } else {
        const anosParaDescobrir = Math.floor(diasParaDescobrir / 365);
        valorEntropia.textContent = `Um computador levaria aproximadamente ${anosParaDescobrir} anos para descobrir esta senha.`;
    }
}