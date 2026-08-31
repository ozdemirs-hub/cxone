function testCXoneFields() {

    var postcode = document.getElementById('4');
    var product = document.getElementById('product_type');

    if (!postcode || !product) {
        return;
    }

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

    if (postcode.value.trim() === '1234' || postcode.value.trim() === '4321') {

        utilities.disabled = true;

        if (product.value === 'Utilities') {
            product.value = '';
        }

    } else {

        utilities.disabled = false;

    }
}
