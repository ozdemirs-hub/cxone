// ============================================================
// NICE CXone Custom Form
// Dynamic Self-Contained Callback Calendar + Time
// ============================================================


// ============================================================
// Stylesheet links
// ============================================================

html.append("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css' integrity='sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==' crossorigin='anonymous'>")
html.append("<link rel='stylesheet' href='//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css'>")


// ============================================================
// JavaScript
// ============================================================

html.append("<script>")


// ============================================================
// Business field
// ============================================================

html.append("function toggleBusinessField(){{")

html.append(" var accountType=document.getElementById('account_type').value;")
html.append(" var group=document.getElementById('business_name_group');")
html.append(" var field=document.getElementById('business_name');")

html.append(" if(accountType==='Business'){{")
html.append("  group.style.display='block';")
html.append("  field.required=true;")
html.append(" }}else{{")
html.append("  group.style.display='none';")
html.append("  field.required=false;")
html.append("  field.value='';")
html.append(" }}")

html.append("}")


// ============================================================
// End JavaScript
// ============================================================

html.append("</script>")

// ============================================================
// External JavaScript - Postcode restriction
// ============================================================

html.append("<script type='text/javascript' src='https://ozdemirs-hub.github.io/cxone/postcode.js'></script>")

// ============================================================
// FORM CONTAINER
// ============================================================

html.append("<div class='container'>")


// ============================================================
// TOP MESSAGE
// ============================================================

html.append("<div class='alert alert-info' role='alert'>")
html.append(" {wfdScript}")
html.append("</div>")


// ============================================================
// FIRST NAME
// ============================================================

html.append("<div class='form-group'>")

html.append(" <label class='control-label' style='font-weight:bold; color:red;'>First Name*:</label>")

html.append(" <input type='text' class='form-control input-sm' id='1' name='scout_first_name' value='' required>")

html.append("</div>")


// ============================================================
// LAST NAME
// ============================================================

html.append("<div class='form-group'>")

html.append(" <label class='control-label' style='font-weight:bold; color:red;'>Surname*:</label>")

html.append(" <input type='text' class='form-control input-sm' id='2' name='scout_last_name' value='' required>")

html.append("</div>")


// ============================================================
// STATE
// ============================================================

html.append("<div class='form-group'>")

html.append(" <label class='control-label'>State:</label>")

html.append(" <input type='text' class='form-control input-sm' id='3' name='scout_state' value=''>")

html.append("</div>")


// ============================================================
// POSTCODE
// ============================================================

html.append("<div class='row'>")

html.append("<div class='col-sm-6'>")
html.append("<div class='form-group'>")

html.append(" <label class='control-label'>Postcode:</label>")

html.append(" <input type='text' class='form-control input-sm' id='4' name='scout_postcode' value=''>")

html.append("</div>")

html.append("</div>")

html.append("</div>")


// ============================================================
// PHONE
// ============================================================

html.append("<div class='form-group'>")

html.append(" <label class='control-label'>Phone:</label>")

html.append(" <input type='text' class='form-control input-sm' id='5' name='scout_phone_number' value='{global:ANI}' readonly>")

html.append("</div>")


// ============================================================
// EMAIL
// ============================================================

html.append("<div class='form-group'>")

html.append(" <label class='control-label'>Email:</label>")

html.append(" <input type='text' class='form-control input-sm' id='6' name='scout_email' value=''>")

html.append("</div>")


// ============================================================
// TRANSFER ID
// ============================================================

html.append("<div class='form-group'>")

html.append(" <label class='control-label'>Transfer ID:</label>")

html.append(" <input type='text' class='form-control input-sm' name='transfer_id' value='{_ScoutTransferID}' readonly>")

html.append("</div>")


// ============================================================
// PRODUCT TYPE
// ============================================================

html.append("<div class='form-group'>")

html.append(" <label class='control-label' style='font-weight:bold; color:red;'>Product Type*:</label>")

html.append(" <div class='checkbox'>")
html.append("  <label>")
html.append("   <input type='checkbox' id='product_health' name='product_type' value='Health' checked>")
html.append("   Health Sales")
html.append("  </label>")
html.append(" </div>")

html.append(" <div class='checkbox'>")
html.append("  <label>")
html.append("   <input type='checkbox' id='product_ovc' name='product_type' value='OVC'>")
html.append("   OVC")
html.append("  </label>")
html.append(" </div>")

html.append(" <div class='checkbox'>")
html.append("  <label>")
html.append("   <input type='checkbox' id='product_utilities' name='product_type' value='Utilities'>")
html.append("   Utilities")
html.append("  </label>")
html.append(" </div>")

html.append("</div>")


// ============================================================
// CALLBACK DATE & TIME Utilities
// Hidden by default
// ============================================================

html.append("<div class='form-group' id='callback_datetime_utilities_group' style='display:none;'>")
html.append(" <label class='control-label'>Callback Date Time Utilities:</label>")
html.append(" <input type='datetime-local' class='form-control input-sm' id='callback_datetime_utilities' name='callback_datetime_utilities' value=''>")
html.append("</div>")

// ============================================================
// CALLBACK DATE & TIME Utilities
// Hidden by default
// ============================================================

html.append("<div class='form-group' id='callback_datetime_ovc_group' style='display:none;'>")
html.append(" <label class='control-label'>Callback Date Time OVC:</label>")
html.append(" <input type='datetime-local' class='form-control input-sm' id='callback_datetime_ovc' name='callback_datetime_ovc' value=''>")
html.append("</div>")



// ============================================================
// FLATPICKR
// ============================================================

// Flatpickr CSS
html.append("<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css'>")

// Flatpickr library
html.append("<script src='https://cdn.jsdelivr.net/npm/flatpickr'></script>")

// Our GitHub JavaScript
html.append("<script src='https://asset.compareclub.com.au/energy/reengagement/callback-picker.js'></script>")


// ============================================================
// NOTES
// ============================================================

html.append("<div class='form-group'>")

html.append(" <label class='control-label'>Notes:</label>")

html.append(" <textarea class='form-control' id='7' name='scout_notes' rows='4' maxlength='1000' style='resize:vertical;'></textarea>")

html.append("</div>")


// ============================================================
// SUBMIT
// ============================================================

html.append("<div class='form-group'>")

html.append(" <input type='submit' class='btn btn-md btn-success' value='Create a Lead'>")

html.append("</div>")


html.append("</div>")
