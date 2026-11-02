(function () {

    // ============================================================
    // INITIALISE BOTH CALLBACK PICKERS
    // ============================================================

    function initialiseCallbackPicker(fieldId) {

        var field = document.getElementById(fieldId);

        if (!field || typeof flatpickr === "undefined") {

            return;
        }

        // Prevent duplicate initialisation

        if (field._callbackPickerInitialised) {

            return;
        }

        field._callbackPickerInitialised = true;

        // Use Flatpickr on the actual input

        flatpickr(field, {

            enableTime: true,

            // Value stored in the original input

            dateFormat: "Y-m-d H:i:S",

            // Human-readable display

            altInput: true,

            altFormat: "d/m/Y h:i K",

            minuteIncrement: 30,

            time_24hr: false,

            minDate: "today",

            minTime: "08:00",

            maxTime: "18:00",


            allowInput: false,

            // Ensure the original input contains the selected value

            onChange: function (selectedDates, dateStr, instance) {

                instance.input.value = dateStr;

                console.log(

                    fieldId + " selected value:",

                    instance.input.value

                );

            }

        });

    }

    // ============================================================
    // INITIALISE BOTH FIELDS
    // ============================================================

    function initialiseAllPickers() {

        initialiseCallbackPicker("callback_datetime_utilities");

        initialiseCallbackPicker("callback_datetime_ovc");

    }

    // ============================================================
    // WAIT FOR CXONE FORM AND FLATPICKR
    // ============================================================

    var attempts = 0;
    var timer = setInterval(function () {

        attempts++;

        if (typeof flatpickr !== "undefined") {

            initialiseAllPickers();

            var utilities = document.getElementById(

                "callback_datetime_utilities"

            );

            var ovc = document.getElementById(

                "callback_datetime_ovc"

            );

            // Stop once both fields have been initialised

            if (

                utilities && utilities._callbackPickerInitialised &&

                ovc && ovc._callbackPickerInitialised

            ) {

                clearInterval(timer);

            }

        }

        if (attempts >= 100) {

            clearInterval(timer);

        }

    }, 200);

})();

