// nik_pets_stage2.js
/****
 * == Rouselle (Stage 2) ==
 * v1.4
 * 
 * Last Modified: 25 Sep 2021 (18:02 UTC+5)
 * 
 * @author Nikita Krapivin <hi.russell@example.com>
 */

"use strict";

// -- change when it gets fixed LOL -- //
const nik_pets_REPLY = { hash: [ 185, 66, 169, 195, 1, 196, 6, 209, 109, 32, 69, 100, 5, 236, 130, 37, 162, 86, 183, 235 ] };
const nik_pets_REPLY_PRODUCT = { product: "Opera GX" };

/**
 * A stub sendMessage that does nothing.
 * @param {string} idString - id of the extension.
 * @param {object} msgObject - message object.
 * @param {function} responseFunc - answer reply callback.
 */
function nik_pets_Stub(idString, msgObject, responseFunc) {
	console.log("nik_pets_Stub(): STUB IS CALLED?!");
	// TODO: pass back to the `browser` namespace maybe?
}

// ensure chrome variable on firefox.
if (typeof(chrome) === "undefined") var chrome = {};
if (typeof(chrome.runtime) === "undefined") chrome.runtime = {};
if (typeof(chrome.runtime.sendMessage) === "undefined") chrome.runtime.sendMessage = nik_pets_Stub;

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
 * A function that replies to the drm product auth.
 * @param {function} rpFunction - Reply callback that gets the answer.
 */
function nik_pets_ReplyProduct(rpFunction) {
	console.log("nik_pets_ReplyProduct(): Hi.");
	rpFunction(nik_pets_REPLY_PRODUCT);
}

/**
 * A hook for sendMessage.
 * @param {string} idString - id of the extension.
 * @param {object} msgObject - message object.
 * @param {function} responseFunc - answer reply callback.
 */
function nik_pets_SendMessageHook(idString, msgObject, responseFunc) {
	// console.log("nik_pets_SendMessageHook(): idString = " + idString);
	
	if (idString === "mpojjmidmnpcpopbebmecmjdkdbgdeke") {
		console.log("nik_pets_SendMessageHook(): Hooking response.");
		if (msgObject.command === "product") {
			console.log("nik_pets_SendMessageHook(): New reply.");
			setTimeout(nik_pets_ReplyProduct, 0, responseFunc);
		}
		else if (msgObject.command === "openURL") {
			console.log("nik_pets_SendMessageHook(): Trying to open the game.");
			// passed by gxc.gg:
			let nik_pets_w = msgObject.size.width;
			let nik_pets_h = msgObject.size.height;
			// calculated by us:
			let nik_pets_x = screen.availWidth/2 - nik_pets_w/2;
			let nik_pets_y = screen.availHeight/2 - nik_pets_h/2;
			// `fullscreen` may or may not work, you never know ;-;
			window.open(msgObject.url, "_blank", "fullscreen=yes,left=" + nik_pets_x + ",top=" + nik_pets_y + ",width=" + nik_pets_w + ",height=" + nik_pets_h);
			return false; // no need to reply to anything.
		}
		else if (msgObject.command === "authenticate") {
			console.log("nik_pets_SendMessageHook(): Legacy reply. " + msgObject.command);
			setTimeout(nik_pets_Reply, 0, responseFunc);
		}
		else {
			console.log("nik_pets_SendMessageHook(): UNKNOWN COMMAND PASSED = " + msgObject.command);
			console.log(msgObject);
			alert("PLEASE SEE THE BROWSER CONSOLE!");
			return false;
		}
		
		return true;
	}
	else {
		console.log("nik_pets_SendMessageHook(): Calling original.");
		return nik_pets_Original(idString, msgObject, responseFunc);
	}
	
	// TODO: more checks?
}

/**
 * A hook for window location replace.
 * @param {DOMString} domString - the url to navigate to.
 */
function nik_pets_ReplaceHook(domString) {
	// DOMString -> string
	if (domString.toString().includes("https://opera.com/gx")) {
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

/**
 * Initializes the second stage.
 */
function nik_pets_Stage2Init() {
	chrome.runtime.sendMessage = nik_pets_SendMessageHook;
	// TODO: figure out a way to hook window.location.replace:
	//Object.defineProperty(window.location, 'replace', { value: nik_pets_ReplaceHook, writable: false });
	//window.location.replace = nik_pets_ReplaceHook;
	console.log("nik_pets_Stage2Init(): Stage 2 Init.");
}

// -- the entry point is here -- //
nik_pets_Stage2Init();
