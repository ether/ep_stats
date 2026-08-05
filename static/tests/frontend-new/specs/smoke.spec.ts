import {expect, test} from '@playwright/test';
import {
  getPadBody,
  goToNewPad,
  writeToPad,
} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_stats', () => {
  test('pad loads with plugin installed', async ({page}) => {
    const padBody = await getPadBody(page);
    await expect(padBody).toBeVisible();
  });

  test('author stats credit your writing to you', async ({page}) => {
    await writeToPad(page, 'MYTEXT');
    await expect(page.locator('#wordsContributed .stats')).toContainText('Me');
    // The default pad text contains a link, whose span carries a `url` class
    // alongside the author class. Character counts must ignore that class
    // rather than book it as a contributor of its own.
    await expect(page.locator('#numberOfCharsIncWS .stats')).toContainText('Me');
  });

  test('author stats ignore text the system author holds', async ({page}) => {
    // The default pad content is attributed to `a.etherpad-system`; nobody
    // wrote it, and core ships no author record for that id, so every span of
    // the welcome text used to land in an "Unknown Author" row here
    // (ether/etherpad#8044).
    await writeToPad(page, 'MYTEXT');
    // #numberOfCharsExcWS is commented out of templates/stats.html, so the
    // four rendered tables are the ones to check.
    for (const id of ['#wordsContributed', '#linesContributed',
      '#linesAsOnlyContributor', '#numberOfCharsIncWS']) {
      await expect(page.locator(`${id} .stats`)).not.toContainText('Unknown Author');
    }
  });
});
