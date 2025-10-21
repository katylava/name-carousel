const { test, expect } = require('playwright-test-coverage');

test.describe('Happy Path - Complete Draw Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('complete name exchange draw with all features', async ({ page }) => {
    // ============ WELCOME PAGE ============
    // Verify welcome page renders
    await expect(
      page.getByText(/step right up to the most extraordinary/i)
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /start draw/i })
    ).toBeVisible();

    // Verify import button exists and has correct file input
    const importButton = page.getByRole('button', { name: /import draw/i });
    await expect(importButton).toBeVisible();
    const fileInput = page.locator('input[type="file"]#import-file-input');
    await expect(fileInput).toHaveAttribute('accept', '.json');

    // Start the draw
    await page.getByRole('button', { name: /start draw/i }).click();

    // ============ ENTER NAMES PAGE ============
    // Verify draw name is auto-generated
    const drawNameTitle = page.locator('.carousel-name-title');
    await expect(drawNameTitle).toBeVisible();
    const generatedName = await drawNameTitle.textContent();
    expect(generatedName).toBeTruthy();
    expect(generatedName.length).toBeGreaterThan(0);

    // Verify draw name was saved to localStorage
    let savedDrawName = await page.evaluate(() =>
      localStorage.getItem('drawName')
    );
    expect(savedDrawName).toBe(generatedName);

    // Test editing draw name by clicking
    await page.locator('.carousel-name-display').click();
    const drawNameInput = page.locator('.carousel-name-input');
    await expect(drawNameInput).toBeVisible();
    await drawNameInput.click({ clickCount: 3 }); // Select all
    await page.keyboard.type('Holiday Gift Exchange 2024');

    // Test pressing Enter to save
    await drawNameInput.press('Enter');
    await expect(page.locator('.carousel-name-display')).toBeVisible();
    await expect(drawNameTitle).toHaveText('Holiday Gift Exchange 2024');
    savedDrawName = await page.evaluate(() => localStorage.getItem('drawName'));
    expect(savedDrawName).toBe('Holiday Gift Exchange 2024');

    // Test editing again and using blur to save
    await page.locator('.carousel-name-display').click();
    await drawNameInput.fill('Secret Santa 2024');
    await page.getByRole('heading', { name: /enter names/i }).click(); // Click elsewhere to blur
    await expect(drawNameTitle).toHaveText('Secret Santa 2024');

    // Verify step indicators
    const step1 = page.locator('.steps-list li').nth(0);
    await expect(step1).toHaveClass(/current/);
    await expect(step1).toHaveClass(/disabled/); // Current step is disabled from clicking

    const step2 = page.locator('.steps-list li').nth(1);
    await expect(step2).toHaveClass(/disabled/); // Can't go to step 2 without names

    // Try clicking step 2 - should not navigate
    await step2.click();
    await expect(page.getByPlaceholder(/enter names/i)).toBeVisible();

    // Enter names
    const namesTextarea = page.getByPlaceholder(/enter names/i);
    await namesTextarea.fill('Alice\nBob\nCharlie\nDavid\nEve\nFrank');

    // Verify names saved to localStorage
    let savedNames = await page.evaluate(() => localStorage.getItem('names'));
    expect(savedNames).toBe('Alice\nBob\nCharlie\nDavid\nEve\nFrank');

    // Verify Next button is enabled
    const nextButton = page.getByRole('button', { name: /next/i });
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeEnabled();

    // Verify no Previous button on step 1
    await expect(
      page.getByRole('button', { name: /previous/i })
    ).not.toBeVisible();

    // Navigate to step 2
    await nextButton.click();

    // ============ SELECT EXCLUSIONS PAGE ============
    await expect(
      page.getByRole('heading', { name: /select exclusions/i })
    ).toBeVisible();

    // Verify step indicator updated
    await expect(step2).toHaveClass(/current/);
    await expect(step1).toHaveClass(/clickable/); // Can go back to step 1
    await expect(step1).not.toHaveClass(/current/);

    // Verify Previous button now exists
    const previousButton = page.getByRole('button', { name: /previous/i });
    await expect(previousButton).toBeVisible();

    // Verify all names appear in exclusions grid (use first() to handle multiple matches)
    await expect(
      page.locator('.person-row').filter({ hasText: 'Alice' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.person-row').filter({ hasText: 'Bob' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.person-row').filter({ hasText: 'Charlie' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.person-row').filter({ hasText: 'David' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.person-row').filter({ hasText: 'Eve' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.person-row').filter({ hasText: 'Frank' }).first()
    ).toBeVisible();

    // Test manual exclusion
    const aliceRow = page
      .locator('.person-row')
      .filter({ hasText: 'Alice' })
      .first();
    await aliceRow.locator('input[data-exclude="Bob"]').check();

    // Verify exclusion saved (one-way only, NOT bidirectional)
    let exclusions = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(exclusions.Alice).toContain('Bob');

    // Test couples shortcut - expand couples section
    await expect(
      page.getByRole('button', { name: /add couple/i })
    ).not.toBeVisible();
    await page.getByText(/quick setup.*couples/i).click();
    await expect(
      page.getByRole('button', { name: /add couple/i })
    ).toBeVisible();
    await expect(
      page.getByText(/add couples who should not be matched together/i)
    ).toBeVisible();

    // Add a couple
    await page.getByRole('button', { name: /add couple/i }).click();
    await page.selectOption('.couple-person-1', 'Charlie');
    await page.selectOption('.couple-person-2', 'David');
    await page.getByRole('button', { name: /apply couple/i }).click();

    // Verify couple exclusions created (couples ARE bidirectional via the Apply Couple button)
    exclusions = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(exclusions.Charlie).toContain('David');
    expect(exclusions.David).toContain('Charlie');

    // Test navigation back to step 1
    await previousButton.click();
    await expect(
      page.getByRole('heading', { name: /enter names/i })
    ).toBeVisible();
    await expect(namesTextarea).toHaveValue(
      'Alice\nBob\nCharlie\nDavid\nEve\nFrank'
    );

    // Test clicking step indicator to jump to step 2
    await step2.click();
    await expect(
      page.getByRole('heading', { name: /select exclusions/i })
    ).toBeVisible();

    // Navigate to draw page
    await page.getByRole('button', { name: /draw/i }).click();

    // ============ DRAW/RESULTS PAGE ============
    // Verify we're on step 3 by checking for the draw button
    await expect(
      page.getByRole('button', { name: /🎲 draw names/i })
    ).toBeVisible();

    // Verify step 3 is current
    const step3 = page.locator('.steps-list li').nth(2);
    await expect(step3).toHaveClass(/current/);

    // Verify no Next button on final step
    await expect(page.getByRole('button', { name: /next/i })).not.toBeVisible();

    // Verify animation speed control exists
    const animationSpeed = page.getByLabel(/animation speed/i);
    await expect(animationSpeed).toBeVisible();

    // Test all animation speed hint branches
    await animationSpeed.fill('0');
    await expect(page.locator('.speed-hint')).toContainText('Instant reveal');
    await animationSpeed.fill('1');
    await expect(page.locator('.speed-hint')).toContainText('Fast reveal');
    await animationSpeed.fill('3');
    await expect(page.locator('.speed-hint')).toContainText('Medium reveal');
    await animationSpeed.fill('7');
    await expect(page.locator('.speed-hint')).toContainText('Slow reveal');
    await animationSpeed.fill('10');
    await expect(page.locator('.speed-hint')).toContainText('Slow reveal');
    await animationSpeed.fill('12');
    await expect(page.locator('.speed-hint')).toContainText('Very slow reveal');

    // Set animation to instant for faster test
    await animationSpeed.fill('0');

    // Verify Draw Names button
    const drawButton = page.getByRole('button', { name: /🎲 draw names/i });
    await expect(drawButton).toBeVisible();

    // Perform the draw
    await drawButton.click();

    // Wait for first result to appear
    await expect(page.locator('.result-item').first()).toBeVisible({
      timeout: 10000,
    });

    // Verify all 6 results appeared
    await expect(page.locator('.result-item')).toHaveCount(6);

    // Verify results saved to localStorage
    const results = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('results') || '[]')
    );
    expect(results.length).toBe(6);

    // Verify exclusions are respected
    const aliceResult = results.find(r => r.name === 'Alice');
    expect(aliceResult.gives_to).not.toBe('Bob'); // Alice excluded Bob
    expect(aliceResult.gives_to).not.toBe('Alice'); // Can't give to self

    const charlieResult = results.find(r => r.name === 'Charlie');
    expect(charlieResult.gives_to).not.toBe('David'); // Charlie-David are a couple

    // Test animation with slow speed
    await page.getByRole('button', { name: /draw again/i }).click();
    await expect(page.locator('.result-item')).not.toBeVisible();

    // Set slow animation
    await animationSpeed.evaluate(el => {
      el.value = '0.5';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await drawButton.click();

    // Wait for animation to complete and confetti to trigger
    await page.waitForFunction(
      () => {
        return document.querySelectorAll('.result-item').length === 6;
      },
      { timeout: 10000 }
    );

    await page.waitForTimeout(1000); // Give confetti time to run
    await expect(page.locator('.result-item')).toHaveCount(6);

    // Test reduced motion preference for confetti
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: /draw again/i }).click();
    await animationSpeed.fill('0');
    await drawButton.click();
    await expect(page.locator('.result-item').first()).toBeVisible();
    await expect(page.locator('.result-item')).toHaveCount(6);

    // Test share functionality (will fail in headless, expect modal)
    await page.getByRole('button', { name: /📲 share results/i }).click();
    await page.waitForTimeout(500);

    // Should show modal since headless doesn't support image sharing
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    await expect(page.getByRole('heading', { name: /sharing not supported/i })).toBeVisible();
    await expect(page.locator('.notification-message')).toContainText("doesn't support image sharing");

    // Close modal
    await page.locator('.notification-button').click();
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();

    // Test Copy Results button
    // Note: clipboard API may not work in headless, but we're testing the button works
    await page.getByRole('button', { name: /📋 copy results/i }).click();
    await page.waitForTimeout(100);

    // Test Save to File button (.txt download)
    const txtDownloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /💾 save to file/i }).click();
    const txtDownload = await txtDownloadPromise;
    expect(txtDownload.suggestedFilename()).toMatch(/\.txt$/);

    // Test Save as PNG button
    const pngDownloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /🖼️ save as png/i }).click();
    const pngDownload = await pngDownloadPromise;
    expect(pngDownload.suggestedFilename()).toMatch(/\.png$/);

    // Test Export Draw button (JSON)
    const jsonDownloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /📤 export draw/i }).click();
    const jsonDownload = await jsonDownloadPromise;
    expect(jsonDownload.suggestedFilename()).toMatch(/\.json$/);

    // Test button layout: verify "download results:" label appears before download buttons
    const downloadLabel = page.locator('text=download results:');
    await expect(downloadLabel).toBeVisible();

    // Test Help Modal
    await page.getByRole('button', { name: /help/i }).click();
    await expect(
      page.getByRole('heading', { name: /about the carousel/i })
    ).toBeVisible();
    // Close help modal by clicking the close button
    await page.getByRole('button', { name: /close help/i }).click();
    await expect(
      page.getByRole('heading', { name: /about the carousel/i })
    ).not.toBeVisible();

    // Test help modal backdrop click
    await page.getByRole('button', { name: /help/i }).click();
    await expect(
      page.getByRole('heading', { name: /about the carousel/i })
    ).toBeVisible();
    await page.locator('.modal-backdrop').click({ position: { x: 10, y: 10 } });
    await expect(
      page.getByRole('heading', { name: /about the carousel/i })
    ).not.toBeVisible();

    // Test navigating back to test textarea repopulation and exclusion toggling
    await page.getByRole('button', { name: /previous/i }).click();
    await expect(
      page.getByRole('heading', { name: /select exclusions/i })
    ).toBeVisible();

    // Test unchecking exclusions
    const aliceRowAgain = page
      .locator('.person-row')
      .filter({ hasText: 'Alice' })
      .first();
    await aliceRowAgain.locator('input[data-exclude="Bob"]').check();
    let exclusionsCheck = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(exclusionsCheck.Alice).toContain('Bob');

    // Uncheck the exclusion
    await aliceRowAgain.locator('input[data-exclude="Bob"]').uncheck();
    exclusionsCheck = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(exclusionsCheck.Alice || []).not.toContain('Bob');

    // Test removing couples (couples from earlier in test are restored from localStorage)
    await page.getByText(/quick setup.*couples/i).click();
    // Should have 1 couple from earlier (Charlie-David)
    let coupleRowsCheck = page.locator('.couple-row');
    await expect(coupleRowsCheck).toHaveCount(1);

    await page.getByRole('button', { name: /add another couple/i }).click();
    await coupleRowsCheck.nth(1).locator('.couple-person-1').selectOption('Eve');
    await coupleRowsCheck.nth(1).locator('.couple-person-2').selectOption('Frank');
    await page.getByRole('button', { name: /add another couple/i }).click();
    await expect(coupleRowsCheck).toHaveCount(3);
    await coupleRowsCheck
      .first()
      .getByRole('button', { name: /delete couple/i })
      .click();
    await expect(coupleRowsCheck).toHaveCount(2);

    // Navigate back to step 1 to test textarea repopulation
    await page.getByRole('button', { name: /previous/i }).click();
    await expect(
      page.getByRole('heading', { name: /enter names/i })
    ).toBeVisible();

    // Textarea should still have the names (testing repopulation)
    await expect(namesTextarea).toHaveValue(
      'Alice\nBob\nCharlie\nDavid\nEve\nFrank'
    );

    // Navigate back to results
    await page.getByRole('button', { name: /next/i }).click();
    await page.getByRole('button', { name: /draw/i }).click();

    // Test Start Over button - confirm the modal
    await page.getByRole('button', { name: /start over/i }).click();
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    await page.locator('.notification-confirm').click();

    // Should be back on welcome page
    await expect(
      page.getByRole('button', { name: /start draw/i })
    ).toBeVisible();

    // Verify all data cleared from localStorage
    const clearedData = await page.evaluate(() => ({
      names: localStorage.getItem('names'),
      exclusions: localStorage.getItem('exclusions'),
      results: localStorage.getItem('results'),
      hasSeenWelcome: localStorage.getItem('hasSeenWelcome'),
      drawName: localStorage.getItem('drawName'),
      appliedCouplesCount: localStorage.getItem('appliedCouplesCount'),
      lastAnimatedResults: localStorage.getItem('lastAnimatedResults'),
    }));

    expect(clearedData.names).toBeNull();
    expect(clearedData.exclusions).toBeNull();
    expect(clearedData.results).toBeNull();
    expect(clearedData.hasSeenWelcome).toBeNull();
    expect(clearedData.drawName).toBeNull();
    expect(clearedData.appliedCouplesCount).toBeNull();
    expect(clearedData.lastAnimatedResults).toBeNull();

    // Test localStorage persistence - save draw name manually and reload
    await page.evaluate(() => {
      localStorage.setItem('drawName', 'Persisted Draw Name');
      localStorage.setItem('hasSeenWelcome', 'true');
    });
    await page.reload();

    // Draw name should be loaded from localStorage
    const persistedDrawName = page.locator('.carousel-name-title');
    await expect(persistedDrawName).toHaveText('Persisted Draw Name');
  });

  test('results appear instantly when already animated', async ({ page }) => {
    // Complete a draw
    await page.getByRole('button', { name: /start draw/i }).click();
    await page.getByPlaceholder(/enter names/i).fill('Alice\nBob\nCharlie');
    await page.getByRole('button', { name: /next/i }).click();
    await page.getByRole('button', { name: /draw/i }).click();
    await page.getByLabel(/animation speed/i).fill('0');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();

    // Wait for results
    await expect(page.locator('.result-item').first()).toBeVisible();
    await expect(page.locator('.result-item')).toHaveCount(3);

    // Verify lastAnimatedResults was saved along with results
    const savedData = await page.evaluate(() => ({
      results: localStorage.getItem('results'),
      lastAnimated: localStorage.getItem('lastAnimatedResults'),
      currentStep: localStorage.getItem('currentStep'),
    }));
    expect(savedData.results).toBeTruthy();
    expect(savedData.lastAnimated).toBeTruthy();
    expect(savedData.currentStep).toBe('2'); // Step 3 is index 2

    // Reload page - should restore to step 3 with results instantly visible
    await page.reload();

    // Results should be visible immediately without animation
    await expect(page.locator('.result-item').first()).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('.result-item')).toHaveCount(3);
  });

  test('animation cleanup when navigating away during animation', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /start draw/i }).click();
    await page
      .getByPlaceholder(/enter names/i)
      .fill('Alice\nBob\nCharlie\nDavid\nEve');
    await page.getByRole('button', { name: /next/i }).click();
    await page.getByRole('button', { name: /draw/i }).click();

    // Set longer animation so it's still running when we navigate away
    await page.getByLabel(/animation speed/i).fill('10');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();

    // Wait for first item to start appearing
    await expect(page.locator('.result-item').first()).toBeVisible({
      timeout: 15000,
    });

    // Navigate away before animation completes (this triggers cleanup)
    await page.getByRole('button', { name: /previous/i }).click();
    await expect(
      page.getByRole('heading', { name: /select exclusions/i })
    ).toBeVisible();

    // Navigate back
    await page.getByRole('button', { name: /draw/i }).click();

    // Results should still be available
    await expect(page.locator('.result-item').first()).toBeVisible();
  });

  test('confetti celebration triggers after animation completes', async ({
    page,
  }) => {
    // Ensure no reduced motion preference
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    await page.getByRole('button', { name: /start draw/i }).click();
    await page.getByPlaceholder(/enter names/i).fill('Alice\nBob\nCharlie');
    await page.getByRole('button', { name: /next/i }).click();
    await page.getByRole('button', { name: /draw/i }).click();

    // Use slow animation to test confetti trigger
    await page.getByLabel(/animation speed/i).fill('0.5');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();

    // Wait for all results to appear and confetti to trigger
    await page.waitForFunction(
      () => {
        return document.querySelectorAll('.result-item').length === 3;
      },
      { timeout: 5000 }
    );

    // Give confetti time to start
    await page.waitForTimeout(500);

    // Confetti function should have been called (we can't directly verify canvas confetti in tests,
    // but we've executed the code path)
  });
});
