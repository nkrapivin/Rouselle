// nik_pets.js
/****
 * == Rouselle (Content Script) ==
 * v1.1
 * 
 * Last Modified: 13 Sep 2021 (18:57 UTC+5)
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
	
	// -- find game element -- //
	let nik_pets_target = document.getElementsByClassName("game-container")[0];
	if (typeof(nik_pets_target) === "undefined") {
		// index.html, very awful, this name is very common:
		nik_pets_target = document.getElementById("progress");
	}

	// -- trolling -- //
	if (nik_pets_target) {
		try {
			nik_pets_target.appendChild(nik_pets_elem);
			nik_pets_target.appendChild(nik_pets_timebombelem);
			console.log("nik_pets: Injected.");
		}
		catch (nik_pets_exc) {
			// ignore errors.
		}
	}
	else {
		console.log("nik_pets: Injection failed, not a game page?");
	}
}

// -- The entrypoint is here -- //
nik_pets_Init();
