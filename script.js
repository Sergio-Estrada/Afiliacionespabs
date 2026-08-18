/* =========================================================
   PABS — ASISTENTE DE AFILIACIÓN
========================================================= */


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const CONFIG = {

    whatsapp:
        "526641601608",

    email:
        "pabsindustrialtecate@gmail.com",

    contributions: {

        semanal: 150,

        quincenal: 300,

        mensual: 600

    }

};


/* =========================================================
   EXPEDIENTE
========================================================= */

const application = {

    nombreCompleto: null,

    fechaNacimiento: null,

    lugarNacimiento: null,

    telefono: null,

    inversionInicial: null,

    frecuencia: null,

    aportacion: null,

    createdAt: null,

    folio: null

};


/* =========================================================
   ESTADO
========================================================= */

let currentStep = "idle";

let assistantOpen = false;


/* =========================================================
   ELEMENTOS
========================================================= */

const assistant =
    document.getElementById("aiAssistant");

const messages =
    document.getElementById("aiMessages");

const options =
    document.getElementById("aiOptions");

const input =
    document.getElementById("aiInput");


/* =========================================================
   ABRIR
========================================================= */

function openAssistant(mode = "affiliate") {

    assistant.classList.add("active");

    assistantOpen = true;

    input.focus();

    if (!messages.children.length) {

        welcome();

    }

    if (mode === "affiliate") {

        setTimeout(() => {

            startAffiliate();

        }, 300);

    }

    if (mode === "information") {

        setTimeout(() => {

            information();

        }, 300);

    }

    if (mode === "question") {

        setTimeout(() => {

            askQuestion();

        }, 300);

    }

}


/* =========================================================
   CERRAR
========================================================= */

function closeAssistant() {

    assistant.classList.remove("active");

    assistantOpen = false;

}


/* =========================================================
   BIENVENIDA
========================================================= */

function welcome() {

    bot(`
        <strong>Hola, soy tu Asesor Virtual PABS.</strong>
        <br><br>
        Estoy aquí para orientarte, resolver tus dudas
        y acompañarte durante tu proceso.
        <br><br>
        Puedes preguntarme lo que necesites.
    `);

    showOptions([

        ["Quiero afiliarme", "affiliate"],

        ["Quiero conocer PABS", "information"],

        ["Tengo una duda", "question"],

        ["Quiero hablar con un asesor", "human"]

    ]);

}


/* =========================================================
   INICIO AFILIACIÓN
========================================================= */

function startAffiliate() {

    currentStep =
        "nombreCompleto";

    clearOptions();

    bot(`
        Perfecto. Vamos a comenzar tu proceso
        de afiliación.
        <br><br>
        Te iré solicitando la información
        paso a paso.
        <br><br>
        <strong>¿Cuál es tu nombre completo?</strong>
    `);

}


/* =========================================================
   INFORMACIÓN
========================================================= */

function information() {

    clearOptions();

    bot(`
        PABS es un Programa de Apoyo y Beneficio Social
        orientado a la previsión y protección familiar.
        <br><br>
        Puedo explicarte los beneficios, las aportaciones,
        el proceso de afiliación o resolver una pregunta
        específica.
    `);

    showOptions([

        ["Iniciar afiliación", "affiliate"],

        ["Ver aportaciones", "contributions"],

        ["Tengo otra pregunta", "question"]

    ]);

}


/* =========================================================
   PREGUNTA
========================================================= */

function askQuestion() {

    currentStep =
        "freeQuestion";

    clearOptions();

    bot(`
        Claro. Escríbeme tu pregunta.
        <br><br>
        Intentaré orientarte con la información
        disponible.
    `);

}


/* =========================================================
   ENVIAR MENSAJE
========================================================= */

function sendAIMessage() {

    const value =
        input.value.trim();

    if (!value) return;

    user(value);

    input.value = "";

    processMessage(value);

}


/* =========================================================
   ENTER
========================================================= */

input.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            sendAIMessage();

        }

    }
);


/* =========================================================
   MOTOR DE CAPTURA
========================================================= */

