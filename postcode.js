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


    function updateCallbackVisibility() {

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
        } else {
            fields.callbackGroup.style.display = 'none';

            if (fields.callback) {
                fields.callback.value = '';
            }
        }

    }


    function updateUtilitiesAvailability() {

        var fields = getFields();

        if (!fields.state || !fields.postcode || !fields.utilities) {
            return;
        }

        var state = fields.state.value.trim().toUpperCase();
        var postcode = fields.postcode.value.trim();

        var utilitiesAllowed = true;

        if (state === 'NSW' || state === 'VIC') {
            utilitiesAllowed = false;
        }

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

        if (utilitiesAllowed) {

            fields.utilities.disabled = false;

        } else {

            fields.utilities.disabled = true;
            fields.utilities.checked = false;

        }

        updateCallbackVisibility();

    }


    function loadUtilitiesPostcodes() {

        fetch('utilities-postcodes.json')
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

        if (!fields.state ||
            !fields.postcode ||
            !fields.health ||
            !fields.ovc ||
            !fields.utilities ||
            !fields.callbackGroup) {

            setTimeout(initialise, 500);
            return;
        }

        fields.health.addEventListener('change', function () {
            updateCallbackVisibility();
        });

        fields.ovc.addEventListener('change', function () {
            updateCallbackVisibility();
        });

        fields.utilities.addEventListener('change', function () {
            updateCallbackVisibility();
        });

        fields.state.addEventListener('input', function () {
            updateUtilitiesAvailability();
        });

        fields.state.addEventListener('change', function () {
            updateUtilitiesAvailability();
        });

        fields.postcode.addEventListener('input', function () {
            updateUtilitiesAvailability();
        });

        fields.postcode.addEventListener('change', function () {
            updateUtilitiesAvailability();
        });

        updateCallbackVisibility();

        loadUtilitiesPostcodes();

    }


    setTimeout(initialise, 500);

})();
