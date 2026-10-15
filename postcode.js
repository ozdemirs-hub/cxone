var utilitiesPostcodes = [];
var JSON_URL = 'https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json';

function getFields() {
    return {
        state: document.getElementById('3'),
        postcode: document.getElementById('4'),
        utilities: document.getElementById('product_utilities'),
        ovc: document.getElementById('product_ovc'),
        health: document.getElementById('product_health'),
        callbackGroupUtilities: document.getElementById('callback_datetime_utilities_group'),
        callbackUtilities: document.getElementById('callback_datetime_utilities'),
        callbackGroupOVC: document.getElementById('callback_datetime_ovc_group'),
        callbackOVC: document.getElementById('callback_datetime_ovc')
    };
}

function postcodeIsApproved(postcode) {
    for (var i = 0; i < utilitiesPostcodes.length; i++) {
        if (String(utilitiesPostcodes[i]).trim() === postcode) {
            return true;
        }
    }
    return false;
}

// Product checkbox logic:
// Health and OVC cannot be selected together.
// Utilities remains independent, subject to eligibility.
function updateProductSelection(changedCheckbox) {
    var fields = getFields();

    if (!fields.health || !fields.ovc || !fields.utilities) {
        return;
    }

    if (changedCheckbox === fields.ovc && fields.ovc.checked) {
        fields.health.checked = false;
    }

    if (changedCheckbox === fields.health && fields.health.checked) {
        fields.ovc.checked = false;
    }

    updateCallbackOVC();
    updateCallbackUtilities();
}

function updateUtilities() {
    var fields = getFields();

    if (!fields.state || !fields.postcode || !fields.utilities) {
        return;
    }

    var state = String(fields.state.value || '')
        .trim()
        .toUpperCase();

    var postcode = String(fields.postcode.value || '').trim();

    // Utilities is allowed to be considered only in these states
    // and territory, subject to the approved postcode list.
    var allowedStates = ['NSW', 'ACT', 'QLD', 'SA', 'VIC'];

    // Disable Utilities for NT, TAS, WA and any unrecognised
    // or blank state value.
    if (allowedStates.indexOf(state) === -1) {
        fields.utilities.disabled = true;
        fields.utilities.checked = false;
        updateCallbackUtilities();
        return;
    }

    // For NSW, ACT, QLD, SA and VIC, check the postcode list.
    // A valid postcode enables the checkbox but does not
    // automatically select it.
    if (postcodeIsApproved(postcode)) {
        fields.utilities.disabled = false;
    } else {
        fields.utilities.disabled = true;
        fields.utilities.checked = false;
    }

    updateCallbackUtilities();
}

function updateCallbackUtilities() {
    var fields = getFields();

    if (!fields.callbackGroupUtilities) {
        return;
    }

    if (fields.utilities &&
        fields.utilities.checked &&
        !fields.utilities.disabled) {

        fields.callbackGroupUtilities.style.display = 'block';

    } else {
        fields.callbackGroupUtilities.style.display = 'none';

        if (fields.callbackUtilities) {
            fields.callbackUtilities.value = '';
        }
    }
}

function updateCallbackOVC() {
    var fields = getFields();

    if (!fields.callbackGroupOVC) {
        return;
    }

    if (fields.ovc && fields.ovc.checked) {
        fields.callbackGroupOVC.style.display = 'block';
    } else {
        fields.callbackGroupOVC.style.display = 'none';

        if (fields.callbackOVC) {
            fields.callbackOVC.value = '';
        }
    }
}

function loadJSON() {
    fetch(JSON_URL)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }

            return response.json();
        })
        .then(function (data) {
            utilitiesPostcodes = data;
            updateUtilities();
        })
        .catch(function (error) {
            console.log(
                'ERROR loading Utilities postcode JSON: ' +
                error.message
            );
        });
}

function initialise() {
    var fields = getFields();

    if (!fields.state ||
        !fields.postcode ||
        !fields.utilities ||
        !fields.ovc ||
        !fields.health ||
        !fields.callbackGroupUtilities ||
        !fields.callbackGroupOVC) {

        setTimeout(initialise, 500);
        return;
    }

    // Initial state
    fields.health.checked = true;
    fields.ovc.checked = false;
    fields.utilities.disabled = true;
    fields.utilities.checked = false;

    fields.callbackGroupUtilities.style.display = 'none';
    fields.callbackGroupOVC.style.display = 'none';

    // Recheck Utilities eligibility when state or postcode changes
    fields.state.addEventListener('input', function () {
        updateUtilities();
    });

    fields.state.addEventListener('change', function () {
        updateUtilities();
    });

    fields.postcode.addEventListener('input', function () {
        updateUtilities();
    });

    fields.postcode.addEventListener('change', function () {
        updateUtilities();
    });

    // Product checkbox logic
    fields.health.addEventListener('change', function () {
        updateProductSelection(fields.health);
    });

    fields.ovc.addEventListener('change', function () {
        updateProductSelection(fields.ovc);
    });

    fields.utilities.addEventListener('change', function () {
        updateCallbackUtilities();
    });

    // Load approved Utilities postcodes
    loadJSON();
}

setTimeout(initialise, 500);