function processMessage(value) {

    switch (currentStep) {


        case "nombreCompleto":

            application.nombreCompleto =
                value;

            currentStep =
                "fechaNacimiento";

            bot(`
                Gracias, ${safe(value)}.
                <br><br>
                ¿Cuál es tu <strong>fecha de nacimiento</strong>?
                <br><br>
                Ejemplo: 30/06/1985
            `);

            break;


        case "fechaNacimiento":

            if (!validDate(value)) {

                bot(`
                    Necesito una fecha válida.
                    <br><br>
                    Utiliza el formato:
                    <strong>DD/MM/AAAA</strong>
                `);

                return;

            }

            application.fechaNacimiento =
                value;

            currentStep =
                "lugarNacimiento";

            bot(`
                Perfecto.
                <br><br>
                ¿Cuál es tu <strong>lugar de nacimiento</strong>?
            `);

            break;


        case "lugarNacimiento":

            application.lugarNacimiento =
                value;

            currentStep =
                "telefono";

            bot(`
                Gracias.
                <br><br>
                Ahora necesito tu número de
                <strong>WhatsApp o teléfono de contacto</strong>.
                <br><br>
                Escríbelo con 10 dígitos.
            `);

            break;


        case "telefono":

            const phone =
                value.replace(/\D/g, "");

            if (phone.length !== 10) {

                bot(`
                    El número debe contener 10 dígitos.
                    <br><br>
                    Inténtalo nuevamente.
                `);

                return;

            }

            application.telefono =
                phone;

            currentStep =
                "inversionInicial";

            bot(`
                Perfecto.
                <br><br>
                ¿Qué cantidad deseas considerar como
                <strong>inversión inicial</strong>?
                <br><br>
                Ejemplo: 1000
            `);

            break;


        case "inversionInicial":

            const amount =
                Number(
                    value
                        .replace(/[$,\s]/g, "")
                        .replace(/[^\d.]/g, "")
                );

            if (!amount || amount <= 0) {

                bot(`
                    Por favor proporciona una cantidad
                    válida.
                    <br><br>
                    Ejemplo: <strong>1000</strong>
                `);

                return;

            }

            application.inversionInicial =
                amount;

            currentStep =
                "frecuencia";

            bot(`
                Excelente.
                <br><br>
                Ahora selecciona la frecuencia de
                aportación que deseas considerar.
            `);

            showOptions([

                ["Semanal — $150", "weekly"],

                ["Quincenal — $300", "biweekly"],

                ["Mensual — $600", "monthly"]

            ]);

            break;


        case "freeQuestion":

            answerQuestion(value);

            break;


        default:

            answerQuestion(value);

    }

}


/* =========================================================
   FRECUENCIAS
========================================================= */

function selectFrequency(type) {

    const map = {

        weekly: [
            "Semanal",
            150
        ],

        biweekly: [
            "Quincenal",
            300
        ],

        monthly: [
            "Mensual",
            600
        ]

    };


    const selected =
        map[type];

    if (!selected) return;


    application.frecuencia =
        selected[0];

    application.aportacion =
        selected[1];


    user(
        `${selected[0]} — $${selected[1]} MXN`
    );


    currentStep =
        "confirmation";


    setTimeout(
        showApplicationSummary,
        400
    );

}


/* =========================================================
   RESUMEN
========================================================= */

function showApplicationSummary() {

    clearOptions();

    bot(`

        <strong>
            Revisa tu información
        </strong>

        <br><br>

        <div class="summary">

            <span>
                Nombre
            </span>

            <strong>
                ${safe(application.nombreCompleto)}
            </strong>

            <span>
                Fecha de nacimiento
            </span>

            <strong>
                ${safe(application.fechaNacimiento)}
            </strong>

            <span>
                Lugar de nacimiento
            </span>

            <strong>
                ${safe(application.lugarNacimiento)}
            </strong>

            <span>
                WhatsApp
            </span>

            <strong>
                ${safe(application.telefono)}
            </strong>

            <span>
                Inversión inicial
            </span>

            <strong>
                $${money(application.inversionInicial)} MXN
            </strong>

            <span>
                Frecuencia
            </span>

            <strong>
                ${safe(application.frecuencia)}
            </strong>

            <span>
                Aportación
            </span>

            <strong>
                $${money(application.aportacion)} MXN
            </strong>

        </div>

        <br>

        ¿La información es correcta?

    `);


    showOptions([

        ["Sí, confirmar solicitud", "confirm"],

        ["Quiero modificar información", "edit"]

    ]);

}


/* =========================================================
   CONFIRMAR
========================================================= */

function confirmApplication() {

    application.createdAt =
        new Date().toISOString();

    application.folio =
        createFolio();


    user(
        "Sí, confirmar solicitud"
    );


    currentStep =
        "completed";


    clearOptions();


    setTimeout(() => {

        bot(`
            <strong>
                Solicitud preparada correctamente.
            </strong>

            <br><br>

            Tu folio de solicitud es:

            <br>

            <strong>
                ${application.folio}
            </strong>

            <br><br>

            Tus datos están listos para enviarse
            al sistema de registro.

            <br><br>

            En la siguiente etapa conectaremos este
            proceso con Google Sheets y Google Drive.

        `);


        showOptions([

            ["Contactar asesor por WhatsApp", "human"],

            ["Finalizar", "close"]

        ]);


    }, 500);

}


/* =========================================================
   MODIFICAR
========================================================= */

function editApplication() {

    user(
        "Quiero modificar información"
    );

    resetApplication();

    startAffiliate();

}


