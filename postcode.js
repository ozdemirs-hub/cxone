(function () {

    var utilitiesPostcodes = [];

    var JSON_URL = 'https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json';


    function getFields() {

        return {
            state: document.getElementById('3'),
            postcode: document.getElementById('4'),
            utilities: document.getElementById('product_utilities'),
            ovc: document.getElementById('product_ovc'),
            callbackGroupUtilities: document.getElementById('callback_datetime_utilities_group')
			callbackGroupOVC: document.getElementById('callback_datetime_ovc_group')
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

    }


    function updateUtilitiesCallback() {

        var fields = getFields();

        if (!fields.callbackGroupUtilities) {
            return;
        }

        var showCallback = false;

        if (fields.utilities && fields.utilities.checked) {
            showCallback = true;
        }


        if (showCallback) {

            fields.callbackGroupUtilities.style.display = '';

        } else {

            fields.callbackGroupUtilities.style.display = 'none';

        }

    }
	
	function updateOVCCallback() {

        var fields = getFields();

        if (!fields.callbackGroupOVC) {
            return;
        }

        var showCallback = false;

        if (fields.ovc && fields.ovc.checked) {
            showCallback = true;
        }


        if (showCallback) {

            fields.callbackGroupOVC.style.display = '';

        } else {

            fields.callbackGroupOVC.style.display = 'none';

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
            !fields.callbackGroupUtilities) {

            setTimeout(initialise, 500);

            return;

        }


        /*
         * Initially hide Callback.
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
         * Product changes.
         */

        fields.ovc.addEventListener('change', function () {

            updateCallback();

        });


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
