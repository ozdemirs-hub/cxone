(function () {

    function initialiseCallbackPicker() {

        var field = document.getElementById("callback_time");

        if (!field) {
            return;
        }

        // Prevent initialising more than once
        if (field._callbackPickerInitialised) {
            return;
        }

        field._callbackPickerInitialised = true;

        flatpickr(field, {

            enableTime: true,

            dateFormat: "Y-m-d H:i:S",

            altInput: true,

            altFormat: "d/m/Y h:i K",

            minuteIncrement: 30,

            time_24hr: false,

            minDate: "today",

            minTime: "08:00",

            maxTime: "18:00",

            allowInput: false

        });

    }


    // Flatpickr may already be available
    if (typeof flatpickr !== "undefined") {

        initialiseCallbackPicker();

    }

    // Otherwise wait briefly for Flatpickr
    else {

        var attempts = 0;

        var timer = setInterval(function () {

            attempts++;

            if (typeof flatpickr !== "undefined") {

                clearInterval(timer);

                initialiseCallbackPicker();

            }

            if (attempts >= 50) {

                clearInterval(timer);

            }

        }, 100);

    }

})();
