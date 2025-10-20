export function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close help"
        >
          ✕
        </button>

        <h2 className="modal-title">🎪 About the Carousel</h2>

        <div className="modal-body">
          <p className="modal-intro">
            Step right up to the most extraordinary name-drawing apparatus ever
            conceived! This delightful contraption randomly assigns people to
            each other while avoiding certain pairings. Perfect for gift
            exchanges, secret santa events, or any situation requiring fair
            random matching.
          </p>

          <div className="modal-feature">
            <p>
              <strong>🎪 The Grand Assurance:</strong> No two people will be
              matched directly with each other. If Alice gives to Bob, then Bob
              will <em>not</em> be selected to give to Alice. A truly one-way
              carousel of unreturned names!
            </p>
          </div>

          <div className="modal-section">
            <h3>How it works:</h3>
            <ol>
              <li>
                <strong>Enter participant names</strong> - Add everyone who will
                participate
              </li>
              <li>
                <strong>Specify who cannot be matched</strong> - Set up
                exclusions for partners, previous matches, or any other
                conflicts
              </li>
              <li>
                <strong>Randomly assign matches</strong> - Let the app generate
                a valid draw that respects all your exclusion rules
              </li>
            </ol>
          </div>

          <div className="modal-section">
            <h3>Key Features:</h3>
            <ul>
              <li>
                <strong>Quick Setup for Couples:</strong> Easily exclude
                partners from matching with each other
              </li>
              <li>
                <strong>Import Previous Draws:</strong> Upload last year's
                results to automatically prevent repeat matches
              </li>
              <li>
                <strong>Export for Next Year:</strong> Save your draw to
                re-import next time
              </li>
              <li>
                <strong>Customizable Animation:</strong> Control the speed of
                the reveal or show results instantly
              </li>
              <li>
                <strong>Share Results:</strong> Export as PNG or share directly
                via mobile sharing
              </li>
            </ul>
          </div>

          <div className="modal-note">
            <p>
              <strong>Note:</strong> Your draw is saved locally in your browser.
              You won't lose your progress if you close this help modal or
              refresh the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
