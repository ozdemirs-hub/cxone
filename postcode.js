(function () {

    var utilitiesPostcodes = [];
    var postcodeLoaded = false;


    function getFields() {

        return {
            state: document.getElementById('3'),
            postcode: document.getElementById('4'),

            health: document.getElementById('product_health'),
            ovc: document.getElementById('product_ovc'),
            utilities: document.getElementById('product_utilities'),

            callbackGroup: document.getElementById('callback_datetime_group'),
            callback: document.getElementById('callback_datetime')
        };

    }


    function openCallbackPicker() {

        var fields = getFields();

        if (!fields.callback) {
            return;
        }

        if (fields.callbackGroup.style.display === 'none') {
            return;
        }

        fields.callback.focus();

        try {
            fields.callback.showPicker();
        } catch (e) {
            fields.callback.click();
        }

    }


    function updateCallbackVisibility(openPicker) {

        var fields = getFields();

        if (!fields.callbackGroup) {
            return;
        }

        var showCallback = false;

        if (fields.ovc && fields.ovc.checked) {
            showCallback = true;
        }

        if (fields.utilities && fields.utilities.checked) {
            showCallback = true;
        }


        if (showCallback) {

            fields.callbackGroup.style.display = '';

            if (openPicker) {
                openCallbackPicker();
            }

        } else {

            fields.callbackGroup.style.display = 'none';

            if (fields.callback) {
                fields.callback.value = '';
            }

        }

    }


    function updateUtilitiesAvailability() {

        var fields = getFields();

        if (!fields.state ||
            !fields.postcode ||
            !fields.utilities) {
            return;
        }


        var state = fields.state.value.trim().toUpperCase();
        var postcode = fields.postcode.value.trim();

        var utilitiesAllowed = true;


        /*
         * Utilities is NOT available in NSW or VIC
         */

        if (state === 'NSW' || state === 'VIC') {
            utilitiesAllowed = false;
        }


        /*
         * If postcode list has loaded,
         * postcode must exist in the approved list.
         */

        if (postcodeLoaded) {

            var postcodeFound = false;

            for (var i = 0; i < utilitiesPostcodes.length; i++) {

                if (String(utilitiesPostcodes[i]).trim() === postcode) {

                    postcodeFound = true;
                    break;

                }

            }


            if (!postcodeFound) {
                utilitiesAllowed = false;
            }

        }


        /*
         * Enable or disable Utilities
         */

        if (utilitiesAllowed) {

            fields.utilities.disabled = false;

        } else {

            fields.utilities.disabled = true;
            fields.utilities.checked = false;

        }


        updateCallbackVisibility(false);

    }


    function loadUtilitiesPostcodes() {

        fetch('https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json')

            .then(function (response) {

                if (!response.ok) {
                    throw new Error('Unable to load utilities-postcodes.json');
                }

                return response.json();

            })

            .then(function (data) {

                utilitiesPostcodes = data;
                postcodeLoaded = true;

                updateUtilitiesAvailability();

            })

            .catch(function (error) {

                postcodeLoaded = true;
                utilitiesPostcodes = [];

                updateUtilitiesAvailability();

            });

    }


    function initialise() {

        var fields = getFields();


        /*
         * Wait until CXone has created the form fields.
         */

        if (!fields.state ||
            !fields.postcode ||
            !fields.health ||
            !fields.ovc ||
            !fields.utilities ||
            !fields.callbackGroup ||
            !fields.callback) {

            setTimeout(initialise, 500);

            return;
        }


        /*
         * OVC checkbox
         */

        fields.ovc.addEventListener('change', function () {

            updateCallbackVisibility(true);

        });


        /*
         * Utilities checkbox
         */

        fields.utilities.addEventListener('change', function () {

            updateCallbackVisibility(true);

        });


        /*
         * Health checkbox
         */

        fields.health.addEventListener('change', function () {

            updateCallbackVisibility(false);

        });


        /*
         * State changes
         */

        fields.state.addEventListener('input', function () {

            updateUtilitiesAvailability();

        });


        fields.state.addEventListener('change', function () {

            updateUtilitiesAvailability();

        });


        /*
         * Postcode changes
         */

        fields.postcode.addEventListener('input', function () {

            updateUtilitiesAvailability();

        });


        fields.postcode.addEventListener('change', function () {

            updateUtilitiesAvailability();

        });


        /*
         * Initial state:
         * Health selected, callback hidden.
         */

        updateCallbackVisibility(false);


        /*
         * Load approved Utilities postcodes.
         */

        loadUtilitiesPostcodes();

    }


    /*
     * CXone may need a short time to create the form.
     */

    setTimeout(initialise, 500);

})();
