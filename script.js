const BACKEND_URL =
   https://script.google.com/macros/s/AKfycbyZpZD_1gjQxCo23BRMEuvE6TCD_ZVABH3qsYqlIq0DdSKCpEy-Ibu6rHNKOdakKhDfew/exec
async function confirmApplication() {

    user(
        "Sí, confirmar solicitud"
    );


    currentStep =
        "sending";


    clearOptions();


    bot(`
        <strong>
            Estoy registrando tu solicitud...
        </strong>

        <br><br>

        Un momento, por favor.
    `);


    const payload = {

        folio:
            createFolio(),

        nombreCompleto:
            application.nombreCompleto,

        fechaNacimiento:
            application.fechaNacimiento,

        lugarNacimiento:
            application.lugarNacimiento,

        telefono:
            application.telefono,

        inversionInicial:
            application.inversionInicial,

        frecuencia:
            application.frecuencia,

        aportacion:
            application.aportacion,

        observaciones:
            "Solicitud generada mediante Homepage PABS"

    };


    try {

        const response =
            await fetch(
                BACKEND_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(payload)

                }
            );


        const result =
            await response.json();


        if (
            !result.success
        ) {

            throw new Error(
                result.error ||
                "No fue posible registrar la solicitud."
            );

        }


        application.folio =
            result.folio;


        currentStep =
            "completed";


        bot(`

            <strong>
                ¡Solicitud registrada!
            </strong>

            <br><br>

            Tu folio es:

            <br>

            <strong>
                ${safe(result.folio)}
            </strong>

            <br><br>

            Tu información fue recibida
            correctamente.

            <br><br>

            Un asesor podrá dar seguimiento
            a tu proceso.

        `);


        showOptions([

            [
                "Hablar con Sergio por WhatsApp",
                "human"
            ],

            [
                "Finalizar",
                "close"
            ]

        ]);


    } catch (error) {

        console.error(error);


        currentStep =
            "confirmation";


        bot(`

            <strong>
                No pude completar el registro.
            </strong>

            <br><br>

            No vuelvas a capturar tus datos.

            <br><br>

            Puedes contactar directamente
            a un asesor para continuar.

        `);


        showOptions([

            [
                "Contactar asesor",
                "human"
            ],

            [
                "Intentar nuevamente",
                "confirm"
            ]

        ]);

    }

}
