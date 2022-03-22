// nik_pets_fucktimebomb.js
/****
 * == Rouselle (Timebomb Patcher) ==
 * v2.2
 * 
 * Last Modified: 22 Mar 2022 (20:45 UTC+5)
 * 
 * @author Nikita Krapivin <hi.russell@example.com>
 */

"use strict";

(function() { // -- wrap in a function to allow to cancel init (see if below) -- //

// -- very cursed code below -- //

if (typeof(nik_pets_TimeBombPatcherInit) !== "undefined") {
    console.log("nik_pets_fucktimebomb.js: Already initialised.");
    return false;
}

let nik_pets_XhrOpenOrig = XMLHttpRequest.prototype.open;
let nik_pets_FS_Orig = undefined;

/**
 * Reads a 32bit value from a Uint8Array
 * @param {Uint8Array} bytearr - Byte array that contains the data.
 * @param {BigInt} offset - offset to read from
 * @returns {BigInt} the value
 */
function nik_pets_read32bit(bytearr, offset) {
	let oo = BigInt(offset);
	let v1 = BigInt(bytearr[oo]);
	let v2 = BigInt(bytearr[++oo]);
	let v3 = BigInt(bytearr[++oo]);
	let v4 = BigInt(bytearr[++oo]);
	let vv = BigInt(v1 | v2 << BigInt(8) | v3 << BigInt(16) | v4 << BigInt(24));
	return BigInt(vv);
}

/**
 * Writes a 64bit BigInt value into a byte array at offset.
 * @param {Uint8Array} bytearr - byte array to write to.
 * @param {BigInt} offset - offset at which to write.
 * @param {BigInt} vv - the value to write.
 */
function nik_pets_write32bit(bytearr, offset, vv) {
	let oo = BigInt(offset);
	let v1 = BigInt(vv) & BigInt(0xFF);
	let v2 = (BigInt(vv) >> BigInt(8)) & BigInt(0xFF);
	let v3 = (BigInt(vv) >> BigInt(16)) & BigInt(0xFF);
	let v4 = (BigInt(vv) >> BigInt(24)) & BigInt(0xFF);
	bytearr[oo] = Number(v1);
	bytearr[++oo] = Number(v2);
	bytearr[++oo] = Number(v3);
	bytearr[++oo] = Number(v4);
}

/**
 * Reads a 64bit value from a Uint8Array
 * @param {Uint8Array} bytearr - Byte array that contains the data.
 * @param {BigInt} offset - offset to read from
 * @returns {BigInt} the value
 */
function nik_pets_read64bit(bytearr, offset) {
	let oo = BigInt(offset);
	let n1 = BigInt(nik_pets_read32bit(bytearr, oo));
	let n2 = BigInt(nik_pets_read32bit(bytearr, oo + BigInt(4)));
	return BigInt(n1 | (n2 << BigInt(32)));
}

/**
 * Writes a 32bit BigInt value into a byte array at offset.
 * @param {Uint8Array} bytearr - byte array to write to.
 * @param {BigInt} offset - offset at which to write.
 * @param {BigInt} vv - the value to write.
 */
function nik_pets_write64bit(bytearr, offset, vv) {
	let oo = BigInt(offset);
	let n1 = (BigInt(vv) & BigInt("0xffffffff"));
	let n2 = (BigInt(vv) >> BigInt(32));
	nik_pets_write32bit(bytearr, oo, n1);
	nik_pets_write32bit(bytearr, oo + BigInt(8), n2);
}

/**
 * Timebomb patcher.
 * @param {Uint8Array} bytearr - the IFF file.
 */
function nik_pets_PatchTimebomb(bytearr) {
	console.log("nik_pets_PatchTimebomb(): Patching the timebomb, sit tight...");
	//console.log(bytearr);
	
	// -- fun stuff begins here -- //
	let bytecode_offs = 0x11;
	let gameid_offs = 0x24;
	let defwidth_offs = 0x4C;
	let defheight_offs = 0x50;
	let info_offs = 0x54;
	let timestamp_offs = 0x6C;
	let roomcount_offs = 0x90;
	
	// set to false to activate the time bomb.
	// true  => /bt=exe
	// false => /bt=run
	let v_btexemode = true;
	
	//debugger;
	
	let v_bytecode = BigInt(bytearr[bytecode_offs]);
	let v_gameid = nik_pets_read32bit(bytearr, gameid_offs);
	let v_defwidth = nik_pets_read32bit(bytearr, defwidth_offs);
	let v_defheight = nik_pets_read32bit(bytearr, defheight_offs);
	let v_info = nik_pets_read32bit(bytearr, info_offs);
	let v_timestamp = nik_pets_read64bit(bytearr, timestamp_offs);
	let v_roomcount = nik_pets_read32bit(bytearr, roomcount_offs);
	
	let arraysize = BigInt(5*8);
	let fourbi = BigInt(4);
	let gms2header_offs = (BigInt(roomcount_offs) + fourbi) + (v_roomcount * fourbi);
	let gamespeed_offs = gms2header_offs + arraysize;
	let allowstats_offs = gms2header_offs + arraysize + fourbi;
	let gms2guid_offs = gms2header_offs + arraysize + fourbi + fourbi;
	
	// disable analytics.
	nik_pets_write32bit(bytearr, allowstats_offs, 0);
	
	let v_ids = new BigInt64Array(5);
	// has to be a regular number.
	let v_intmax = 2147483647.00;
	
	// generation begin.
	let v_firstRandom = (BigInt(Math.round(Math.random() * v_intmax)) << BigInt(32)) | BigInt(Math.round(Math.random() * v_intmax));
	let v_infoNumber = v_timestamp;
	// VERY IMPORTANT.
	if (v_btexemode) {
		v_infoNumber -= BigInt(1000);
	}
	let v_temp = BigInt(v_infoNumber);
	// here huge values are hex strings because JS can't represent some huge bitmasks :/
	v_temp =
	    ((v_temp << BigInt(56)) & BigInt("0xff00000000000000"))
	  | ((v_temp >> BigInt( 8)) & BigInt("0xff000000000000"  ))
	  | ((v_temp << BigInt(32)) & BigInt("0xff0000000000"    ))
	  | ((v_temp >> BigInt(16)) & BigInt("0xff00000000"      ))
	  | ((v_temp << BigInt( 8)) & BigInt("0xff000000"        ))
	  | ((v_temp >> BigInt(24)) & BigInt("0xff0000"          ))
	  | ((v_temp >> BigInt(16)) & BigInt("0xff00"            ))
	  | ((v_temp >> BigInt(32)) & BigInt("0xff"              ));
	v_infoNumber = BigInt(v_temp);
	v_infoNumber ^= v_firstRandom;
	v_infoNumber = ~v_infoNumber;
	v_infoNumber ^= (v_gameid << BigInt(32)) | BigInt(v_gameid);
	v_infoNumber ^= BigInt(
		((v_defwidth  + v_info) << BigInt(48)) |
		((v_defheight + v_info) << BigInt(32)) |
		((v_defheight + v_info) << BigInt(16)) |
		((v_defwidth  + v_info))
	);
	v_infoNumber ^= BigInt(v_bytecode);
	
	// we have to be VERY careful.
	// we must use regular int arithmetic, not double floating point hell.
	let v_infoLocation = BigInt(BigInt(BigInt(v_timestamp & BigInt(0xFFFF)) / BigInt(7) + BigInt(v_gameid - v_defwidth) + BigInt(v_roomcount)));
	if (v_infoLocation < BigInt(0)) v_infoLocation = BigInt(-v_infoLocation);
	v_infoLocation %= BigInt(4);
	
	// first pos always firstrandom.
	v_ids[0] = BigInt(v_firstRandom);
	
	// array loop.
	for (let i = 0; i < 4; ++i) {
		if (BigInt(i) == BigInt(v_infoLocation)) {
			// write v_infoNumber
			v_ids[1 + i] = BigInt(v_infoNumber);
			continue;
		}
		let v_rfirst = BigInt(Math.round(Math.random() * v_intmax));
		let v_rsecond = BigInt(Math.round(Math.random() * v_intmax));
		let v_rcombined = BigInt( (v_rsecond >> BigInt(32)) | (v_rfirst & BigInt("0xffffffff")) );
		// write v_rcombined
		v_ids[1 + i] = BigInt(v_rcombined);
	}
	
	// and now we need to write these values, god bless us.
	let j = BigInt(gms2header_offs);
	for (let i = 0; i < 5; ++i) {
		nik_pets_write64bit(bytearr, j, v_ids[i]);
		j += BigInt(8);
	}
	
	console.log("nik_pets_PatchTimebomb(): All Done!");
}

function nik_pets_FS_createDataFile(parent, name, data, canRead, canWrite, canOwn) {
	console.log("nik_pets_FS_createDataFile(): hooked!");
	if (Module && parent == "/assets/game.unx" && data && canRead && canWrite && canOwn) {
		nik_pets_PatchTimebomb(data);
		// undo all hooks:
		XMLHttpRequest.prototype.open = nik_pets_XhrOpenOrig;
		Module.FS_createDataFile = nik_pets_FS_Orig;
		console.log("nik_pets_FS_createDataFile(): Hooks cleaned up! State stable.");
	}
	
	return nik_pets_FS_Orig(parent, name, data, canRead, canWrite, canOwn);
}

/**
 * Our custom OnLoad XHR event.
 */
function nik_pets_OnLoad() {
	if (typeof(Module) !== "undefined" && typeof(Module.FS_createDataFile) !== "undefined") {
		console.log("nik_pets_OnLoad(): Hooking module.");
		if (nik_pets_FS_Orig === undefined) {
			nik_pets_FS_Orig = Module.FS_createDataFile;
		}
		Module.FS_createDataFile = nik_pets_FS_createDataFile;
	}
	else {
		// console.log("nik_pets_OnLoad(): Wtf?");
		// not a GM game page...
	}
}

/**
 * A hook on XMLHttpRequest.open
 */
function nik_pets_XhrOpenHook() {
	console.log("nik_pets_XhrOpenHook(): Hello =^-^=");
	this.addEventListener("load", nik_pets_OnLoad);
	nik_pets_XhrOpenOrig.apply(this, arguments);
}

/**
 * Init function of this script.
 */
function nik_pets_TimeBombPatcherInit() {
	XMLHttpRequest.prototype.open = nik_pets_XhrOpenHook;
	// console.log("nik_pets_TimeBombPatcherInit(): XHR Open hooked.");
}

// -- the entry point is here -- //
nik_pets_TimeBombPatcherInit();
return true;

})();

