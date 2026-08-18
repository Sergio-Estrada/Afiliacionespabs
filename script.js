```javascript
/* =========================================================
   PABS — MOTOR CONVERSACIONAL DE AFILIACIÓN
   ========================================================= */


/* =========================
   ESTADO DEL PROSPECTO
========================= */

const prospect = {

    nombreCompleto: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    telefono: "",
    inversionInicial: "",
    frecuencia: "",
    aportacion: ""

};


/* =========================
   ESTADO DEL ASISTENTE
========================= */

let currentStep = "inicio";

let assistantStarted = false;


/* =========================
   ELEMENTOS
========================= */

const assistant =
    document.getElementById("assistant");

const chat =
    document.getElementById("chat");

const input =
    document.getElementById("userMessage");


/* =========================
   ABRIR ASISTENTE
========================= */

function openAssistant() {

    assistant.classList.add("active");

    if (!assistantStarted) {

        assistantStarted = true;

        showWelcome();

    }

}


/* =========================
   CERRAR
========================= */

function closeAssistant() {

    assistant.classList.remove("active");

}


/* =========================
   BIENVENIDA
========================= */

function showWelcome() {

    addBotMessage(`
        <strong>Hola, soy tu Asesor Virtual PABS.</strong>
        <br><br>
        Estoy aquí para orientarte, resolver tus dudas
        y acompañarte durante tu proceso de afiliación.
        <br><br>
        Podemos comenzar ahora mismo.
    `);

    setTimeout(() => {

        addBotMessage(`
            ¿Qué deseas hacer?
        `);

        showOptions([

            {
                text: "Quiero afiliarme",
                action: "startAffiliation"
            },

            {
                text: "Quiero conocer PABS",
                action: "information"
            },

            {
                text: "Tengo una duda",
                action: "question"
            },

            {
                text: "Quiero hablar con un asesor",
                action: "human"
            }

        ]);

    }, 500);

}


/* =========================
   INICIAR AFILIACIÓN
========================= */

function startAffiliation() {

    openAssistant();

    currentStep =
        "nombreCompleto";

    addUserMessage(
        "Quiero iniciar mi afiliación"
    );

    setTimeout(() => {

        addBotMessage(`
            Excelente decisión.
            Te acompañaré paso a paso.
            <br><br>
            Para comenzar:
            <br><br>
            <strong>¿Cuál es tu nombre completo?</strong>
        `);

    }, 500);

}


/* =========================
   OPCIONES
========================= */

function showOptions(options) {

    const container =
        document.createElement("div");

    container.className =
        "assistant-options";

    options.forEach(option => {

        const button =
            document.createElement("button");

        button.textContent =
            option.text;

        button.onclick = () => {

            handleOption(option.action);

        };

        container.appendChild(button);

    });

    chat.appendChild(container);

    chat.scrollTop =
        chat.scrollHeight;

}


/* =========================
   MANEJAR OPCIONES
========================= */

function handleOption(action) {

    if (action === "startAffiliation") {

        startAffiliation();

        return;

    }


    if (action === "information") {

        addUserMessage(
            "Quiero conocer PABS"
        );

        setTimeout(() => {

            addBotMessage(`
                PABS es un programa de apoyo de beneficio
                social orientado a la previsión y protección.
                <br><br>
                Puedo explicarte el proceso, las aportaciones
                y ayudarte a iniciar tu solicitud.
            `);

        }, 500);

        return;

    }


    if (action === "question") {

        addUserMessage(
            "Tengo una duda"
        );

        currentStep =
            "pregunta";

        setTimeout(() => {

            addBotMessage(`
                Claro. Escríbeme tu pregunta y trataré
                de orientarte.
                <br><br>
                Si necesitas atención de un asesor humano,
                también puedo ayudarte a contactarlo.
            `);

        }, 500);

        return;

    }


    if (action === "human") {

        contactHuman();

    }

}


/* =========================
   PROCESAR MENSAJE
========================= */

function sendMessage() {

    const message =
        input.value.trim();

    if (!message) {

        return;

    }

    addUserMessage(message);

    input.value = "";

    processMessage(message);

}


/* =========================
   ENTER
========================= */

function handleEnter(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

}


/* =========================
   MOTOR DE CAPTURA
========================= */

function processMessage(message) {

    switch (currentStep) {


        case "nombreCompleto":

            prospect.nombreCompleto =
                message;

            currentStep =
                "fechaNacimiento";

            botAsk(`
                Gracias, ${escapeHTML(message)}.
                <br><br>
                Ahora necesito tu <strong>fecha de nacimiento</strong>.
            `);

            break;


        case "fechaNacimiento":

            if (!validateDate(message)) {

                botAsk(`
                    Necesito una fecha válida.
                    <br><br>
                    Por favor utiliza el formato:
                    <strong>DD/MM/AAAA</strong>
                `);

                return;

            }

            prospect.fechaNacimiento =
                message;

            currentStep =
                "lugarNacimiento";

            botAsk(`
                Gracias.
                <br><br>
                ¿Cuál es tu <strong>lugar de nacimiento</strong>?
            `);

            break;


        case "lugarNacimiento":

            prospect.lugarNacimiento =
                message;

            currentStep =
                "telefono";

            botAsk(`
                Perfecto.
                <br><br>
                Ahora necesito tu número de
                <strong>WhatsApp o teléfono de contacto</strong>.
            `);

            break;


        case "telefono":

            if (!validatePhone(message)) {

                botAsk(`
                    Parece que el número no está completo.
                    <br><br>
                    Escríbelo con 10 dígitos.
                `);

                return;

            }

            prospect.telefono =
                message.replace(/\D/g, "");

            currentStep =
                "inversionInicial";

            botAsk(`
                Gracias.
                <br><br>
                ¿Qué cantidad deseas considerar como
                <strong>inversión inicial</strong>?
                <br><br>
                Puedes escribir solamente la cantidad.
            `);

            break;


        case "inversionInicial":

            const investment =
                parseCurrency(message);

            if (!investment || investment <= 0) {

                botAsk(`
                    Por favor indícame una cantidad válida
                    para tu inversión inicial.
                    <br><br>
                    Ejemplo:
                    <strong>1000</strong>
                `);

                return;

            }

            prospect.inversionInicial =
                investment;

            currentStep =
                "frecuencia";

            botAsk(`
                Perfecto.
                <br><br>
                ¿Cómo deseas realizar tus aportaciones?
            `);

            showOptions([

                {
                    text: "Semanal — $150",
                    action: "weekly"
                },

                {
                    text: "Quincenal — $300",
                    action: "biweekly"
                },

                {
                    text: "Mensual — $600",
                    action: "monthly"
                }

            ]);

            break;


        case "pregunta":

            answerBasicQuestion(message);

            break;


        default:

            botAsk(`
                Puedo ayudarte a iniciar tu afiliación.
                <br><br>
                Selecciona <strong>Quiero afiliarme</strong>
                para comenzar.
            `);

    }

}


/* =========================
   FRECUENCIA
========================= */

function selectFrequency(frequency, amount) {

    prospect.frecuencia =
        frequency;

    prospect.aportacion =
        amount;

    addUserMessage(
        frequency + " — $" + amount
    );

    currentStep =
        "confirmacion";

    setTimeout(() => {

        showSummary();

    }, 500);

}


/* =========================
   ACCIONES DE FRECUENCIA
========================= */

function handleFrequencyAction(action) {

    if (action === "weekly") {

        selectFrequency(
            "Semanal",
            150
        );

    }


    if (action === "biweekly") {

        selectFrequency(
            "Quincenal",
            300
        );

    }


    if (action === "monthly") {

        selectFrequency(
            "Mensual",
            600
        );

    }

}


/* =========================
   MODIFICAR OPCIONES
========================= */

function handleOption(action) {

    if (action === "startAffiliation") {

        startAffiliation();

        return;

    }


    if (action === "information") {

        addUserMessage(
            "Quiero conocer PABS"
        );

        botAsk(`
            PABS es un programa de apoyo de beneficio
            social enfocado en previsión y protección.
            <br><br>
            Si quieres, puedo ayudarte a iniciar
            tu proceso de afiliación.
        `);

        return;

    }


    if (action === "question") {

        addUserMessage(
            "Tengo una duda"
        );

        currentStep =
            "pregunta";

        botAsk(`
            Adelante. Escríbeme tu pregunta.
        `);

        return;

    }


    if (action === "human") {

        contactHuman();

        return;

    }


    if (
        action === "weekly" ||
        action === "biweekly" ||
        action === "monthly"
    ) {

        handleFrequencyAction(action);

    }

}


/* =========================
   RESUMEN
========================= */

function showSummary() {

    const summary = `

        <strong>Revisa tu información</strong>

        <br><br>

        <strong>Nombre:</strong><br>
        ${escapeHTML(prospect.nombreCompleto)}

        <br><br>

        <strong>Fecha de nacimiento:</strong><br>
        ${escapeHTML(prospect.fechaNacimiento)}

        <br><br>

        <strong>Lugar de nacimiento:</strong><br>
        ${escapeHTML(prospect.lugarNacimiento)}

        <br><br>

        <strong>WhatsApp:</strong><br>
        ${escapeHTML(prospect.telefono)}

        <br><br>

        <strong>Inversión inicial:</strong><br>
        $${formatMoney(prospect.inversionInicial)} MXN

        <br><br>

        <strong>Frecuencia:</strong><br>
        ${escapeHTML(prospect.frecuencia)}

        <br><br>

        <strong>Aportación:</strong><br>
        $${formatMoney(prospect.aportacion)} MXN

        <br><br>

        ¿La información es correcta?

    `;

    botAsk(summary);

    showOptions([

        {
            text: "Sí, confirmar solicitud",
            action: "confirm"
        },

        {
            text: "Quiero modificar un dato",
            action: "edit"
        }

    ]);

}


/* =========================
   CONFIRMACIÓN
========================= */

function confirmAffiliation() {

    currentStep =
        "completed";

    addUserMessage(
        "Sí, confirmar solicitud"
    );

    setTimeout(() => {

        botAsk(`
            <strong>Solicitud registrada.</strong>
            <br><br>
            Tu información está preparada para continuar
            con el proceso correspondiente.
            <br><br>
            En la siguiente etapa conectaremos este registro
            con Google Sheets y Google Drive para generar
            el respaldo de la solicitud.
        `);

    }, 700);

}


/* =========================
   MODIFICAR
========================= */

function editAffiliation() {

    addUserMessage(
        "Quiero modificar un dato"
    );

    currentStep =
        "nombreCompleto";

    botAsk(`
        Claro. Podemos corregir la información.
        <br><br>
        Vamos a comenzar nuevamente.
        <br><br>
        <strong>¿Cuál es tu nombre completo?</strong>
    `);

}


/* =========================
   PREGUNTAS BÁSICAS
========================= */

function answerBasicQuestion(message) {

    const text =
        message.toLowerCase();


    if (
        text.includes("aport") ||
        text.includes("pago") ||
        text.includes("seman")
    ) {

        botAsk(`
            Las aportaciones configuradas actualmente
            para este proceso son:
            <br><br>
            <strong>Semanal:</strong> $150 MXN<br>
            <strong>Quincenal:</strong> $300 MXN<br>
            <strong>Mensual:</strong> $600 MXN
        `);

        return;

    }


    if (
        text.includes("afili") ||
        text.includes("inscrib") ||
        text.includes("contrat")
    ) {

        botAsk(`
            Puedo acompañarte para iniciar tu solicitud
            de afiliación paso a paso.
            <br><br>
            Si deseas comenzar, selecciona:
            <strong>Quiero afiliarme</strong>.
        `);

        return;

    }


    botAsk(`
        Quiero ayudarte con precisión.
        Esta pregunta será incorporada posteriormente
        a nuestra base de conocimiento para que el
        asistente pueda responderla de forma más completa.
        <br><br>
        Si necesitas atención personalizada ahora,
        puedo comunicarte con el asesor humano.
    `);

}


/* =========================
   CONTACTO HUMANO
========================= */

function contactHuman() {

    addUserMessage(
        "Quiero hablar con un asesor"
    );

    botAsk(`
        Claro.
        <br><br>
        Puedes contactar directamente a
        <strong>Sergio Estrada</strong>,
        Asesor Ejecutivo Comercial PABS.
        <br><br>
        <a
            href="https://wa.me/526641601608"
            target="_blank">
            👉 CONTACTAR POR WHATSAPP
        </a>
    `);

}


/* =========================
   UTILIDADES
========================= */

function botAsk(message) {

    setTimeout(() => {

        addBotMessage(message);

    }, 400);

}


function addBotMessage(message) {

    const div =
        document.createElement("div");

    div.className =
        "bot-message";

    div.style.marginTop =
        "12px";

    div.innerHTML =
        message;

    chat.appendChild(div);

    chat.scrollTop =
        chat.scrollHeight;

}


function addUserMessage(message) {

    const div =
        document.createElement("div");

    div.className =
        "user-message";

    div.textContent =
        message;

    chat.appendChild(div);

    chat.scrollTop =
        chat.scrollHeight;

}


function validatePhone(phone) {

    const digits =
        phone.replace(/\D/g, "");

    return digits.length === 10;

}


function validateDate(date) {

    return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date);

}


function parseCurrency(value) {

    const cleaned =
        value
        .replace(/[$,\s]/g, "")
        .replace(/[^\d.]/g, "");

    const number =
        Number(cleaned);

    return Number.isFinite(number)
        ? number
        : null;

}


function formatMoney(value) {

    return Number(value)
        .toLocaleString(
            "es-MX",
            {
                minimumFractionDigits: 0
            }
        );

}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================
   BOTONES DE FRECUENCIA
========================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".assistant-options button"
            );

        if (!button) {

            return;

        }

        const text =
            button.textContent
                .toLowerCase();

        if (text.includes("semanal")) {

            selectFrequency(
                "Semanal",
                150
            );

        }

        else if (
            text.includes("quincenal")
        ) {

            selectFrequency(
                "Quincenal",
                300
            );

        }

        else if (
            text.includes("mensual")
        ) {

            selectFrequency(
                "Mensual",
                600
            );

        }

        else if (
            text.includes("confirmar")
        ) {

            confirmAffiliation();

        }

        else if (
            text.includes("modificar")
        ) {

            editAffiliation();

        }

    }
);
```
