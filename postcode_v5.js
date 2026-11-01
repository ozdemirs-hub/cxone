//version v5
(function () {
    var utilitiesPostcodes = [];
    var postcodeListLoaded = false;
    var initialised = false;

    var JSON_URL =
        'https://ozdemirs-hub.github.io/cxone/utilities-postcodes.json';

    var ALLOWED_STATES = ['NSW', 'ACT', 'QLD', 'SA', 'VIC'];

    function getFields() {
        return {
            state: document.getElementById('3'),
            postcode: document.getElementById('4'),
            health: document.getElementById('product_health'),
            ovc: document.getElementById('product_ovc'),
            utilities: document.getElementById('product_utilities'),
            callbackUtilitiesGroup: document.getElementById(
                'callback_datetime_utilities_group'
            ),
            callbackUtilities: document.getElementById(
                'callback_datetime_utilities'
            ),
            callbackOVCGroup: document.getElementById(
                'callback_datetime_ovc_group'
            ),
            callbackOVC: document.getElementById(
                'callback_datetime_ovc'
            )
        };
    }

    function isApprovedPostcode(postcode) {
        for (var i = 0; i < utilitiesPostcodes.length; i++) {
            if (String(utilitiesPostcodes[i]).trim() === postcode) {
                return true;
            }
        }
        return false;
    }

    function updateUtilities() {
        var f = getFields();

        if (!f.utilities || !f.state || !f.postcode) {
            return;
        }

        var state = String(f.state.value || '')
            .trim()
            .toUpperCase();

        var postcode = String(f.postcode.value || '').trim();

        // Always disable first. Enable only after all checks pass.
        f.utilities.disabled = true;

        var stateAllowed = false;

        for (var i = 0; i < ALLOWED_STATES.length; i++) {
            if (state === ALLOWED_STATES[i]) {
                stateAllowed = true;
                break;
            }
        }

        // Forbidden, blank or unrecognised state:
        // disable and uncheck Utilities.
        if (!stateAllowed) {
            f.utilities.checked = false;
            updateCallbackUtilities();
            return;
        }

        // Do not enable Utilities until the postcode list has loaded.
        if (!postcodeListLoaded) {
            f.utilities.checked = false;
            updateCallbackUtilities();
            return;
        }

        // State must be allowed AND postcode must be approved.
        if (isApprovedPostcode(postcode)) {
            f.utilities.disabled = false;
        } else {
            f.utilities.checked = false;
        }

        updateCallbackUtilities();
    }

    function updateCallbackUtilities() {
        var f = getFields();

        if (!f.callbackUtilitiesGroup) {
            return;
        }

        if (f.utilities &&
            f.utilities.checked &&
            !f.utilities.disabled) {

            f.callbackUtilitiesGroup.style.display = 'block';
        } else {
            f.callbackUtilitiesGroup.style.display = 'none';

            if (f.callbackUtilities) {
                f.callbackUtilities.value = '';
            }
        }
    }

    function updateCallbackOVC() {
        var f = getFields();

        if (!f.callbackOVCGroup) {
            return;
        }

        if (f.ovc && f.ovc.checked) {
            f.callbackOVCGroup.style.display = 'block';
        } else {
            f.callbackOVCGroup.style.display = 'none';

            if (f.callbackOVC) {
                f.callbackOVC.value = '';
            }
        }
    }

    function updateProductSelection(changedCheckbox) {
        var f = getFields();

        if (!f.health || !f.ovc) {
            return;
        }

        // Health and OVC cannot be selected together.
        if (changedCheckbox === f.ovc && f.ovc.checked) {
            f.health.checked = false;
        }

        if (changedCheckbox === f.health && f.health.checked) {
            f.ovc.checked = false;
        }

        updateCallbackOVC();
        updateCallbackUtilities();
        updateUtilities();
    }

    function loadPostcodes() {
        fetch(JSON_URL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }

                return response.json();
            })
            .then(function (data) {
                if (!Array.isArray(data)) {
                    throw new Error(
                        'Postcode JSON must contain an array'
                    );
                }

                utilitiesPostcodes = data;
                postcodeListLoaded = true;

                updateUtilities();

                console.log(
                    'Utilities postcode list loaded:',
                    utilitiesPostcodes.length
                );
            })
            .catch(function (error) {
                // Fail safely: Utilities remains disabled.
                postcodeListLoaded = false;

                var f = getFields();

                if (f.utilities) {
                    f.utilities.disabled = true;
                    f.utilities.checked = false;
                }

                updateCallbackUtilities();

                console.log(
                    'Utilities postcode list failed to load:',
                    error.message
                );
            });
    }

    function initialise() {
        var f = getFields();

        // Wait until the CXone form fields exist.
        if (!f.state || !f.postcode || !f.health ||
            !f.ovc || !f.utilities ||
            !f.callbackUtilitiesGroup || !f.callbackOVCGroup) {

            setTimeout(initialise, 500);
            return;
        }

        if (initialised) {
            return;
        }

        initialised = true;

        // Set the initial product selections.
        f.health.checked = true;
        f.ovc.checked = false;

        // Utilities MUST start disabled.
        f.utilities.disabled = true;
        f.utilities.checked = false;

        // Hide both callback sections initially.
        f.callbackUtilitiesGroup.style.display = 'none';
        f.callbackOVCGroup.style.display = 'none';

        // Recheck eligibility whenever state or postcode changes.
        f.state.addEventListener('input', updateUtilities);
        f.state.addEventListener('change', updateUtilities);
        f.postcode.addEventListener('input', updateUtilities);
        f.postcode.addEventListener('change', updateUtilities);

        // Preserve the existing Health/OVC checkbox behaviour.
        f.health.addEventListener('change', function () {
            updateProductSelection(f.health);
        });

        f.ovc.addEventListener('change', function () {
            updateProductSelection(f.ovc);
        });

        f.utilities.addEventListener('change', function () {
            updateCallbackUtilities();
        });

        // Enforce the disabled state before starting the download.
        updateUtilities();

        // Load the approved postcode list.
        loadPostcodes();
    }

    setTimeout(initialise, 500);
})();
