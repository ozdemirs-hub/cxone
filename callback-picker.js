
(function () {
    "use strict";

    // ============================================================
    // INITIALISE CALLBACK PICKER
    // ============================================================

    function initialiseCallbackPicker(fieldId) {

        var field = document.getElementById(fieldId);

        if (!field || typeof flatpickr === "undefined") {
            return false;
        }

        if (field._flatpickr) {
            return true;
        }

        flatpickr(field, {
            enableTime: true,

            // Value returned to NICE CXone Studio
            dateFormat: "Y-m-d H:i:S",

            // Use original input rather than an alternate input
            altInput: false,

            minuteIncrement: 30,
            time_24hr: false,

            minDate: "today",
            minTime: "08:00",
            maxTime: "18:00",

            allowInput: false,

            onChange: function (selectedDates, dateStr, instance) {

                field.value = dateStr;

                // Notify listeners of the updated value
                field.dispatchEvent(
                    new Event("change", { bubbles: true })
                );

                console.log(
                    fieldId + " value for Studio:",
                    field.value
                );
            }
        });

        return true;
    }

    // ============================================================
    // WAIT FOR FORM AND FLATPICKR
    // ============================================================

    var attempts = 0;

    var timer = setInterval(function () {
        attempts++;

        var utilitiesReady =
            initialiseCallbackPicker("callback_datetime_utilities");

        var ovcReady =
            initialiseCallbackPicker("callback_datetime_ovc");

        if (
            (utilitiesReady && ovcReady) ||
            attempts >= 100
        ) {
            clearInterval(timer);
        }
    }, 200);

})();
