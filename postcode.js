(function () {

    var utilitiesPostcodes = null;

    function checkPostcode() {

        var postcodeField = document.getElementById('4');
        var productType = document.getElementById('product_type');

        if (!postcodeField || !productType) {
            return;
        }

        var postcode = postcodeField.value.trim();

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
         * Until the postcode file has loaded,
         * Utilities remains disabled.
         */
        if (!utilitiesPostcodes) {
            utilitiesOption.disabled = true;

            if (productType.value === 'Utilities') {
                productType.value = '';
            }

            return;
        }

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

                checkPostcode();

            })
            .catch(function () {

                utilitiesPostcodes = [];

                checkPostcode();

            });

    }


    function initialise() {

        var postcodeField = document.getElementById('4');

        if (!postcodeField) {
            return;
        }

        postcodeField.addEventListener('input', checkPostcode);
        postcodeField.addEventListener('change', checkPostcode);

        loadPostcodes();

    }


    setTimeout(initialise, 500);

})();