/* =========================================================
   PREGUNTAS
========================================================= */

function answerQuestion(value) {

    const text =
        value.toLowerCase();


    if (
        text.includes("aport") ||
        text.includes("pago") ||
        text.includes("cuanto") ||
        text.includes("cuánto")
    ) {

        bot(`
            Las aportaciones configuradas actualmente
            para este proceso son:
            <br><br>

            <strong>Semanal:</strong> $150 MXN
            <br>

            <strong>Quincenal:</strong> $300 MXN
            <br>

            <strong>Mensual:</strong> $600 MXN

            <br><br>

            Si quieres, puedo ayudarte a iniciar
            tu afiliación.
        `);

        showOptions([
            ["Iniciar afiliación", "affiliate"],
            ["Tengo otra pregunta", "question"]
        ]);

        return;

    }


    if (
        text.includes("afili") ||
        text.includes("inscrib") ||
        text.includes("registro")
    ) {

        bot(`
            Puedo acompañarte durante el proceso
            de afiliación y solicitar tus datos
            paso a paso.
        `);

        showOptions([
            ["Iniciar afiliación", "affiliate"]
        ]);

        return;

    }


    if (
        text.includes("asesor") ||
        text.includes("persona") ||
        text.includes("humano")
    ) {

        contactHuman();

        return;

    }


    /*
       AQUÍ CONECTAREMOS EL MODELO DE IA REAL.
    */

    bot(`
        Entiendo tu pregunta.
        <br><br>
        Esta conversación será procesada posteriormente
        por nuestro modelo de IA conectado a la base
        de conocimiento PABS.
        <br><br>
        Si prefieres atención humana, puedo comunicarte
        con un asesor.
    `);

    showOptions([
        ["Hablar con asesor", "human"],
        ["Iniciar afiliación", "affiliate"]
    ]);

}


/* =========================================================
   ASESOR HUMANO
========================================================= */

function contactHuman() {

    clearOptions();

    bot(`
        Claro.
        <br><br>

        Puedes continuar directamente con:

        <br><br>

        <strong>
            Sergio Estrada
        </strong>

        <br>

        Asesor Ejecutivo Comercial PABS.

        <br><br>

        <a
            href="https://wa.me/${CONFIG.whatsapp}"
            target="_blank">

            CONTACTAR POR WHATSAPP →

        </a>
    `);

}


/* =========================================================
   OPCIONES
========================================================= */

function showOptions(list) {

    clearOptions();

    list.forEach(
        ([label, action]) => {

            const button =
                document.createElement("button");

            button.className =
                "ai-option";

            button.textContent =
                label;

            button.onclick = () => {

                handleAction(action);

            };

            options.appendChild(button);

        }
    );

}


function handleAction(action) {

    switch (action) {

        case "affiliate":
            startAffiliate();
            break;

        case "information":
            information();
            break;

        case "question":
            askQuestion();
            break;

        case "human":
            contactHuman();
            break;

        case "weekly":
            selectFrequency("weekly");
            break;

        case "biweekly":
            selectFrequency("biweekly");
            break;

        case "monthly":
            selectFrequency("monthly");
            break;

        case "confirm":
            confirmApplication();
            break;

        case "edit":
            editApplication();
            break;

        case "contributions":
            answerQuestion("aportaciones");
            break;

        case "close":
            closeAssistant();
            break;

    }

}


/* =========================================================
   MENSAJES
========================================================= */

function bot(html) {

    addMessage(
        html,
        "bot"
    );

}


function user(text) {

    addMessage(
        safe(text),
        "user"
    );

}


function addMessage(content, type) {

    const div =
        document.createElement("div");

    div.className =
        `ai-message ${type}`;

    div.innerHTML =
        content;

    messages.appendChild(div);

    messages.scrollTop =
        messages.scrollHeight;

}


function clearOptions() {

    options.innerHTML =
        "";

}


/* =========================================================
   UTILIDADES
========================================================= */

function validDate(value) {

    return /^\d{1,2}\/\d{1,2}\/\d{4}$/
        .test(value);

}


function money(value) {

    return Number(value)
        .toLocaleString(
            "es-MX"
        );

}


function safe(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function createFolio() {

    const now =
        new Date();

    const date =
        now.getFullYear() +
        String(
            now.getMonth() + 1
        ).padStart(2, "0") +
        String(
            now.getDate()
        ).padStart(2, "0");


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return `PABS-TKT-${date}-${random}`;

}


function resetApplication() {

    Object.keys(application)
        .forEach(
            key => {
                application[key] = null;
            }
        );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMobileMenu() {

    document
        .querySelector(".navbar nav")
        .classList.toggle("mobile-open");

}


/* =========================================================
   ESC PARA CERRAR
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            assistantOpen
        ) {

            closeAssistant();

        }

    }
);
