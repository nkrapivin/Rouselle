// nik_pets.js
/****
 * == Rouselle (Content Script) ==
 * v2.3
 * 
 * Last Modified: 13 Jun 2022 (18:48 UTC+5)
 * 
 * @author Nikita Krapivin <hi.russell@example.com>
 */

"use strict";

/**
 * Initializes the extension.
 */
function nik_pets_Init() {
    console.log("nik_pets_Init(): Welcome to Rouselle-new");
    
    // -- a very very awful init check -- //
    if (typeof(chrome) !== "undefined"
    &&  typeof(chrome.runtime) !== "undefined"
    &&  typeof(chrome.runtime.sendMessage) === "function"
    &&  typeof(nik_pets_Stage2Init) === "function") {
        console.log("nik_pets_Init(): We're probably already initialized.");
        return false;
    }
    
	// -- chrome or firefox? -- //
	let nik_pets_runtime = (typeof(chrome) === "undefined") ? browser : chrome;

	// -- load our stage 2 script -- //
	let nik_pets_elem = document.createElement("script");
	nik_pets_elem.id = "nik_pets_script_element";
	nik_pets_elem.className = "nik_pets_class";
	nik_pets_elem.src = nik_pets_runtime.runtime.getURL("nik_pets_stage2.js");
    nik_pets_elem.async = false;
    nik_pets_elem.defer = false;
    
    // -- load timebomb patcher script -- //
	let nik_pets_timebombelem = document.createElement("script");
	nik_pets_timebombelem.id = "nik_pets_script_timebomb_element";
	nik_pets_timebombelem.className = "nik_pets_class";
	nik_pets_timebombelem.src = nik_pets_runtime.runtime.getURL("nik_pets_fucktimebomb.js");
    nik_pets_timebombelem.async = false;
    nik_pets_timebombelem.defer = false;
	
	// -- inject into the whole document at start -- //
	document.documentElement.appendChild(nik_pets_elem);
	document.documentElement.appendChild(nik_pets_timebombelem);
    console.log("nik_pets_Init(): Init seems to be OK.");
    console.log(nik_pets_elem);
    console.log(nik_pets_timebombelem);
    
    // lol.
    let quotes = [
        "*hacker voice* I'm in",
        "pugs",
        "NFTs? More like No Fucking Thanks",
        "oi m8 you got a loicence for that?",
        "kitty very nice",
        "now even more accurate DRM responses!",
        "wasm <3"
    ];
    
    console.log("nik_pets_Init(): " + quotes[Math.floor(Math.random() * quotes.length)]);
    
    return true;
}

// -- The entrypoint is here -- //
nik_pets_Init();



