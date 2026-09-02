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


// ============================================================

// PRODUCT TYPE / CALLBACK DATE TIME VISIBILITY

// ============================================================



(function () {



    function initialiseProductType() {



        var productType = document.getElementById("product_type");

        var callbackGroup = document.getElementById("callback_datetime_group");

        var callbackField = document.getElementById("callback_time");



        if (!productType || !callbackGroup) {

            return;

        }



        function updateCallbackVisibility() {



            if (productType.value === "OVC" ||

                productType.value === "Utilities") {



                callbackGroup.style.display = "block";



            } else {



                callbackGroup.style.display = "none";



                if (callbackField) {

                    callbackField.value = "";

                }



            }

        }



        // Run immediately

        updateCallbackVisibility();



        // Run whenever Product Type changes

        productType.addEventListener("change", updateCallbackVisibility);



    }





    // Wait until the CXone form is available

    var attempts = 0;



    var timer = setInterval(function () {



        attempts++;



        if (document.getElementById("product_type")) {



            clearInterval(timer);



            initialiseProductType();



        }



        if (attempts >= 50) {



            clearInterval(timer);



        }



    }, 100);



})();
