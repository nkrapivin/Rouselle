// nik_pets.js
/****
 * == Rouselle (Content Script) ==
 * v1.0
 * 
 * Last Modified: 12 Sep 2021 (20:10 UTC+5)
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
	
	// -- find game element -- //
	let nik_pets_target = document.getElementsByClassName("game-container")[0];
	if (typeof(nik_pets_target) === "undefined") {
		// index.html, very awful, this name is very common:
		nik_pets_target = document.getElementById("progress");
	}

	// -- trolling -- //
	if (nik_pets_target) {
		nik_pets_target.appendChild(nik_pets_elem);
		console.log("nik_pets: Injected.");
	}
	else {
		console.log("nik_pets: Injection failed, not a game page?");
	}
}

// -- The entrypoint is here -- //
nik_pets_Init();
