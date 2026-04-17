![Publish Status](https://github.com/ether/ep_stats/workflows/Node.js%20Package/badge.svg) [![Backend Tests Status](https://github.com/ether/ep_stats/actions/workflows/test-and-release.yml/badge.svg)](https://github.com/ether/ep_stats/actions/workflows/test-and-release.yml)

Pad Stats in Etherpad
=====================

![Screenshot](https://user-images.githubusercontent.com/220864/106881734-cf7bdb00-66d5-11eb-9c54-6bf04fa45ad6.png)

To disable Stats by default view click Settings -> Show Pad and Author Stats

Setting as default
==================
Paste the below into your settings.
```
ep_stats_default: "false",
```
todo
====
* All the things

Contact me to sponsor dev.

## Installation

Install from the Etherpad admin UI (**Admin → Manage Plugins**,
search for `ep_stats` and click *Install*), or from the Etherpad
root directory:

```sh
pnpm run plugins install ep_stats
```

> ⚠️ Don't run `npm i` / `npm install` yourself from the Etherpad
> source tree — Etherpad tracks installed plugins through its own
> plugin-manager, and hand-editing `package.json` can leave the
> server unable to start.

After installing, restart Etherpad.
