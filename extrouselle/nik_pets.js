// nik_pets.js
/****
 * == Rouselle (Content Script) ==
 * v1.9
 * 
 * Last Modified: 30 Sep 2021 (21:23 UTC+5)
 * 
 * @author Nikita Krapivin <hi.russell@example.com>
 */

"use strict";

/**
 * Initializes the extension.
 */
function nik_pets_Init() {
	// -- chrome or firefox? -- //
	let nik_pets_runtime = (typeof(chrome) === "undefined") ? browser : chrome;

	// -- load our stage 2 script -- //
	let nik_pets_elem = document.createElement("script");
	nik_pets_elem.id = "nik_pets_script_element";
	nik_pets_elem.className = "nik_pets_class";
	nik_pets_elem.src = nik_pets_runtime.runtime.getURL("nik_pets_stage2.js");
	let nik_pets_timebombelem = document.createElement("script");
	nik_pets_timebombelem.id = "nik_pets_script_timebomb_element";
	nik_pets_timebombelem.className = "nik_pets_class";
	nik_pets_timebombelem.src = nik_pets_runtime.runtime.getURL("nik_pets_fucktimebomb.js");
	
	
	// -- TODO: does not work with gxc -- //
	
	// -- find game element -- //
	
	/*
	let nik_pets_target = document.getElementsByClassName("game-container")[0];
	if (typeof(nik_pets_target) === "undefined") {
		// index.html, very awful, this name is very common:
		nik_pets_target = document.getElementsByClassName("emscripten")[1];
		// [1] because there are two elements that have this class name
		// we want the second one.
		if (typeof(nik_pets_target) === "undefined") {
			// TODO: find more elements somehow?
		}
	}

	// -- trolling -- //
	if (nik_pets_target) {
		try {
			nik_pets_target.appendChild(nik_pets_elem);
			nik_pets_target.appendChild(nik_pets_timebombelem);
			console.log("nik_pets: Injected OK.");
		}
		catch (nik_pets_exc) {
			console.log("nik_pets: An error when injecting, ignoring.");
		}
	}
	else {
		// console.log("nik_pets: Injection failed, not a game page?");
	}
	*/
	
	// -- inject into the whole document at start -- //
	document.documentElement.appendChild(nik_pets_elem);
	document.documentElement.appendChild(nik_pets_timebombelem);
}

// -- The entrypoint is here -- //
nik_pets_Init();
