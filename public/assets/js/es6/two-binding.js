/*
 * Import jQuery Dependency
 */

import $ from 'jquery';
//import jQuery from "jquery/src/core";

//require('jquery/src/core/init');
//require('jquery/src/manipulation');


/*
 * jQuery Placebo Effect of 2 Way Binding
 */

function updateFullName(){
    let fullName = $("#firstName").val() + " " + $("#lastName").val();
    $("#fullName").text(fullName);
}

let _fName = "Two";
let _lName = "Way";

$("#firstName").val(_fName);
$("#lastName").val(_lName);

$("#firstName, #lastName").bind("change keyup", function(){
    updateFullName();
});

updateFullName();
