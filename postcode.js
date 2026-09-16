(function () {



    var utilitiesPostcodes = [];



    var postcodeLoaded = false;



    var JSON_URL = 'https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json';





    // ========================================================

    // Get form fields

    // ========================================================



    function getFields() {



        return {

            state: document.getElementById('3'),

            postcode: document.getElementById('4'),



            utilities: document.getElementById('product_utilities'),

            ovc: document.getElementById('product_ovc'),



            utilitiesCallback:

                document.getElementById('callback_datetime_utilities_group'),



            ovcCallback:

                document.getElementById('callback_datetime_ovc_group')

        };



    }





    // ========================================================

    // Check postcode

    // ========================================================



    function postcodeIsApproved(postcode) {



        for (var i = 0; i < utilitiesPostcodes.length; i++) {



            if (String(utilitiesPostcodes[i]).trim() === postcode) {



                return true;



            }



        }



        return false;



    }





    // ========================================================

    // Utilities availability

    // ========================================================



    function updateUtilities() {



        var fields = getFields();





        if (!fields.state ||

            !fields.postcode ||

            !fields.utilities) {



            return;



        }





        var state =

            fields.state.value.trim().toUpperCase();



        var postcode =

            fields.postcode.value.trim();





        // ----------------------------------------------------

        // JSON has not loaded yet

        //

        // Keep Utilities DISABLED.

        // ----------------------------------------------------



        if (!postcodeLoaded) {



            fields.utilities.disabled = true;



            return;



        }





        // ----------------------------------------------------

        // NSW and VIC are never allowed

        // ----------------------------------------------------



        if (state === 'NSW' || state === 'VIC') {



            fields.utilities.disabled = true;

            fields.utilities.checked = false;



            updateCallback();



            return;



        }





        // ----------------------------------------------------

        // Check postcode against JSON

        // ----------------------------------------------------



        if (postcodeIsApproved(postcode)) {



            fields.utilities.disabled = false;



        }



        else {



            fields.utilities.disabled = true;

            fields.utilities.checked = false;



        }





        updateCallback();



    }





    // ========================================================

    // Callback visibility

    // ========================================================



    function updateCallback() {



        var fields = getFields();





        // ----------------------------------------------------

        // OVC callback

        // ----------------------------------------------------



        if (fields.ovcCallback) {



            if (fields.ovc && fields.ovc.checked) {



                fields.ovcCallback.style.display = 'block';



            }



            else {



                fields.ovcCallback.style.display = 'none';



            }



        }





        // ----------------------------------------------------

        // Utilities callback

        // ----------------------------------------------------



        if (fields.utilitiesCallback) {



            if (fields.utilities && fields.utilities.checked) {



                fields.utilitiesCallback.style.display = 'block';



            }



            else {



                fields.utilitiesCallback.style.display = 'none';



            }



        }



    }





    // ========================================================

    // Load JSON

    // ========================================================



    function loadJSON() {



        fetch(JSON_URL)



            .then(function (response) {



                if (!response.ok) {



                    throw new Error(

                        'HTTP error ' + response.status

                    );



                }



                return response.json();



            })



            .then(function (data) {



                utilitiesPostcodes = data;



                postcodeLoaded = true;



                updateUtilities();



            })



            .catch(function (error) {



                console.log(

                    'ERROR loading Utilities postcode JSON: ' +

                    error.message

                );



                /*

                 * Keep Utilities disabled if JSON

                 * cannot be loaded.

                 */



                postcodeLoaded = true;



                utilitiesPostcodes = [];



                updateUtilities();



            });



    }





    // ========================================================

    // Initialise Utilities

    // ========================================================



    function initialiseUtilities() {



        var fields = getFields();





        if (!fields.state ||

            !fields.postcode ||

            !fields.utilities) {



            setTimeout(initialiseUtilities, 500);



            return;



        }





        /*

         * IMPORTANT:

         * Disable Utilities immediately.

         */



        fields.utilities.disabled = true;





        /*

         * Monitor State.

         */



        fields.state.addEventListener('input', function () {



            updateUtilities();



        });



        fields.state.addEventListener('change', function () {



            updateUtilities();



        });





        /*

         * Monitor Postcode.

         */



        fields.postcode.addEventListener('input', function () {



            updateUtilities();



        });



        fields.postcode.addEventListener('change', function () {



            updateUtilities();



        });





        /*

         * Load postcode list.

         */



        loadJSON();



    }





    // ========================================================

    // Initialise Callback sections

    // ========================================================



    function initialiseCallbacks() {



        var fields = getFields();





        if (!fields.ovc ||

            !fields.utilities ||

            !fields.ovcCallback ||

            !fields.utilitiesCallback) {



            setTimeout(initialiseCallbacks, 500);



            return;



        }





        /*

         * Initially hide BOTH callback sections.

         */



        fields.ovcCallback.style.display = 'none';



        fields.utilitiesCallback.style.display = 'none';





        /*

         * OVC checkbox.

         */



        fields.ovc.addEventListener('change', function () {



            updateCallback();



        });





        /*

         * Utilities checkbox.

         */



        fields.utilities.addEventListener('change', function () {



            updateCallback();



        });





        /*

         * Initial state.

         */



        updateCallback();



    }





    // ========================================================

    // Start both processes independently

    // ========================================================



    setTimeout(initialiseUtilities, 500);



    setTimeout(initialiseCallbacks, 500);



})();

