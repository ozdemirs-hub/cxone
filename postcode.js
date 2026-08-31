(function () {

    function initialisePostcodeRestriction() {

        var postcodeField = document.getElementById('4');
        var productType = document.getElementById('product_type');

        if (!postcodeField || !productType) {
            return;
        }

        function checkPostcode() {

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

            if (postcode === '1234' || postcode === '4321') {

                utilitiesOption.disabled = true;

                if (productType.value === 'Utilities') {
                    productType.value = '';
                }

            } else {

                utilitiesOption.disabled = false;

            }
        }

        postcodeField.addEventListener('input', checkPostcode);
        postcodeField.addEventListener('change', checkPostcode);

        checkPostcode();
    }


    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            initialisePostcodeRestriction
        );

    } else {

        initialisePostcodeRestriction();

    }

})();
