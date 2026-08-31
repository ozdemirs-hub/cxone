(function () {

    function checkPostcode() {

        var postcode = document.getElementById('4');
        var product = document.getElementById('product_type');

        if (!postcode || !product) {
            return;
        }

        var postcodeValue = postcode.value.trim();

        var utilities = null;

        for (var i = 0; i < product.options.length; i++) {

            if (product.options[i].value === 'Utilities') {
                utilities = product.options[i];
                break;
            }

        }

        if (!utilities) {
            return;
        }

        if (postcodeValue === '1234' || postcodeValue === '4321') {

            utilities.disabled = true;

            if (product.value === 'Utilities') {
                product.value = '';
            }

        } else {

            utilities.disabled = false;

        }

    }


    function initialise() {

        var postcode = document.getElementById('4');

        if (!postcode) {
            return;
        }

        postcode.addEventListener('input', checkPostcode);
        postcode.addEventListener('change', checkPostcode);

        checkPostcode();

    }


    setTimeout(initialise, 500);

})();
