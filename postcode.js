(function () {

    var utilitiesPostcodes = null;


    function checkUtilities() {

        var postcodeField = document.getElementById('4');
        var stateField = document.getElementById('3');
        var productType = document.getElementById('product_type');

        if (!postcodeField || !stateField || !productType) {
            return;
        }


        var postcode = postcodeField.value.trim();
        var state = stateField.value.trim().toUpperCase();


        var utilitiesOption = null;

        for (var i = 0; i < productType.options.length; i++) {

            if (productType.options[i].value === 'Utilities') {
                utilitiesOption = productType.options[i];
                break;
            }

        }


        if (!utilitiesOption) {
            return;
        }


        /*
         * RULE 1:
         * NSW and VIC can never select Utilities.
         */

        if (state === 'NSW' || state === 'VIC') {

            utilitiesOption.disabled = true;

            if (productType.value === 'Utilities') {
                productType.value = '';
            }

            return;
        }


        /*
         * RULE 2:
         * If postcode list has not loaded yet,
         * keep Utilities disabled.
         */

        if (!utilitiesPostcodes) {

            utilitiesOption.disabled = true;

            if (productType.value === 'Utilities') {
                productType.value = '';
            }

            return;
        }


        /*
         * RULE 3:
         * For all other states, Utilities is enabled
         * only when the postcode exists in the list.
         */

        var utilitiesAllowed = false;

        for (var i = 0; i < utilitiesPostcodes.length; i++) {

            if (utilitiesPostcodes[i] === postcode) {
                utilitiesAllowed = true;
                break;
            }

        }


        if (utilitiesAllowed) {

            utilitiesOption.disabled = false;

        } else {

            utilitiesOption.disabled = true;

            if (productType.value === 'Utilities') {
                productType.value = '';
            }

        }

    }


    function loadPostcodes() {

        fetch('https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/utilities-postcodes.json')
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


        /*
         * Check whenever postcode changes.
         */

        postcodeField.addEventListener('input', checkUtilities);
        postcodeField.addEventListener('change', checkUtilities);


        /*
         * Check whenever state changes.
         */

        stateField.addEventListener('input', checkUtilities);
        stateField.addEventListener('change', checkUtilities);


        /*
         * Load postcode list from GitHub.
         */

        loadPostcodes();

    }


    setTimeout(initialise, 500);

})();
