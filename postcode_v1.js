(function () {

    var utilitiesPostcodes = null;
    var utilitiesOption = null;


    function checkUtilities() {

        var postcodeField = document.getElementById('4');
        var stateField = document.getElementById('3');
        var productType = document.getElementById('product_type');

        if (!postcodeField || !stateField || !productType) {
            return;
        }


        var postcode = postcodeField.value.trim();
        var state = stateField.value.trim().toUpperCase();


        /*
         * Find Utilities option the first time.
         */

        if (!utilitiesOption) {

            for (var i = 0; i < productType.options.length; i++) {

                if (productType.options[i].value === 'Utilities') {

                    utilitiesOption = productType.options[i];
                    break;

                }

            }

        }


        if (!utilitiesOption) {
            return;
        }


        /*
         * Determine whether Utilities is allowed.
         */

        var utilitiesAllowed = false;


        /*
         * NSW and VIC:
         * Utilities is never allowed.
         */

        if (state === 'NT' || state === 'TAS' || state === 'WA') {

            utilitiesAllowed = false;

        }


        /*
         * Other states:
         * Utilities is allowed only if postcode
         * exists in the postcode list.
         */

        else if (utilitiesPostcodes) {

            for (var i = 0; i < utilitiesPostcodes.length; i++) {

                if (utilitiesPostcodes[i] === postcode) {

                    utilitiesAllowed = true;
                    break;

                }

            }

        }


        /*
         * Show or hide Utilities.
         */

        if (utilitiesAllowed) {

            if (!utilitiesOption.parentNode) {

                productType.appendChild(utilitiesOption);

            }

        }

        else {

            if (productType.value === 'Utilities') {

                productType.value = '';

            }

            if (utilitiesOption.parentNode) {

                utilitiesOption.parentNode.removeChild(utilitiesOption);

            }

        }

    }


    function loadPostcodes() {

        fetch('https://asset.compareclub.com.au/energy/utilities-postcodes.json')

            .then(function (response) {

                return response.json();

            })

            .then(function (data) {

                utilitiesPostcodes = data;

                checkUtilities();

            })

            .catch(function () {

                utilitiesPostcodes = [];

                checkUtilities();

            });

    }


    function initialise() {

        var postcodeField = document.getElementById('4');
        var stateField = document.getElementById('3');

        if (!postcodeField || !stateField) {
            return;
        }


        postcodeField.addEventListener(
            'input',
            checkUtilities
        );

        postcodeField.addEventListener(
            'change',
            checkUtilities
        );


        stateField.addEventListener(
            'input',
            checkUtilities
        );

        stateField.addEventListener(
            'change',
            checkUtilities
        );


        loadPostcodes();

    }


    setTimeout(initialise, 500);

})();
