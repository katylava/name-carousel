export function Welcome({
  onStart,
  setNames,
  setDrawName,
  setExclusions,
  setResults,
}) {
  const handleImport = e => {
    const file = e.target.files[0];
    /* istanbul ignore next */
    if (!file) return; // Not testable in Playwright - file picker cancellation doesn't trigger onChange

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const data = JSON.parse(event.target.result);

        // Validate required fields
        if (!data.names || !Array.isArray(data.names)) {
          alert('Invalid draw file: missing names array');
          return;
        }

        // Set names
        const namesText = data.names.join('\n');
        setNames(data.names);
        localStorage.setItem('names', namesText);

        // Clear draw name for new draw
        setDrawName('');
        localStorage.setItem('drawName', '');

        // Merge exclusions: previous + previous match exclusions
        const mergedExclusions = { ...data.exclusions };

        // Add previous match exclusions
        if (data.results && Array.isArray(data.results)) {
          data.results.forEach(result => {
            const giver = result.name;
            const recipient = result.gives_to;

            if (!mergedExclusions[giver]) {
              mergedExclusions[giver] = [];
            }

            if (!mergedExclusions[giver].includes(recipient)) {
              mergedExclusions[giver].push(recipient);
            }
          });
        }

        setExclusions(mergedExclusions);
        localStorage.setItem('exclusions', JSON.stringify(mergedExclusions));

        // Clear results for new draw
        setResults([]);
        localStorage.removeItem('results');

        // Mark welcome as seen and start the draw
        localStorage.setItem('hasSeenWelcome', 'true');

        alert(
          'Draw imported successfully! Previous matches have been added as exclusions.'
        );
        onStart();
      } catch (error) {
        alert('Invalid draw file: ' + error.message);
      }
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <p className="welcome-intro">
          Step right up to the most extraordinary name-drawing apparatus ever
          conceived! This delightful contraption randomly assigns people to each
          other while avoiding certain pairings. Perfect for gift exchanges,
          secret santa events, or any situation requiring fair random matching.
        </p>

        <div className="key-feature">
          <p>
            <strong>🎪 The Grand Assurance:</strong> No two people will be
            matched directly with each other. If Alice gives to Bob, then Bob
            will <em>not</em> be selected to give to Alice. A truly one-way
            carousel of unreturned names!
          </p>
        </div>

        <div className="workflow-steps">
          <h3>How it works:</h3>
          <ol>
            <li>
              <strong>Enter participant names</strong> - Add everyone who will
              participate
            </li>
            <li>
              <strong>Specify who cannot be matched</strong> - Set up exclusions
              for partners, previous matches, or any other conflicts
            </li>
            <li>
              <strong>Randomly assign matches</strong> - Let the app generate a
              valid draw that respects all your exclusion rules
            </li>
          </ol>
        </div>
      </div>

      <div className="welcome-actions">
        <button onClick={onStart} className="start-button">
          Start Draw
        </button>

        <div className="import-section">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
            id="import-file-input"
          />
          <label htmlFor="import-file-input">
            <button
              type="button"
              onClick={() =>
                document.getElementById('import-file-input').click()
              }
              className="import-button"
            >
              📥 Import Draw
            </button>
          </label>
          <p className="import-help">
            <strong>💡 Tip:</strong> Import last year's draw to automatically
            exclude previous matches
          </p>
        </div>
      </div>
    </div>
  );
}
