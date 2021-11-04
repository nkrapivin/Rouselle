# Rouselle

An extension to ~~bypass~~ replicate the Opera GX DRM for the Opera GX WASM export.

## What?

When you run a game made with the Opera GX export,

it tries to detect whether you're running it in Opera GX or not.

If the check fails, it redirects you to an official website of Opera GX ( https://opera.com/gx/ ).

Since I never wrote a browser extension before, this exists!

## And?

This extension requires a browser that supports WebExtensions V2 or higher.

That means all Chromium-based browsers, and **modern (post-Quantum)** Firefox.

Portable editions work too.

It should also work on Firefox for Android, but as for now, FA does not allow installation of unpublished extensions.

## So?

To install, follow these (I hope) simple steps:

- Go to [Releases](https://github.com/nkrapivin/Rouselle/releases).
- Download an xpi for Firefox, crx for Chromium-based ones.
- Install the extension (try drag and dropping the file onto the browser window).
- Restart your browser.
- Try running an Opera GX export game, no more shitty redirects or nags about Opera GX!

## Wait, gxc.gg is... pop-ups...??

Yeah, gxc.gg games run in fullscreen only. (as for `26.09.2021 14:22 UTC+5`)

It's using a hidden feature in the secret Opera GX bg worker, which ignores all Chromium security policies.

I try to replicate it by using `window.open`, not in fullscreen, because Chrome doesn't allow

a JS extension to open windows in fullscreen just cuz it wants to.

On Firefox it may trigger a pop-up blocker, and for a good reason, your browser is doing a great job!

(you wouldn't want some sketchy website to open windows in fullscreen with no browser UI whatsoever...)

But yeah, you *have* to click `Allow all pop-ups from gxc.gg.` in order for games to run.

If you know a better way of opening game windows through JS that works on both Chrome and Firefox, send me a PR!

Unlike YoYo's `runner.js` since Runtime V23.1.1.369, my JS is not obfuscated (and never will be), you are free to modify it however you want!

(cuz FREEDOM..!!! =^-^=)

## Store?

Hell no, I'll never publish this extension on to some web store, be it Chrome Store or Mozilla Store.

Because it'll get DMCA'd or C&D'd as fast as I'll become a college dropout! (heh...)

I do have an account on the Mozilla Store, just so I can sign my .xpi files.

But it's only for signing, not for sharing or distribution, as such there's not much to desist.

Chrome Store requires paying a one-time fee, and since I don't have any money whatsoever,

heck, I can't even afford my personal domain! I use no-ip! I can't afford a proper web hosting!

I am literally a college student do you expect me to have money?

So yeah, can't. :/

## Umm?

I know, sometimes this extension may not work (esp. the game window hack), it may get patched by the **evil corps**.

I'll try to update it asap though, if possible of course.

Tested with runtimes V9.9.1.2226 and V23.1.1.369, VM only.

UPD: Dev version V1.3 also tested with https://test.gxc.gg/

UPD 2: Dev version V1.4 also tested with https://dc.gxc.gg/ and the private game tracks.

## Who?

Credits:

- Nikita Krapivin - funny trolling.
- Anonymous citizen - an idea for the extension's icon.
