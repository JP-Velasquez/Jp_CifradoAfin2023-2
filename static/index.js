document.addEventListener('DOMContentLoaded', function () {
    const btn_Grafica = document.getElementById('frequencyButton');
    const enlaces = document.getElementById('enlaces');

    // Función para verificar si dos números son coprimos
    function is_coprime(a, b) {
        // Implementa la lógica para verificar si "a" y "b" son coprimos
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a === 1;
    }
    // Variable para verificar si se ha hecho clic en el botón Submit
    let submitClicked = false;
    btn_Grafica.disabled = true;

    // Escucha el evento submit del formulario
    document.getElementById('formCifrado').addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe de forma convencional

        // Obtén el formulario y su contenido
        const form = event.target;
        const formData = new FormData(form);
        const text = formData.get('text');
        const a = formData.get('a');  // Agrega esta línea para obtener el valor de "a"

        // Verifica si el campo de texto está vacío o solo contiene espacios en blanco
        if (text.trim() === "") {
            alert('Debes ingresar texto antes de generar el análisis de frecuencia.');
            return;
        }

        // Verifica si el texto contiene solo números
        if (/^\d+$/.test(text)) {
            alert('El texto no puede contener solo números. Por favor, ingrese letras.');
            return;
        }

        // Verifica si "a" es coprimo con 27
        if (!is_coprime(a, 27)) {
            alert('El valor de "a" no es coprimo con 27. Por favor, elige otro valor.');
            return;
        }

        submitClicked = true;
        btn_Grafica.disabled = false;
        //btn_Grafica.style.display = 'inline-block';
        enlaces.style.display = 'inline-block';

        // Realiza una solicitud de cifrado al servidor
        const response = await fetch('/encrypt', {
            method: 'POST',
            body: formData
        });
        const encryptedText = await response.text();

        // Muestra el texto cifrado en la página
        document.getElementById('result').innerHTML = `${encryptedText}`;
        if (submitClicked) {
            // Realiza el análisis de frecuencia en el texto ingresado de cifrado
            const frequencyResponseIng = await fetch('/frequencyI_Cifrado', {
                method: 'POST',
                body: formData
            });
            const frequencyHtmlIng = await frequencyResponseIng.text();
            // Muestra el análisis de frecuencia en la página
            document.getElementById('frequencyResultTxtIngresado').innerHTML = frequencyHtmlIng;
            btn_Grafica.click();
        }
    });

    document.getElementById('frequencyButton').addEventListener('click', function () {
        const form = document.getElementById('formCifrado');
        const formData = new FormData(form);
        const text = formData.get('text');
        const a = formData.get('a');
        const b = formData.get('b');

        // Verifica si el campo de texto está vacío o solo contiene espacios en blanco
        if (text.trim() === "") {
            submitClicked = false;
            btn_Grafica.disabled = true;
            alert('Primero llene y envie el formulario.\nAntes de generar el análisis de frecuencia.');
            return;
        }

        // Verifica si "a" y "b" están vacíos o nulos
        if (a === null || a === "") {
            submitClicked = false;
            btn_Grafica.disabled = true;
            alert('Primero llene y envie el formulario.\nAntes de generar el análisis de frecuencia.');
            return;
        }

        if (b === null || b === "") {
            submitClicked = false;
            btn_Grafica.disabled = true;
            alert('Primero llene y envie el formulario.\nAntes de generar el análisis de frecuencia.');
            return;
        }

        if (submitClicked) {
            btn_Grafica.disabled = false;
            fetch('/frequencyR_Cifrado', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(html => {
                    const frequencyResult = document.getElementById('frequencyResultTxtResult');
                    frequencyResult.innerHTML = html;
                })
                .catch(error => console.error(error));
        }
    });

    // Función para ajustar la altura del textarea automáticamente
    function adjustTextareaHeight() {
        const textarea = document.getElementById('text');
        textarea.style.height = 'auto'; // Restablecer la altura a automática
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar la altura al contenido
    }

    // Ajusta la altura inicial
    adjustTextareaHeight();

    // Escucha el evento input en el textarea
    document.getElementById('text').addEventListener('input', adjustTextareaHeight);
});