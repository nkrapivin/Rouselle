// nik_pets_stage2.js
/****
 * == Rouselle (Stage 2) ==
 * v1.99
 * 
 * Last Modified: 06 Nov 2021 (18:06 UTC+5)
 * 
 * @author Nikita Krapivin <hi.russell@example.com>
 */

"use strict";

// -- only used for old auth flow LOL -- //
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
let nik_pets_YYSumOrig = undefined;
let nik_pets_ApplyOrig = undefined;
let nik_pets_Closed = 0;

/**
 * A function that replies to the drm auth.
 *
 * OLD! PLEASE SEE THE FUNCTION BELOW FOR NEW CODE!!
 * @param {function} rpFunction - Reply callback that gets the answer.
 */
function nik_pets_Reply(rpFunction) {
	console.log("nik_pets_Reply(): Hi.");
	rpFunction(nik_pets_REPLY);
}

/**
 * hiya to anyone reading this source code on github...
 * (in case anybody from opera/yoyo is actually reading this at all...)
 * Please, release the WASM export as a paid addition for HTML5, but without the vendor-lock.
 * I've tested it on Firefox and Ungoogled-Chromium, works just fine, seriously.
 * There are *many* performance issues with Firefox on Android, but that's just the reality of a phone.
 * I've paid money for an HTML5 export, you can check that, bought it on Steam.
 * We all know that the JS export performs **worse** than the WASM one, aside from weird canvas issues.
 * Okay, maybe you don't want to provide the WASM export for free to existing JS users, perhaps an upgrade fee might do..?
 * 
 * For others:
 * Replies to the .373+ new hash DRM.
 * @param {function} rpFunction - Reply callback that gets the answer.
 */
function nik_pets_Reply2(rpFunction) {
	console.log("nik_pets_Reply2(): Doing new reply stuff...");
	
	// are we running in an Opera browser?
	if (navigator.userAgent.includes("OPR/")) {
		alert("nik_pets_Reply2(): Opera User-Agent detected.\nPlease see JSDoc comments for this function, thank you.\n\n- Nikita Krapivin.");
		rpFunction(null); // crash the drm code, will hang the game.
		return;
	}
	
	// try to poke into YYSum, underscore is required.
	// (apparently in some rare cases it might throw an exception:
	//  'redeclaration of `let` variable.'
	//  so I check for an undefined value...)
	if (nik_pets_YYSumOrig === undefined) {
		nik_pets_YYSumOrig = Module["_YYSum"];
	}
	
	// bruh moment.
	Object.defineProperty(Module, "_YYSum", {
		set: function(_value) {
			if (nik_pets_ApplyOrig === undefined) {
				nik_pets_ApplyOrig = _value.apply;
			}
			
			_value.apply = function(_this_object, _the_arguments) {
				// hash result        expected hash result.
				_the_arguments[0] = _the_arguments[1];
				// force the hash result to match the expected one
				this.apply = nik_pets_ApplyOrig;
				// pass back to original func.
				this.apply(_this_object, _the_arguments);
			};
		},
		get: function() {
			return nik_pets_YYSumOrig;
		},
		enumerable: false
	});
	
	// call the callback, this one'll go into whatever JS/WASM there is.
	// (debugging beyond this point is p a i n)
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
 * Tries to close the current window.
 * @returns {bool} always false, just as a shortcut.
 */
function nik_pets_CloseTabHandler() {
	console.log("nik_pets_CloseTabHandler(): Trying to close the window.");
	// if you have a better method of closing the current tab, implement it here!
	window.close();
	// uh, this function was called.. again??
	if (nik_pets_Closed == 2) {
		alert("The game wants to close it's own tab, if you see this message, close the tab manually.");
	}
	// increment the "how many times a .close() call was attempted" counter :p because browsers are silly
	++nik_pets_Closed;
	return false;
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
			/*
			// passed by gxc.gg:
			let nik_pets_w = msgObject.size.width;
			let nik_pets_h = msgObject.size.height;
			// calculated by us:
			let nik_pets_x = screen.availWidth/2 - nik_pets_w/2;
			let nik_pets_y = screen.availHeight/2 - nik_pets_h/2;
			// `fullscreen` may or may not work, you never know ;-;
			window.open(msgObject.url, "_blank", "fullscreen=yes,left=" + nik_pets_x + ",top=" + nik_pets_y + ",width=" + nik_pets_w + ",height=" + nik_pets_h);
			*/
			window.open(msgObject.url, "_blank");
			return false; // no need to reply to anything.
		}
		else if (msgObject.command === "authenticate") {
			if (msgObject.randomString === "Arek") {
				console.log("nik_pets_SendMessageHook(): Legacy reply.");
				setTimeout(nik_pets_Reply, 0, responseFunc);
			}
			else {
				console.log("nik_pets_SendMessageHook(): New reply 2.");
				setTimeout(nik_pets_Reply2, 0, responseFunc);
			}
		}
		else if (msgObject.command === "closeTab") {
			return nik_pets_CloseTabHandler();
		}
		else {
			console.log("nik_pets_SendMessageHook(): UNKNOWN COMMAND PASSED = " + msgObject.command);
			console.log(msgObject);
			alert("[Rouselle]: PLEASE SEE THE BROWSER CONSOLE!");
			return false;
		}
		
		// doing an async reply.
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
