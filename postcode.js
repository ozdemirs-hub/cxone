(function () {



    var utilitiesPostcodes = [];



    var JSON_URL = 'https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json';





    function getFields() {



        return {

            state: document.getElementById('3'),

            postcode: document.getElementById('4'),



            utilities: document.getElementById('product_utilities'),

            ovc: document.getElementById('product_ovc'),



            callbackUtilitiesGroup:

                document.getElementById('callback_datetime_utilities_group'),



            callbackOvcGroup:

                document.getElementById('callback_datetime_ovc_group')

        };



    }





    function postcodeIsApproved(postcode) {



        for (var i = 0; i < utilitiesPostcodes.length; i++) {



            if (String(utilitiesPostcodes[i]).trim() === postcode) {



                return true;



            }



        }



        return false;



    }





    function updateUtilities() {



        var fields = getFields();



        if (!fields.state ||

            !fields.postcode ||

            !fields.utilities) {



            return;



        }





        var state = fields.state.value.trim().toUpperCase();



        var postcode = fields.postcode.value.trim();





        /*

         * NSW and VIC are never allowed.

         */



        if (state === 'NSW' || state === 'VIC') {



            fields.utilities.disabled = true;

            fields.utilities.checked = false;



            updateCallback();



            return;



        }





        /*

         * Check postcode against JSON.

         */



        if (postcodeIsApproved(postcode)) {



            fields.utilities.disabled = false;



        } else {



            fields.utilities.disabled = true;

            fields.utilities.checked = false;



        }





        updateCallback();



    }





    function updateCallback() {



        var fields = getFields();



        if (!fields.callbackUtilitiesGroup ||

            !fields.callbackOvcGroup) {



            return;



        }





        /*

         * OVC callback section

         */



        if (fields.ovc && fields.ovc.checked) {



            fields.callbackOvcGroup.style.display = '';



        } else {



            fields.callbackOvcGroup.style.display = 'none';



        }





        /*

         * Utilities callback section

         */



        if (fields.utilities && fields.utilities.checked) {



            fields.callbackUtilitiesGroup.style.display = '';



        } else {



            fields.callbackUtilitiesGroup.style.display = 'none';



        }



    }





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



                updateUtilities();



            })



            .catch(function (error) {



                console.log(

                    'ERROR loading Utilities postcode JSON: ' +

                    error.message

                );



            });



    }





    function initialise() {



        var fields = getFields();





        /*

         * Wait for CXone form fields.

         */



        if (!fields.state ||

            !fields.postcode ||

            !fields.utilities ||

            !fields.ovc ||

            !fields.callbackUtilitiesGroup ||

            !fields.callbackOvcGroup) {



            setTimeout(initialise, 500);



            return;



        }





        /*

         * Initially hide BOTH callback sections.

         */



        updateCallback();





        /*

         * State changes.

         */



        fields.state.addEventListener('input', function () {



            updateUtilities();



        });





        fields.state.addEventListener('change', function () {



            updateUtilities();



        });





        /*

         * Postcode changes.

         */



        fields.postcode.addEventListener('input', function () {



            updateUtilities();



        });





        fields.postcode.addEventListener('change', function () {



            updateUtilities();



        });





        /*

         * OVC checkbox changes.

         */



        fields.ovc.addEventListener('change', function () {



            updateCallback();



        });





        /*

         * Utilities checkbox changes.

         */



        fields.utilities.addEventListener('change', function () {



            updateCallback();



        });





        /*

         * Load postcode list.

         */



        loadJSON();



    }





    setTimeout(initialise, 500);



})();
