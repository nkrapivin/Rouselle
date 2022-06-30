// nik_pets_stage2.js
/****
 * == Rouselle (Stage 2) ==
 * v2.3
 * 
 * Last Modified: 13 Jun 2022 (18:48 UTC+5)
 * 
 * @author Nikita Krapivin <hi.russell@example.com>
 */

"use strict";

// -- only used for old auth flow LOL -- //
const nik_pets_REPLY = { hash: [ 185, 66, 169, 195, 1, 196, 6, 209, 109, 32, 69, 100, 5, 236, 130, 37, 162, 86, 183, 235 ] };
const nik_pets_REPLY_PRODUCT = { product: "Opera GX" };

/**
 * A stub chrome.runtime.sendMessage that does nothing.
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
let nik_pets_Closed = 0; // 'how many times a close has been requested?'

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
 * Converts an ASCII string to an array.
 *
 * @param {string} inputString ASCII String
 * @returns {Uint8Array} of bytes
 */
function nik_pets_StringToArray(inputString) {
    let res = new Uint8Array(inputString.length);
    
    for (let i = 0; i < res.length; ++i) {
        // I know it's very awful and won't support Unicode
        // gladly we don't need it.
        res[i] = (inputString.charCodeAt(i) & 0xFF);
    }
    
    return res;
}

/**
 * Handler for the SHA-1 digest event.
 * Now even more precise!
 *
 * @param {ArrayBuffer} promiseResultArrayBuffer the SHA-1 hash.
 * @param {function} rpFunction callback into GameMaker.
 */
function nik_pets_Reply2Handler(promiseResultArrayBuffer, rpFunction) {
    console.log("nik_pets_Reply2Handler(): inside a promise... (fuck NFTs and Web3 btw)");
    console.log(promiseResultArrayBuffer);
    // the Opera GX hash callback returns a regular JS array
    // so let's replicate this thing as precise as possible :)
    rpFunction({ hash: Array.from(new Uint8Array(promiseResultArrayBuffer)) });
}

/**
 * Alright Opera, you did not listen, your fault, have fun.
 * You had one job, release the OGX export properly, you've fucked up.
 * You really wanna continue this silly fight?
 * 
 * For others:
 * Replies to the DRM thing.
 * @param {function} rpFunction - Reply callback that gets the answer.
 * @param {object} inputData - screw Opera tbh.
 */
function nik_pets_Reply2(rpFunction, inputData) {
	console.log("nik_pets_Reply2(): Doing new reply stuff...");
	
    window.crypto.subtle.digest("SHA-1", nik_pets_StringToArray(inputData.randomString + "QXyd2ZCu88ec3J0X"))
    .then(nik_pets_res => nik_pets_Reply2Handler(nik_pets_res, rpFunction));
}

/**
 * A function that replies to the drm product auth.
 * @param {function} rpFunction - Reply callback that gets the answer.
 */
function nik_pets_ReplyProduct(rpFunction) {
	console.log("nik_pets_ReplyProduct(): GXC product reply");
	rpFunction(nik_pets_REPLY_PRODUCT);
}

/**
 * Tries to close the current window.
 * @returns {bool} always false, just as a shortcut.
 */
function nik_pets_CloseTabHandler() {
    // closing a bit too much...
    if (nik_pets_Closed >= 4) {
        return false;
    }
    // .........
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
	console.log("nik_pets_SendMessageHook(): idString = " + idString);
	
	if (idString === "mpojjmidmnpcpopbebmecmjdkdbgdeke") {
		// console.log("nik_pets_SendMessageHook(): Hooking response.");
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
                // do not use setTimeout() as it'll call into a Promise()
				nik_pets_Reply2(responseFunc, msgObject);
			}
		}
		else if (msgObject.command === "closeTab") {
			return nik_pets_CloseTabHandler();
		}
		else {
			console.log("nik_pets_SendMessageHook(): UNKNOWN COMMAND PASSED = " + msgObject.command);
			console.log(msgObject);
			alert("[Rouselle]: Unimplemented Opera GX command, see dev console.");
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
 * Initializes the second stage.
 */
function nik_pets_Stage2Init() {
	chrome.runtime.sendMessage = nik_pets_SendMessageHook;
	console.log("nik_pets_Stage2Init(): Stage 2 Init.");
}

// -- the entry point is here -- //
nik_pets_Stage2Init();
