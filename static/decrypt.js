document.addEventListener('DOMContentLoaded', function () {
    const autoDecipherRadio = document.getElementById('autoDecipher');
    const manualDecipherRadio = document.getElementById('manualDecipher');
    const manualFields = document.getElementById('manualFields');
    const formDecipher = document.getElementById('formDecipher');
    const autoDecryptButton = document.getElementById('autoDecryptButton');
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

    autoDecipherRadio.addEventListener('change', function () {
        if (autoDecipherRadio.checked) {
            // Configura el formulario para Descifrado Automático
            formDecipher.action = "/decrypt_auto";
            manualFields.style.display = 'none';
            document.getElementById('a_decipher').disabled = true;
            document.getElementById('b_decipher').disabled = true;
            autoDecryptButton.style.display = 'block';
        }
    });

    manualDecipherRadio.addEventListener('change', function () {
        if (manualDecipherRadio.checked) {
            // Configura el formulario para Descifrado Manual
            formDecipher.action = "/decrypt_manual";
            manualFields.style.display = 'block';
            document.getElementById('a_decipher').disabled = false;
            document.getElementById('b_decipher').disabled = false;
            autoDecryptButton.style.display = 'none';
        }
    });

    formDecipher.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Obtén el formulario y su contenido
        const formDecipher = event.target;
        const formData = new FormData(formDecipher);
        const text = formData.get('ciphertext');
        const a = formData.get('a_decipher');  // Agrega esta línea para obtener el valor de "a"

        if (manualDecipherRadio.checked) {
            // Obténer los valores de los campos 'a_decipher' y 'b_decipher'
            var a_decipherValue = document.getElementById("a_decipher").value;
            var b_decipherValue = document.getElementById("b_decipher").value;

            // Verifica si 'a_decipher' es una cadena no vacía y es numérico
            if (a_decipherValue.trim() === '' || isNaN(a_decipherValue)) {
                alert("El campo 'a_decipher' debe ser un número válido.");
                return
            }

            // Verifica si 'b_decipher' es una cadena no vacía y es numérico
            if (b_decipherValue.trim() === '' || isNaN(b_decipherValue)) {
                alert("El campo 'b_decipher' debe ser un número válido.");
                return
            }

            // Verifica si "a" es coprimo con 27
            if (!is_coprime(a, 27)) {
                alert('El valor de "a" no es coprimo con 27. Por favor, elige otro valor.');
                return;
            }
        }


        // Verifica si al menos una de las dos opciones está seleccionada
        if (!autoDecipherRadio.checked && !manualDecipherRadio.checked) {
            alert("Debes seleccionar una opción: \nDescifrado Automático o Descifrado Manual.");
            return;
        }

        textoMin = text.trim();
        if (textoMin.length < 2) {
            alert("El textarea debe contener al menos dos letras.");
            return;
        }

        // Verifica si el texto contiene solo números
        if (/^\d+$/.test(text)) {
            alert('El texto no puede contener solo números. Por favor, ingrese letras.');
            return;
        }

        // Verifica si el campo de texto está vacío o solo contiene espacios en blanco
        if (text.trim() === "") {
            alert('Debes ingresar texto antes de generar el análisis de frecuencia.');
            return;
        }

        submitClicked = true;
        btn_Grafica.disabled = false;
        //btn_Grafica.style.display = 'inline-block';
        enlaces.style.display = 'inline-block';

        const response = await fetch(formDecipher.action, {
            method: 'POST',
            body: formData
        });

        const decrypted_text = await response.text();
        document.getElementById('result').innerHTML = `${decrypted_text}`;
        if (submitClicked) {
            // Realiza el análisis de frecuencia en el texto ingresado de cifrado
            const frequencyResponseIng = await fetch('/frequencyI_DesCifrado', {
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
        const form = document.getElementById('formDecipher');
        const formData = new FormData(form);
        const text = formData.get('ciphertext');

        // Verifica si el campo de texto está vacío o solo contiene espacios en blanco
        if (text.trim() === "") {
            submitClicked = false;
            btn_Grafica.disabled = true;
            alert('Primero llene y envie el formulario.\nAntes de generar el análisis de frecuencia.');
            return;
        }

        if (submitClicked) {
            btn_Grafica.disabled = false;
            fetch('/frequencyR_DesCifrado', {
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
        const textarea = document.getElementById('ciphertext');
        textarea.style.height = 'auto'; // Restablecer la altura a automática
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajustar la altura al contenido
    }

    // Ajusta la altura inicial
    adjustTextareaHeight();

    // Escucha el evento input en el textarea
    document.getElementById('ciphertext').addEventListener('input', adjustTextareaHeight);

});