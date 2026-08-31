function checkPostcode() {
    var postcode = document.getElementById('4').value.trim();
    var productType = document.getElementById('product_type');

    if (postcode === '1234' || postcode === '4321') {
        productType.options[3].disabled = true;

        if (productType.value === 'Utilities') {
            productType.value = '';
        }
    } else {
        productType.options[3].disabled = false;
    }
}
