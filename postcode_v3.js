var utilitiesPostcodes = [];

var JSON_URL = 'https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json';


// ============================================================
// GET FORM FIELDS
// ============================================================

function getFields() {

    return {
        state: document.getElementById('3'),
        postcode: document.getElementById('4'),

        utilities: document.getElementById('product_utilities'),
        ovc: document.getElementById('product_ovc'),
        health: document.getElementById('product_health'),

        callbackGroupUtilities:
            document.getElementById('callback_datetime_utilities_group'),

        callbackUtilities:
            document.getElementById('callback_datetime_utilities'),

        callbackGroupOVC:
            document.getElementById('callback_datetime_ovc_group'),

        callbackOVC:
            document.getElementById('callback_datetime_ovc')
    };

}


// ============================================================
// CHECK POSTCODE
// ============================================================

function postcodeIsApproved(postcode) {

    for (var i = 0; i < utilitiesPostcodes.length; i++) {

        if (String(utilitiesPostcodes[i]).trim() === postcode) {

            return true;

        }

    }

    return false;

}


// ============================================================
// UPDATE UTILITIES AVAILABILITY
// ============================================================

function updateUtilities() {

    var fields = getFields();

    if (!fields.state ||
        !fields.postcode ||
        !fields.utilities) {

        return;

    }


    var state =
        String(fields.state.value || '').trim().toUpperCase();

    var postcode =
        String(fields.postcode.value || '').trim();


    // --------------------------------------------------------
    // NSW and VIC are NEVER allowed
    // --------------------------------------------------------

    if (state === 'NSW' || state === 'VIC') {

        fields.utilities.disabled = true;
        fields.utilities.checked = false;

        updateCallbackUtilities();

        return;

    }


    // --------------------------------------------------------
    // Check postcode against JSON list
    // --------------------------------------------------------

    if (postcodeIsApproved(postcode)) {

        fields.utilities.disabled = false;

    } else {

        fields.utilities.disabled = true;
        fields.utilities.checked = false;

    }


    // --------------------------------------------------------
    // Update callback visibility after Utilities changes
    // --------------------------------------------------------

    updateCallbackUtilities();

}


// ============================================================
// UTILITIES CALLBACK VISIBILITY
// ============================================================

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

        // Clear value when hidden
        if (fields.callbackUtilities) {

            fields.callbackUtilities.value = '';

        }

    }

}


// ============================================================
// OVC CALLBACK VISIBILITY
// ============================================================

function updateCallbackOVC() {

    var fields = getFields();

    if (!fields.callbackGroupOVC) {

        return;

    }


    if (fields.ovc &&
        fields.ovc.checked) {

        fields.callbackGroupOVC.style.display = 'block';

    } else {

        fields.callbackGroupOVC.style.display = 'none';

        // Clear value when hidden
        if (fields.callbackOVC) {

            fields.callbackOVC.value = '';

        }

    }

}


// ============================================================
// LOAD POSTCODE JSON
// ============================================================

function loadJSON() {

    fetch(JSON_URL)

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    'HTTP error ' + response.status
                );

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


// ============================================================
// INITIALISE
// ============================================================

function initialise() {

    var fields = getFields();


    // --------------------------------------------------------
    // Wait for CXone form fields
    // --------------------------------------------------------

    if (!fields.state ||
        !fields.postcode ||
        !fields.utilities ||
        !fields.ovc ||
        !fields.callbackGroupUtilities ||
        !fields.callbackGroupOVC) {

        setTimeout(initialise, 500);

        return;

    }


    // ========================================================
    // INITIAL STATE
    // ========================================================

    // Health is selected by default
    if (fields.health) {

        fields.health.checked = true;

    }


    // Utilities is disabled until postcode is validated
    fields.utilities.disabled = true;
    fields.utilities.checked = false;


    // Both callback sections hidden initially
    fields.callbackGroupUtilities.style.display = 'none';
    fields.callbackGroupOVC.style.display = 'none';


    // ========================================================
    // STATE CHANGE
    // ========================================================

    fields.state.addEventListener('input', function () {

        updateUtilities();

    });


    fields.state.addEventListener('change', function () {

        updateUtilities();

    });


    // ========================================================
    // POSTCODE CHANGE
    // ========================================================

    fields.postcode.addEventListener('input', function () {

        updateUtilities();

    });


    fields.postcode.addEventListener('change', function () {

        updateUtilities();

    });


    // ========================================================
    // OVC CHECKBOX
    // ========================================================

    fields.ovc.addEventListener('change', function () {

        updateCallbackOVC();

    });


    // ========================================================
    // UTILITIES CHECKBOX
    // ========================================================

    fields.utilities.addEventListener('change', function () {

        updateCallbackUtilities();

    });


    // ========================================================
    // LOAD POSTCODE LIST
    // ========================================================

    loadJSON();

}


// ============================================================
// START
// ============================================================

setTimeout(initialise, 500);
