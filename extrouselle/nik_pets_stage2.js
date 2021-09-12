// nik_pets_stage2.js
/****
 * == Rouselle (Stage 2) ==
 * v1.0
 * 
 * Last Modified: 12 Sep 2021 (20:10 UTC+5)
 * 
 * @author Nikita Krapivin <hi.russell@example.com>
 */

"use strict";

// -- change when it gets fixed LOL -- //
const nik_pets_REPLY = { hash: [ 185, 66, 169, 195, 1, 196, 6, 209, 109, 32, 69, 100, 5, 236, 130, 37, 162, 86, 183, 235 ] };

/**
 * A stub sendMessage that does nothing.
 * @param {string} idString - id of the extension.
 * @param {object} msgObject - message object.
 * @param {function} responseFunc - answer reply callback.
 */
function nik_pets_Stub(idString, msgObject, responseFunc) {
	console.log("nik_pets_Stub(): STUB IS CALLED?!");
	return false;
}

if (typeof(chrome) === "undefined" || typeof(chrome.runtime) === "undefined" || typeof(chrome.runtime.sendMessage) === "undefined") {
	console.log("nik_pets: Making fake chrome variable...");
	// TODO: UGLY HACK
	var chrome = {
		runtime: {
			sendMessage: nik_pets_Stub,
			lastError: undefined
		}
	};
}

let nik_pets_Original = chrome.runtime.sendMessage;
let nik_pets_ReplaceOrig = window.location.replace;

/**
 * A function that replies to the drm auth.
 * @param {function} rpFunction - Reply callback that gets the answer.
 */
function nik_pets_Reply(rpFunction) {
	console.log("nik_pets_Reply(): Hi.");
	rpFunction(nik_pets_REPLY);
}

/**
 * A hook for sendMessage.
 * @param {string} idString - id of the extension.
 * @param {object} msgObject - message object.
 * @param {function} responseFunc - answer reply callback.
 */
function nik_pets_SendMessageHook(idString, msgObject, responseFunc) {
	if (idString === "mpojjmidmnpcpopbebmecmjdkdbgdeke") {
		console.log("nik_pets_SendMessageHook(): Hooking response.");
		setTimeout(nik_pets_Reply, 10, responseFunc);
		return true;
	}
	else {
		console.log("nik_pets_SendMessageHook(): Calling original.");
		return nik_pets_Original(idString, msgObject, responseFunc);
	}
}

/**
 * A hook for window location replace.
 * @param {DOMString} domString - the url to navigate to.
 */
function nik_pets_ReplaceHook(domString) {
	// DOMString -> string
	if (domString.toString().includes("opera.com")) {
		// Yo-Kai Watch - Space Dance! below:
		console.log("bruh begin:");
		console.log("bongo bongo sh sh sh sh sh");
		console.log("10000 ppl wanna kick it on mars");
		console.log("yo yo ppl rap to da beat now");
		console.log("50000 ppl wanna dance with da stars");
		console.log("pyon pyon pyon pyon pyon");
		console.log("20000 ppl eating dumplings afar");
		console.log("yoisho! yoisho!");
		console.log("40000 ppl wanna eat moon bars!");
		alert("DRM bypass fail, please see console for errors.");
	}
	else {
		// navigate just fine:
		nik_pets_ReplaceOrig(domString);
	}
}

chrome.runtime.sendMessage = nik_pets_SendMessageHook;
//Object.defineProperty(window.location, 'replace', { value: nik_pets_ReplaceHook, writable: false });
//window.location.replace = nik_pets_ReplaceHook;

// we're done here.
