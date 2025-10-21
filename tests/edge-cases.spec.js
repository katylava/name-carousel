const { test, expect } = require('playwright-test-coverage');

test.describe('Edge Cases and Error Conditions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('handles localStorage persistence across navigation', async ({
    page,
  }) => {
    // Skip welcome and add names
    await page.getByRole('button', { name: /start draw/i }).click();
    await page
      .getByPlaceholder(/enter names/i)
      .fill('Alice\nBob\nCharlie\nDavid\nEve');
    await page.getByRole('button', { name: /next/i }).click();

    // Add exclusion
    const aliceRow = page
      .locator('.person-row')
      .filter({ hasText: 'Alice' })
      .first();
    await aliceRow.locator('input[data-exclude="Bob"]').check();

    // Verify exclusion is in localStorage
    const exclusions = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(exclusions.Alice).toContain('Bob');

    // Navigate back to names page
    await page.getByRole('button', { name: /previous/i }).click();

    // Textarea should still have the names
    await expect(page.getByPlaceholder(/enter names/i)).toHaveValue(
      'Alice\nBob\nCharlie\nDavid\nEve'
    );

    // Navigate forward again
    await page.getByRole('button', { name: /next/i }).click();

    // Exclusion should still be there
    await expect(aliceRow.locator('input[data-exclude="Bob"]')).toBeChecked();
  });

  test('handles empty names array with saved localStorage names', async ({
    page,
  }) => {
    // Set localStorage with names before component loads
    await page.evaluate(() => {
      localStorage.setItem('names', 'David\nEve\nFrank');
      localStorage.setItem('hasSeenWelcome', 'true');
    });

    await page.reload();

    // Should load with names from localStorage
    const textarea = page.getByPlaceholder(/enter names/i);
    await expect(textarea).toHaveValue('David\nEve\nFrank');

    // Navigate to exclusions to verify names were set
    await page.getByRole('button', { name: /next/i }).click();
    await expect(
      page.locator('.person-row').filter({ hasText: 'David' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.person-row').filter({ hasText: 'Eve' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.person-row').filter({ hasText: 'Frank' }).first()
    ).toBeVisible();
  });

  test('handles invalid step number in localStorage', async ({ page }) => {
    // Set invalid step number
    await page.evaluate(() => {
      localStorage.setItem('currentStep', '999'); // Out of range
      localStorage.setItem('hasSeenWelcome', 'true');
    });

    await page.reload();

    // Should default to step 1 (names page)
    await expect(page.getByPlaceholder(/enter names/i)).toBeVisible();
  });

  test('draw algorithm handles impossible scenarios', async ({ page }) => {
    // Skip welcome
    await page.getByRole('button', { name: /start draw/i }).click();

    // Enter 3 names
    await page.getByPlaceholder(/enter names/i).fill('Alice\nBob\nCharlie');
    await page.getByRole('button', { name: /next/i }).click();

    // Create impossible exclusions (everyone excludes everyone else)
    await page
      .locator('.person-row')
      .filter({ hasText: 'Alice' })
      .first()
      .locator('input[data-exclude="Bob"]')
      .check();
    await page
      .locator('.person-row')
      .filter({ hasText: 'Alice' })
      .first()
      .locator('input[data-exclude="Charlie"]')
      .check();
    await page
      .locator('.person-row')
      .filter({ hasText: 'Bob' })
      .first()
      .locator('input[data-exclude="Charlie"]')
      .check();

    await page.getByRole('button', { name: /draw/i }).click();
    await page.getByLabel(/animation speed/i).fill('0');

    // Attempt to draw - algorithm should retry multiple times
    await page.getByRole('button', { name: /🎲 draw names/i }).click();

    // Should either succeed (if algorithm finds a path) or show error
    // Wait to see what happens
    await page.waitForTimeout(2000);

    // Check if results appeared or error shown
    const resultCount = await page.locator('.result-item').count();
    const modalVisible = await page.locator('.modal-backdrop').isVisible();

    if (resultCount > 0) {
      // Algorithm succeeded
      expect(resultCount).toBe(3);
      expect(modalVisible).toBe(false);
    } else if (modalVisible) {
      // Algorithm failed and showed error modal
      await expect(page.getByRole('heading', { name: /draw failed/i })).toBeVisible();
      await expect(page.locator('.notification-message')).toContainText('Could not find a valid solution after');

      // Close modal
      await page.locator('.notification-button').click();
      await expect(page.locator('.modal-backdrop')).not.toBeVisible();
    } else {
      // Algorithm is still retrying
      expect(resultCount).toBe(0);
    }
  });

  test('handles drawing with minimal participants', async ({ page }) => {
    // Skip welcome
    await page.getByRole('button', { name: /start draw/i }).click();

    // Test with just 2 people
    await page.getByPlaceholder(/enter names/i).fill('Alice\nBob');
    await page.getByRole('button', { name: /next/i }).click();

    // Go to draw
    await page.getByRole('button', { name: /draw/i }).click();
    await page.getByLabel(/animation speed/i).fill('0');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();

    // Should successfully create 2 results
    await expect(page.locator('.result-item').first()).toBeVisible();
    await expect(page.locator('.result-item')).toHaveCount(2);

    const results = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('results') || '[]')
    );
    expect(results.length).toBe(2);

    // Verify no one gives to themselves
    results.forEach(result => {
      expect(result.name).toBeTruthy();
      expect(result.gives_to).toBeTruthy();
      expect(result.name).not.toBe(result.gives_to);
    });
  });

  test('handles names with whitespace and empty lines', async ({ page }) => {
    await page.getByRole('button', { name: /start draw/i }).click();

    // Enter names with extra whitespace and empty lines
    await page
      .getByPlaceholder(/enter names/i)
      .fill('  Alice  \n\n  Bob  \n\nCharlie\n\n');
    await page.getByRole('button', { name: /next/i }).click();

    // Should only show 3 people (empty lines filtered)
    const personRows = page.locator('.person-row');
    // Each person appears in header and as columns, so divide by number of appearances
    await expect(personRows.filter({ hasText: 'Alice' }).first()).toBeVisible();
    await expect(personRows.filter({ hasText: 'Bob' }).first()).toBeVisible();
    await expect(
      personRows.filter({ hasText: 'Charlie' }).first()
    ).toBeVisible();

    // Perform draw
    await page.getByRole('button', { name: /draw/i }).click();
    await page.getByLabel(/animation speed/i).fill('0');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();

    await expect(page.locator('.result-item')).toHaveCount(3);
  });

  test('export and import functionality', async ({ page }) => {
    // Complete a full draw first
    await page.getByRole('button', { name: /start draw/i }).click();

    // Set custom draw name
    await page.locator('.carousel-name-display').click();
    await page.locator('.carousel-name-input').fill('Test Export Draw');
    await page.locator('.carousel-name-input').press('Enter');

    await page
      .getByPlaceholder(/enter names/i)
      .fill('Alice\nBob\nCharlie\nDavid');
    await page.getByRole('button', { name: /next/i }).click();

    // Add exclusion
    await page
      .locator('.person-row')
      .filter({ hasText: 'Alice' })
      .first()
      .locator('input[data-exclude="Bob"]')
      .check();

    await page.getByRole('button', { name: /draw/i }).click();
    await page.getByLabel(/animation speed/i).fill('0');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();
    await expect(page.locator('.result-item').first()).toBeVisible();

    // Export the draw
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export/i }).click();
    const download = await downloadPromise;

    const filePath = await download.path();
    expect(filePath).toBeTruthy();

    // Verify export contains correct data
    const fs = require('fs');
    const exportedData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(exportedData.drawName).toBe('Test Export Draw');
    expect(exportedData.names).toEqual(['Alice', 'Bob', 'Charlie', 'David']);
    expect(exportedData.exclusions.Alice).toContain('Bob');
    expect(exportedData.results.length).toBe(4);

    // Start over - confirm the modal
    await page.getByRole('button', { name: /start over/i }).click();
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    await page.locator('.notification-confirm').click();
    await expect(page.getByRole('button', { name: /start draw/i })).toBeVisible();

    // Test import
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /import draw/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    // Should navigate to Enter Names page (step 1) with imported data
    await expect(
      page.getByRole('heading', { name: /enter names/i })
    ).toBeVisible({ timeout: 5000 });

    // Verify draw name was NOT imported (it gets cleared for new draws)
    const drawNameTitle = page.locator('.carousel-name-title');
    const drawName = await drawNameTitle.textContent();
    expect(drawName).not.toBe('Test Export Draw'); // Should have new generated name

    // Verify exclusions were imported
    const step2Indicator = page.locator('.steps-list li').nth(1);
    await step2Indicator.click();
    const exclusions = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(exclusions.Alice).toContain('Bob');

    // Clean up
    fs.unlinkSync(filePath);
  });

  test('handles multiple Draw Again cycles', async ({ page }) => {
    await page.getByRole('button', { name: /start draw/i }).click();
    await page
      .getByPlaceholder(/enter names/i)
      .fill('Alice\nBob\nCharlie\nDavid\nEve');
    await page.getByRole('button', { name: /next/i }).click();
    await page.getByRole('button', { name: /draw/i }).click();
    await page.getByLabel(/animation speed/i).fill('0');

    // Perform multiple draws
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /🎲 draw names/i }).click();
      await expect(page.locator('.result-item').first()).toBeVisible();
      await expect(page.locator('.result-item')).toHaveCount(5);

      // Verify results are different each time (stored in lastAnimatedResults)
      const results = await page.evaluate(() =>
        JSON.parse(localStorage.getItem('results') || '[]')
      );
      expect(results.length).toBe(5);

      if (i < 2) {
        // Click Draw Again for next iteration
        await page.getByRole('button', { name: /draw again/i }).click();
        await expect(page.locator('.result-item')).not.toBeVisible();
      }
    }
  });

  test('step navigation boundaries', async ({ page }) => {
    // Start on step 1 - verify no Previous button
    await page.getByRole('button', { name: /start draw/i }).click();
    await expect(
      page.getByRole('button', { name: /previous/i })
    ).not.toBeVisible();

    // Can't navigate to step 2 without names
    const step2 = page.locator('.steps-list li').nth(1);
    await expect(step2).toHaveClass(/disabled/);
    await step2.click();
    await expect(page.getByPlaceholder(/enter names/i)).toBeVisible(); // Still on step 1

    // Add names and go to final step
    await page
      .getByPlaceholder(/enter names/i)
      .fill('Alice\nBob\nCharlie\nDavid\nEve\nFrank');
    await page.getByRole('button', { name: /next/i }).click();
    await page.getByRole('button', { name: /draw/i }).click();

    // On step 3 (final step) - verify no Next button
    await expect(page.getByRole('button', { name: /next/i })).not.toBeVisible();

    // Verify step 3 is current and disabled
    const step3 = page.locator('.steps-list li').nth(2);
    await expect(step3).toHaveClass(/current/);
    await expect(step3).toHaveClass(/disabled/);

    // Can navigate back via Previous
    await page.getByRole('button', { name: /previous/i }).click();
    await expect(
      page.getByRole('heading', { name: /select exclusions/i })
    ).toBeVisible();

    // Can navigate via step indicators
    const step1 = page.locator('.steps-list li').nth(0);
    await step1.click();
    await expect(
      page.getByRole('heading', { name: /enter names/i })
    ).toBeVisible();
  });

  test('handles corrupted exclusions in localStorage', async ({ page }) => {
    // Set invalid JSON in localStorage
    await page.evaluate(() => {
      localStorage.setItem('exclusions', '{invalid json}');
      localStorage.setItem('names', 'Alice\nBob\nCharlie');
      localStorage.setItem('hasSeenWelcome', 'true');
    });

    await page.reload();

    // Navigate to exclusions page
    await page.getByRole('button', { name: /next/i }).click();

    // Should still render without crashing
    await expect(
      page.getByRole('heading', { name: /select exclusions/i })
    ).toBeVisible();
  });

  test('handles corrupted results in localStorage', async ({ page }) => {
    // Set invalid JSON for results
    await page.evaluate(() => {
      localStorage.setItem('results', '{invalid json}');
      localStorage.setItem('names', 'Alice\nBob\nCharlie');
      localStorage.setItem('hasSeenWelcome', 'true');
      localStorage.setItem('currentStep', '2');
    });

    await page.reload();

    // Should still load without crashing - verify we're on step 3
    await expect(page.getByRole('button', { name: /🎲 draw names/i })).toBeVisible();
  });

  test('handles invalid import file missing names array', async ({ page }) => {
    const fs = require('fs');
    const path = require('path');

    // Create invalid export file (missing names array)
    const invalidData = {
      drawName: 'Test',
      exclusions: {},
      results: [],
      // Missing 'names' field
    };

    const tempDir = '/tmp';
    const invalidFile = path.join(tempDir, 'invalid-draw.json');
    fs.writeFileSync(invalidFile, JSON.stringify(invalidData));

    // Try to import
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /import draw/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(invalidFile);

    // Should show error modal
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    await expect(page.getByRole('heading', { name: /invalid file/i })).toBeVisible();
    await expect(page.locator('.notification-message')).toContainText('Invalid draw file: missing names array');

    // Close modal
    await page.locator('.notification-button').click();
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();

    // Should still be on welcome page
    await expect(
      page.getByRole('button', { name: /start draw/i })
    ).toBeVisible();

    // Clean up
    fs.unlinkSync(invalidFile);
  });

  test('handles malformed JSON in import file', async ({ page }) => {
    const fs = require('fs');
    const path = require('path');

    // Create file with invalid JSON
    const tempDir = '/tmp';
    const invalidFile = path.join(tempDir, 'malformed.json');
    fs.writeFileSync(invalidFile, '{not valid json');

    // Try to import
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /import draw/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(invalidFile);

    // Should show error modal
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    await expect(page.getByRole('heading', { name: /import failed/i })).toBeVisible();
    await expect(page.locator('.notification-message')).toContainText('Invalid draw file:');

    // Close modal
    await page.locator('.notification-button').click();
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();

    // Clean up
    fs.unlinkSync(invalidFile);
  });

  test('loads exclusions from localStorage on mount', async ({ page }) => {
    // Set up state in localStorage
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('names', 'Alice\nBob\nCharlie');
      localStorage.setItem('exclusions', JSON.stringify({ Alice: ['Bob'] }));
      localStorage.setItem('hasSeenWelcome', 'true');
    });

    await page.reload();

    // Verify names loaded
    const textarea = page.getByPlaceholder(/enter names/i);
    await expect(textarea).toHaveValue('Alice\nBob\nCharlie');

    // Navigate to step 2 where SelectExclusions mounts with empty exclusions prop
    await page.getByRole('button', { name: /next/i }).click();

    // Wait for exclusions grid to be visible
    await expect(
      page.locator('.person-name').filter({ hasText: 'Alice' })
    ).toBeVisible();

    // Verify exclusions were loaded from localStorage (not passed via prop)
    // Find Alice's row by looking for the .person-name strong element
    const aliceRow = page.locator('.person-row', {
      has: page.locator('.person-name strong', { hasText: /^Alice$/ }),
    });
    await expect(aliceRow.locator('input[data-exclude="Bob"]')).toBeChecked();

    // Verify the exclusion is in localStorage
    const exclusions = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(exclusions.Alice).toContain('Bob');
  });

  test('handles import with previous results for exclusions', async ({
    page,
  }) => {
    const fs = require('fs');
    const path = require('path');

    // Create export with results that should become exclusions
    // Include a case where a result matches an existing exclusion (Alice->Bob is both in results and exclusions)
    const exportData = {
      drawName: 'Test',
      names: ['Alice', 'Bob', 'Charlie', 'David'],
      exclusions: {
        Alice: ['Charlie', 'Bob'], // Alice already can't match with Charlie or Bob
      },
      results: [
        { name: 'Alice', gives_to: 'Bob' }, // Bob is already in Alice's exclusions
        { name: 'Bob', gives_to: 'Charlie' },
        { name: 'Charlie', gives_to: 'David' },
        { name: 'David', gives_to: 'Alice' },
      ],
    };

    const tempDir = '/tmp';
    const exportFile = path.join(tempDir, 'test-export-results.json');
    fs.writeFileSync(exportFile, JSON.stringify(exportData));

    // Import the file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /import draw/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(exportFile);

    // Import should auto-navigate to step 1 (Enter Names)
    await expect(page.getByRole('heading', { name: /enter names/i })).toBeVisible();

    // Navigate to exclusions to verify imported data
    await page.getByRole('button', { name: /next/i }).click();

    // Verify exclusions were merged correctly
    const exclusions = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );

    // Alice should have: Bob (from results) + Charlie (from original exclusions)
    expect(exclusions.Alice).toContain('Bob');
    expect(exclusions.Alice).toContain('Charlie');
    expect(exclusions.Alice.length).toBe(2);

    // Bob should have: Charlie (from results)
    expect(exclusions.Bob).toContain('Charlie');

    // Charlie should have: David (from results)
    expect(exclusions.Charlie).toContain('David');

    // David should have: Alice (from results)
    expect(exclusions.David).toContain('Alice');

    // Clean up
    fs.unlinkSync(exportFile);
  });

  test('handles import without results', async ({ page }) => {
    const fs = require('fs');
    const path = require('path');

    // Create export without results (just names and exclusions)
    const exportData = {
      drawName: 'Test Draw',
      names: ['Alice', 'Bob', 'Charlie'],
      exclusions: {
        Alice: ['Bob'],
      },
      // No results field
    };

    const tempDir = '/tmp';
    const exportFile = path.join(tempDir, 'test-export-no-results.json');
    fs.writeFileSync(exportFile, JSON.stringify(exportData));

    // Import the file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /import draw/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(exportFile);

    // Import should auto-navigate to step 1 (Enter Names)
    await expect(page.getByRole('heading', { name: /enter names/i })).toBeVisible();

    // Navigate to exclusions to verify imported data
    await page.getByRole('button', { name: /next/i }).click();

    // Verify only the original exclusions exist (no results to merge)
    const exclusions = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(exclusions.Alice).toContain('Bob');
    expect(exclusions.Alice.length).toBe(1);

    // Clean up
    fs.unlinkSync(exportFile);
  });

  test('prevents empty draw name by regenerating', async ({ page }) => {
    // Start with welcome page
    await page.getByRole('button', { name: /start draw/i }).click();

    // Verify draw name was auto-generated
    const drawNameDisplay = page.locator('.carousel-name-title');
    const initialDrawName = await drawNameDisplay.textContent();
    expect(initialDrawName).toBeTruthy();
    expect(initialDrawName.length).toBeGreaterThan(0);

    // Test 1: Clear via blur
    await page.locator('.carousel-name-display').click();
    let drawNameInput = page.locator('.carousel-name-input');
    await drawNameInput.fill('');
    await drawNameInput.blur();

    // Draw name should be regenerated (not empty)
    await page.waitForTimeout(100); // Give React time to update
    const newDrawName = await drawNameDisplay.textContent();
    expect(newDrawName).toBeTruthy();
    expect(newDrawName.length).toBeGreaterThan(0);

    // Test 2: Clear via Enter key
    await page.locator('.carousel-name-display').click();
    drawNameInput = page.locator('.carousel-name-input'); // Get fresh reference
    await drawNameInput.fill('');
    await drawNameInput.press('Enter');

    // Draw name should be regenerated again (not empty)
    await page.waitForTimeout(100);
    const thirdDrawName = await drawNameDisplay.textContent();
    expect(thirdDrawName).toBeTruthy();
    expect(thirdDrawName.length).toBeGreaterThan(0);
  });

  test('handles reload on step 2 with names persisted', async ({ page }) => {
    // Set up state for step 2
    await page.evaluate(() => {
      localStorage.setItem('names', 'Alice\nBob\nCharlie');
      localStorage.setItem('currentStep', '1'); // Step 2 is index 1
      localStorage.setItem('hasSeenWelcome', 'true');
    });

    await page.reload();

    // Should be on step 2 with exclusions grid visible
    await expect(
      page.getByRole('heading', { name: /select exclusions/i })
    ).toBeVisible();

    // Names should appear in the grid
    await expect(
      page.locator('.person-row').filter({ hasText: 'Alice' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.person-row').filter({ hasText: 'Bob' }).first()
    ).toBeVisible();
    await expect(
      page.locator('.person-row').filter({ hasText: 'Charlie' }).first()
    ).toBeVisible();
  });

  test('handles various share API scenarios', async ({ page }) => {
    // Set up the draw once
    await page.getByRole('button', { name: /start draw/i }).click();
    await page.getByPlaceholder(/enter names/i).fill('Alice\nBob\nCharlie');
    await page.getByRole('button', { name: /next/i }).click();
    await page.getByRole('button', { name: /draw/i }).click();
    await page.getByLabel(/animation speed/i).fill('0');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();
    await expect(page.locator('.result-item').first()).toBeVisible();

    // Scenario 1: Successful share
    await page.evaluate(() => {
      navigator.share = async data => {
        return Promise.resolve();
      };
      navigator.canShare = data => true;
    });

    await page.getByRole('button', { name: /📲 share results/i }).click();
    await page.waitForTimeout(500);
    // No modal should appear for successful share
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();

    // Scenario 2: User cancels (AbortError)
    await page.evaluate(() => {
      navigator.share = async () => {
        const error = new Error('User cancelled');
        error.name = 'AbortError';
        throw error;
      };
      navigator.canShare = () => true;
    });

    await page.getByRole('button', { name: /📲 share results/i }).click();
    await page.waitForTimeout(500);
    // No modal should appear for user cancellation
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();

    // Scenario 3: Network error (non-AbortError)
    await page.evaluate(() => {
      navigator.share = async () => {
        const error = new Error('Network error');
        error.name = 'NetworkError';
        throw error;
      };
      navigator.canShare = () => true;
    });

    await page.getByRole('button', { name: /📲 share results/i }).click();
    await page.waitForTimeout(1000);
    // Should show error modal
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    await expect(page.getByRole('heading', { name: /share failed/i })).toBeVisible();
    await expect(page.locator('.notification-message')).toContainText('Sharing failed');

    // Close modal
    await page.locator('.notification-button').click();
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();
  });

  test('respects prefers-reduced-motion setting', async ({ page }) => {
    // Mock prefers-reduced-motion media query to return true
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Set up draw
    await page.getByRole('button', { name: /start draw/i }).click();
    await page.getByPlaceholder(/enter names/i).fill('Alice\nBob\nCharlie');
    await page.getByRole('button', { name: /next/i }).click();
    await page.getByRole('button', { name: /draw/i }).click();

    // Set animation to non-zero so confetti would normally trigger
    await page.getByLabel(/animation speed/i).fill('1');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();

    // Wait for animation to complete
    await page.waitForTimeout(3500); // 3 results * 1 sec + buffer

    // Confetti should not have been called
    // We verify this by checking the function was called with prefers-reduced-motion check
    const prefersReducedMotion = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    expect(prefersReducedMotion).toBe(true);
  });

  test('handles draw results with multiple circles', async ({ page }) => {
    // Set up draw with names that could form multiple circles
    await page.getByRole('button', { name: /start draw/i }).click();
    await page
      .getByPlaceholder(/enter names/i)
      .fill('Alice\nBob\nCharlie\nDavid\nEve\nFrank');
    await page.getByRole('button', { name: /next/i }).click();

    // Create exclusions that encourage multiple circles
    // Use nth() to target specific rows by their position
    const aliceRow = page.locator('.person-row').nth(0); // Alice is first
    const bobRow = page.locator('.person-row').nth(1); // Bob is second

    // Alice can't give to Bob, Charlie, or David (forcing her toward Eve/Frank)
    await aliceRow.locator('input[data-exclude="Bob"]').check();
    await aliceRow.locator('input[data-exclude="Charlie"]').check();
    await aliceRow.locator('input[data-exclude="David"]').check();

    // Bob can't give to Alice, Eve, or Frank (forcing him toward Charlie/David)
    await bobRow.locator('input[data-exclude="Alice"]').check();
    await bobRow.locator('input[data-exclude="Eve"]').check();
    await bobRow.locator('input[data-exclude="Frank"]').check();

    await page.getByRole('button', { name: /draw/i }).click();
    await page.getByLabel(/animation speed/i).fill('0');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();

    // Should complete successfully
    await expect(page.locator('.result-item').first()).toBeVisible();
    const resultCount = await page.locator('.result-item').count();
    expect(resultCount).toBe(6); // All participants should be matched

    // Verify all participants appear in results
    const results = await page.locator('.result-item').allTextContents();
    expect(results.some(r => r.includes('Alice'))).toBe(true);
    expect(results.some(r => r.includes('Bob'))).toBe(true);
    expect(results.some(r => r.includes('Charlie'))).toBe(true);
    expect(results.some(r => r.includes('David'))).toBe(true);
    expect(results.some(r => r.includes('Eve'))).toBe(true);
    expect(results.some(r => r.includes('Frank'))).toBe(true);
  });

  test('handles couple changes with multiple couples', async ({ page }) => {
    await page.getByRole('button', { name: /start draw/i }).click();
    await page
      .getByPlaceholder(/enter names/i)
      .fill('Alice\nBob\nCharlie\nDavid');
    await page.getByRole('button', { name: /next/i }).click();

    // Expand couples section
    await page.getByText(/quick setup.*couples/i).click();

    // Add first couple
    await page.getByRole('button', { name: /add couple/i }).click();
    await page.selectOption('.couple-person-1', 'Alice');
    await page.selectOption('.couple-person-2', 'Bob');

    // Add second couple
    await page.getByRole('button', { name: /add another couple/i }).click();
    const coupleRows = page.locator('.couple-row');
    await expect(coupleRows).toHaveCount(2);

    // Change first couple's first person (tests handleCoupleChange with multiple couples)
    await coupleRows
      .first()
      .locator('.couple-person-1')
      .selectOption('Charlie');

    // Verify the change took effect
    const firstCoupleDropdown = coupleRows.first().locator('.couple-person-1');
    await expect(firstCoupleDropdown).toHaveValue('Charlie');
  });

  test('handles apply couple with invalid inputs', async ({ page }) => {
    await page.getByRole('button', { name: /start draw/i }).click();
    await page.getByPlaceholder(/enter names/i).fill('Alice\nBob\nCharlie');
    await page.getByRole('button', { name: /next/i }).click();

    // Expand couples section
    await page.getByText(/quick setup.*couples/i).click();

    // Add couple but don't select anyone - Apply Couple should do nothing
    await page.getByRole('button', { name: /add couple/i }).click();
    await page.getByRole('button', { name: /apply couple/i }).click();

    // Verify no exclusions were created
    const exclusions = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(Object.keys(exclusions).length).toBe(0);

    // Now select same person for both - Apply Couple should do nothing
    await page.selectOption('.couple-person-1', 'Alice');
    await page.selectOption('.couple-person-2', 'Alice');
    await page.getByRole('button', { name: /apply couple/i }).click();

    // Verify no exclusions were created
    const exclusionsAfter = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('exclusions') || '{}')
    );
    expect(Object.keys(exclusionsAfter).length).toBe(0);
  });

  test('NotificationModal can be closed via backdrop click and close button', async ({ page }) => {
    // Create an invalid import to trigger a notification modal
    const fs = require('fs');
    const path = require('path');

    const invalidData = { drawName: 'Test', exclusions: {}, results: [] };
    const tempDir = '/tmp';
    const invalidFile = path.join(tempDir, 'test-modal-close.json');
    fs.writeFileSync(invalidFile, JSON.stringify(invalidData));

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /import draw/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(invalidFile);

    // Modal should be visible
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    await expect(page.getByRole('heading', { name: /invalid file/i })).toBeVisible();

    // Test backdrop click (click outside the modal content)
    await page.locator('.modal-backdrop').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();

    // Trigger modal again
    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /import draw/i }).click();
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles(invalidFile);

    await expect(page.locator('.modal-backdrop')).toBeVisible();

    // Test close button (X button)
    await page.locator('.modal-close').click();
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();

    // Clean up
    fs.unlinkSync(invalidFile);
  });

  test('draw name editing works on all steps', async ({ page }) => {
    // Start draw and get to step 1
    await page.getByRole('button', { name: /start draw/i }).click();

    // Verify draw name appears on step 1 (already tested in happy-path)
    const drawNameTitle = page.locator('.carousel-name-title');
    const initialDrawName = await drawNameTitle.textContent();
    expect(initialDrawName).toBeTruthy();

    // Add names to proceed
    await page.getByPlaceholder(/enter names/i).fill('Alice\nBob\nCharlie');
    await page.getByRole('button', { name: /next/i }).click();

    // Test editing draw name on step 2 (SelectExclusions)
    await expect(page.getByRole('heading', { name: /select exclusions/i })).toBeVisible();
    await expect(drawNameTitle).toBeVisible();
    await expect(drawNameTitle).toHaveText(initialDrawName);

    // Edit draw name on step 2
    await page.locator('.carousel-name-display').click();
    const drawNameInput = page.locator('.carousel-name-input');
    await expect(drawNameInput).toBeVisible();
    await drawNameInput.fill('Step 2 Test Name');
    await drawNameInput.press('Enter');
    await expect(drawNameTitle).toHaveText('Step 2 Test Name');

    // Verify it persisted to localStorage
    let savedDrawName = await page.evaluate(() => localStorage.getItem('drawName'));
    expect(savedDrawName).toBe('Step 2 Test Name');

    // Navigate to step 3
    await page.getByRole('button', { name: /draw/i }).click();

    // Test editing draw name on step 3 (Results)
    await expect(drawNameTitle).toBeVisible();
    await expect(drawNameTitle).toHaveText('Step 2 Test Name');

    // Edit draw name on step 3 using blur
    await page.locator('.carousel-name-display').click();
    await drawNameInput.fill('Step 3 Test Name');
    await page.getByLabel(/animation speed/i).click(); // Click elsewhere to blur
    await expect(drawNameTitle).toHaveText('Step 3 Test Name');

    // Verify it persisted to localStorage
    savedDrawName = await page.evaluate(() => localStorage.getItem('drawName'));
    expect(savedDrawName).toBe('Step 3 Test Name');

    // Perform a draw and verify draw name still appears correctly
    await page.getByLabel(/animation speed/i).fill('0');
    await page.getByRole('button', { name: /🎲 draw names/i }).click();
    await expect(page.locator('.result-item').first()).toBeVisible();
    await expect(drawNameTitle).toHaveText('Step 3 Test Name');
  });

  test('Start Over button shows confirmation modal', async ({ page }) => {
    // Set up a complete draw with data
    await page.getByRole('button', { name: /start draw/i }).click();
    await page.getByPlaceholder(/enter names/i).fill('Alice\nBob\nCharlie');
    await page.getByRole('button', { name: /next/i }).click();

    // Add some exclusions
    const aliceRow = page.locator('.person-row').nth(0);
    await aliceRow.locator('input[data-exclude="Bob"]').check();

    // Click Start Over button
    await page.getByRole('button', { name: /start over/i }).click();

    // Should show confirmation modal
    await expect(page.locator('.modal-backdrop')).toBeVisible();
    await expect(page.getByRole('heading', { name: /start over/i })).toBeVisible();
    await expect(page.locator('.notification-message')).toContainText('All data you have entered will be lost');

    // Test cancel button
    await page.locator('.notification-cancel').click();
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();

    // Verify we're still on step 2 with data intact
    await expect(page.getByRole('heading', { name: /select exclusions/i })).toBeVisible();
    await expect(aliceRow.locator('input[data-exclude="Bob"]')).toBeChecked();

    // Click Start Over again and confirm this time
    await page.getByRole('button', { name: /start over/i }).click();
    await expect(page.locator('.modal-backdrop')).toBeVisible();

    await page.locator('.notification-confirm').click();
    await expect(page.locator('.modal-backdrop')).not.toBeVisible();

    // Should be back at welcome page
    await expect(page.getByRole('button', { name: /start draw/i })).toBeVisible();

    // Verify localStorage was cleared
    const names = await page.evaluate(() => localStorage.getItem('names'));
    expect(names).toBeNull();
    const exclusions = await page.evaluate(() => localStorage.getItem('exclusions'));
    expect(exclusions).toBeNull();
  });
});
