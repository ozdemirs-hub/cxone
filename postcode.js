function testCXoneFields() {

    var postcode = document.getElementById('4');
    var product = document.getElementById('product_type');

    if (postcode && product) {
            postcode.value = 'FOUND BOTH';
    }
}
