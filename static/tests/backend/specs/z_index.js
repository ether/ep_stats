'use strict';

const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(
    __dirname, '..', '..', '..', '..', 'static', 'css', 'stats.css');

describe(__filename, function () {
  it('stats overlay uses a z-index below Etherpad toolbar popups (#10)', function () {
    // Etherpad's toolbar dropdowns / popups use z-index values in the
    // 150–500 range (see core pad/toolbar.css and pad/icons.css). The
    // stats overlay is position:fixed, so without a lower explicit
    // z-index menu dropdowns that extend into the stats area get hidden
    // behind it.
    const src = fs.readFileSync(cssPath, 'utf8');
    const statsBlock = src.match(/#stats\s*\{[\s\S]*?\}/);
    assert(statsBlock, 'expected an `#stats {}` block in stats.css');
    const zIndexMatch = statsBlock[0].match(/z-index:\s*(-?\d+)/);
    assert(zIndexMatch, '#stats must declare a z-index so it stacks below dropdowns');
    const z = parseInt(zIndexMatch[1], 10);
    assert(z < 150,
        `#stats z-index (${z}) must be below Etherpad's dropdown/popup z-indexes (≥150)`);
  });
});
