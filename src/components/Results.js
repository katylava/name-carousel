import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { NotificationModal } from './NotificationModal';

export function Results({ drawName, setDrawName, names, exclusions, results, setResults }) {
  const [animationSpeed, setAnimationSpeed] = useState(2); // seconds per reveal
  const [visibleResults, setVisibleResults] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '' });

  // Load animation speed from localStorage
  useEffect(() => {
    const savedSpeed = localStorage.getItem('animationSpeed');
    if (savedSpeed !== null) {
      setAnimationSpeed(parseFloat(savedSpeed));
    }
  }, []);

  // Save animation speed to localStorage
  useEffect(() => {
    localStorage.setItem('animationSpeed', animationSpeed.toString());
  }, [animationSpeed]);

  // Reset visible results when results change
  useEffect(() => {
    if (results.length > 0) {
      const orderedResults = orderResultsAsChain(results);

      // Check if these are the same results we've already animated
      const lastAnimated = localStorage.getItem('lastAnimatedResults');
      const haveSameResults =
        lastAnimated &&
        JSON.stringify(JSON.parse(lastAnimated)) === JSON.stringify(results);

      // If we've already animated these results, show them immediately
      if (haveSameResults) {
        setVisibleResults(orderedResults);
        setIsAnimating(false);
        return;
      }

      setVisibleResults([]);
      setIsAnimating(true);

      if (animationSpeed === 0) {
        // Instant reveal
        setVisibleResults(orderedResults);
        setIsAnimating(false);
        localStorage.setItem('lastAnimatedResults', JSON.stringify(results));
      } else {
        // Animate reveals
        const timeouts = [];
        orderedResults.forEach((result, index) => {
          const timeout = setTimeout(
            () => {
              setVisibleResults(prev => [...prev, result]);
              if (index === orderedResults.length - 1) {
                setIsAnimating(false);
                localStorage.setItem(
                  'lastAnimatedResults',
                  JSON.stringify(results)
                );
                // Trigger confetti celebration
                setTimeout(() => {
                  celebrateWithConfetti();
                }, 300);
              }
            },
            index * animationSpeed * 1000
          );
          timeouts.push(timeout);
        });

        // Cleanup function to clear timeouts if component unmounts
        return () => {
          timeouts.forEach(timeout => clearTimeout(timeout));
        };
      }
    } else {
      setVisibleResults([]);
      setIsAnimating(false);
      localStorage.removeItem('lastAnimatedResults');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const runNameDraw = () => {
    const participants = names.map(name => ({
      name,
      drawn: false,
      exclusions: exclusions[name] || [],
      gives_to: null,
    }));

    let attempts = 0;
    const maxAttempts = 1000;

    while (attempts < maxAttempts) {
      attempts++;

      // Reset for new attempt
      const data = participants.map(p => ({
        ...p,
        drawn: false,
        gives_to: null,
      }));

      let success = true;

      for (const giver of data) {
        const availableRecipients = data.filter(
          recipient =>
            recipient.name !== giver.name &&
            !recipient.drawn &&
            !giver.exclusions.includes(recipient.name)
        );

        if (availableRecipients.length === 0) {
          success = false;
          break;
        }

        // Random selection
        const randomIndex = Math.floor(
          Math.random() * availableRecipients.length
        );
        const selectedRecipient = availableRecipients[randomIndex];

        giver.gives_to = selectedRecipient.name;
        selectedRecipient.drawn = true;
      }

      if (success) {
        return data;
      }
    }

    const participantCount = names.length;
    const exclusionCount = Object.values(exclusions).flat().length;
    throw new Error(
      `Could not find a valid solution after ${maxAttempts} attempts.\n\n` +
        `Suggestions:\n` +
        `- Try removing some exclusions (currently ${exclusionCount} exclusions for ${participantCount} people)\n` +
        `- Add more participants to increase possible matches\n` +
        `- Check for conflicting exclusion rules`
    );
  };

  // Order results to show all circles/chains
  const orderResultsAsChain = results => {
    const ordered = [];
    const visited = new Set();

    // Process all participants to handle multiple circles
    for (let i = 0; i < results.length; i++) {
      if (visited.has(results[i].name)) continue;

      // Start a new chain from this unvisited person
      let current = results[i];
      const chain = [];

      // Follow the chain until we complete a circle or revisit someone
      while (!visited.has(current.name)) {
        chain.push(current);
        visited.add(current.name);
        current = results.find(p => p.name === current.gives_to);
      }

      // Add this chain to the ordered results
      ordered.push(...chain);
    }

    return ordered;
  };

  const handleDraw = () => {
    try {
      const drawResults = runNameDraw();
      setResults(drawResults);
    } catch (error) {
      setNotification({
        isOpen: true,
        title: 'Draw Failed',
        message: error.message,
      });
    }
  };

  const handleCopy = () => {
    const resultsText = results
      .map(person => `${person.name} → ${person.gives_to}`)
      .join('\n');

    /* istanbul ignore next */
    navigator.clipboard.writeText(resultsText).then(() => {
      setNotification({
        isOpen: true,
        title: 'Success',
        message: 'Results copied to clipboard!',
      });
    });
  };

  const handleSave = () => {
    const resultsText = results
      .map(person => `${person.name} → ${person.gives_to}`)
      .join('\n');

    /* istanbul ignore next */
    const blob = new Blob([resultsText], { type: 'text/plain' });
    /* istanbul ignore next */
    const url = URL.createObjectURL(blob);
    /* istanbul ignore next */
    const a = document.createElement('a');
    /* istanbul ignore next */
    a.href = url;
    /* istanbul ignore next */
    a.download = 'name-draw-results.txt';
    /* istanbul ignore next */
    a.click();
    /* istanbul ignore next */
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const exportData = {
      drawName: drawName,
      names: names,
      exclusions: exclusions,
      results: results,
      exportDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    /* istanbul ignore next */
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    /* istanbul ignore next */
    const url = URL.createObjectURL(blob);
    /* istanbul ignore next */
    const a = document.createElement('a');
    /* istanbul ignore next */
    a.href = url;

    // Create filename with draw name and date
    const safeName = drawName.replace(/\s+/g, '_');
    const date = new Date().toISOString().split('T')[0];
    /* istanbul ignore next */
    a.download = `${safeName}_${date}.json`;

    /* istanbul ignore next */
    a.click();
    /* istanbul ignore next */
    URL.revokeObjectURL(url);
  };

  // Generate PNG blob for sharing or downloading
  const generatePNGBlob = () => {
    return new Promise(resolve => {
      /* istanbul ignore next */
      const canvas = document.createElement('canvas');
      /* istanbul ignore next */
      const ctx = canvas.getContext('2d');

      // Dynamic canvas dimensions based on content
      const width = 1200;
      const padding = 80;
      const headerHeight = 280;
      const lineHeight = 80;
      const footerHeight = 120;
      const resultsHeight = results.length * lineHeight;
      const height = headerHeight + resultsHeight + footerHeight + padding * 2;

      /* istanbul ignore next */
      canvas.width = width;
      /* istanbul ignore next */
      canvas.height = height;

      // Victorian circus background - cream with subtle texture
      /* istanbul ignore next */
      ctx.fillStyle = '#FFF5EE'; // Seashell cream
      /* istanbul ignore next */
      ctx.fillRect(0, 0, width, height);

      // Add subtle aged paper texture with random dots
      /* istanbul ignore next */
      ctx.fillStyle = 'rgba(139, 69, 19, 0.03)'; // Very faint brown
      for (let i = 0; i < 200; i++) {
        /* istanbul ignore next */
        const x = Math.random() * width;
        /* istanbul ignore next */
        const y = Math.random() * height;
        /* istanbul ignore next */
        const size = Math.random() * 2;
        /* istanbul ignore next */
        ctx.fillRect(x, y, size, size);
      }

      // Decorative border
      /* istanbul ignore next */
      ctx.strokeStyle = '#8B0000'; // Dark red
      /* istanbul ignore next */
      ctx.lineWidth = 8;
      /* istanbul ignore next */
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // Inner decorative border
      /* istanbul ignore next */
      ctx.strokeStyle = '#D19D4F'; // Gold
      /* istanbul ignore next */
      ctx.lineWidth = 4;
      /* istanbul ignore next */
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // Title - Victorian circus style
      const titleY = padding + 20;

      /* istanbul ignore next */
      ctx.fillStyle = '#8B0000'; // Circus crimson
      /* istanbul ignore next */
      ctx.font = 'bold 48px "Playfair Display", serif';
      /* istanbul ignore next */
      ctx.textAlign = 'center';
      /* istanbul ignore next */
      ctx.textBaseline = 'top';
      /* istanbul ignore next */
      ctx.fillText('🎠 CAROUSEL RESULTS 🎠', width / 2, titleY);

      // Draw name
      /* istanbul ignore next */
      ctx.font = 'bold 56px "Playfair Display", serif';
      /* istanbul ignore next */
      ctx.fillStyle = '#B22222'; // Firebrick red
      /* istanbul ignore next */
      ctx.fillText(drawName, width / 2, titleY + 70);

      // Decorative line under header
      const decorLineY = titleY + 150;
      /* istanbul ignore next */
      ctx.strokeStyle = '#D19D4F'; // Gold
      /* istanbul ignore next */
      ctx.lineWidth = 3;
      /* istanbul ignore next */
      ctx.beginPath();
      /* istanbul ignore next */
      ctx.moveTo(width / 4, decorLineY);
      /* istanbul ignore next */
      ctx.lineTo((width * 3) / 4, decorLineY);
      /* istanbul ignore next */
      ctx.stroke();

      // Results section
      const startY = decorLineY + 50;

      /* istanbul ignore next */
      ctx.font = '42px "Crimson Text", serif';
      /* istanbul ignore next */
      ctx.textAlign = 'center';

      results.forEach((person, index) => {
        const y = startY + index * lineHeight;

        // Alternating background stripes - circus tent style
        /* istanbul ignore next */
        ctx.fillStyle =
          index % 2 === 0
            ? 'rgba(178, 34, 34, 0.08)'
            : 'rgba(209, 157, 79, 0.08)'; // Faint crimson/gold
        /* istanbul ignore next */
        ctx.fillRect(60, y - 10, width - 120, lineHeight - 10);

        // Draw result text - centered
        /* istanbul ignore next */
        ctx.fillStyle = '#2F4F4F'; // Dark slate gray for readability
        /* istanbul ignore next */
        const text = `${person.name}  →  ${person.gives_to}`;
        /* istanbul ignore next */
        ctx.fillText(text, width / 2, y + 15);
      });

      // Footer with decorative flourish
      const footerY = startY + resultsHeight + 40;

      // Decorative line above footer
      /* istanbul ignore next */
      ctx.strokeStyle = '#D19D4F'; // Gold
      /* istanbul ignore next */
      ctx.lineWidth = 3;
      /* istanbul ignore next */
      ctx.beginPath();
      /* istanbul ignore next */
      ctx.moveTo(width / 4, footerY);
      /* istanbul ignore next */
      ctx.lineTo((width * 3) / 4, footerY);
      /* istanbul ignore next */
      ctx.stroke();

      /* istanbul ignore next */
      ctx.font = 'italic 36px "Crimson Text", serif';
      /* istanbul ignore next */
      ctx.textAlign = 'center';
      /* istanbul ignore next */
      ctx.fillStyle = '#8B0000'; // Dark red
      /* istanbul ignore next */
      ctx.fillText('🎪 The Carousel Has Spoken! 🎪', width / 2, footerY + 30);

      // Convert to blob
      /* istanbul ignore next */
      canvas.toBlob(blob => {
        resolve(blob);
      });
    });
  };

  const handlePNGExport = async () => {
    const blob = await generatePNGBlob();
    /* istanbul ignore next */
    const url = URL.createObjectURL(blob);
    /* istanbul ignore next */
    const a = document.createElement('a');
    /* istanbul ignore next */
    a.href = url;

    const safeName = drawName.replace(/\s+/g, '_');
    const date = new Date().toISOString().split('T')[0];
    /* istanbul ignore next */
    a.download = `${safeName}_${date}.png`;

    /* istanbul ignore next */
    a.click();
    /* istanbul ignore next */
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    // Generate PNG for sharing
    const blob = await generatePNGBlob();
    const safeName = drawName.replace(/\s+/g, '_');
    const date = new Date().toISOString().split('T')[0];
    const filename = `${safeName}_${date}.png`;

    // Create File object from blob
    const file = new File([blob], filename, { type: 'image/png' });

    // Check if Web Share API is available and supports files
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
        });
      } catch (error) {
        // User cancelled or share failed
        if (error.name !== 'AbortError') {
          setNotification({
            isOpen: true,
            title: 'Share Failed',
            message: 'Sharing failed. The PNG has been downloaded instead.',
          });
          // Fallback to download
          /* istanbul ignore next */
          const url = URL.createObjectURL(blob);
          /* istanbul ignore next */
          const a = document.createElement('a');
          /* istanbul ignore next */
          a.href = url;
          /* istanbul ignore next */
          a.download = filename;
          /* istanbul ignore next */
          a.click();
          /* istanbul ignore next */
          URL.revokeObjectURL(url);
        }
      }
    } else {
      // Fallback: download the PNG for desktop browsers or browsers that don't support file sharing
      setNotification({
        isOpen: true,
        title: 'Sharing Not Supported',
        message: "Your browser doesn't support image sharing. Downloading PNG instead.",
      });
      /* istanbul ignore next */
      const url = URL.createObjectURL(blob);
      /* istanbul ignore next */
      const a = document.createElement('a');
      /* istanbul ignore next */
      a.href = url;
      /* istanbul ignore next */
      a.download = filename;
      /* istanbul ignore next */
      a.click();
      /* istanbul ignore next */
      URL.revokeObjectURL(url);
    }
  };

  const handleSpeedChange = e => {
    setAnimationSpeed(parseFloat(e.target.value));
  };

  const celebrateWithConfetti = () => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // Victorian circus colors
    const colors = ['#B22222', '#D19D4F', '#8B0000', '#5F9EA0', '#FFF5EE'];

    // Multiple confetti bursts for a grand celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const confettiConfig = {
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    };

    const confettiConfig2 = {
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      /* istanbul ignore next */
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti(confettiConfig);
      confetti(confettiConfig2);
    }, 30);

    // Center burst at the end
    /* istanbul ignore next */
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      });
    }, duration / 2);
  };

  const handleDrawNameChange = e => {
    const newName = e.target.value;
    setDrawName(newName);
    localStorage.setItem('drawName', newName);
  };

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
  };

  const handleNameKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditingName(false);
    }
  };

  return (
    <>
      <div className="carousel-name-section">
        {isEditingName ? (
          <input
            type="text"
            value={drawName}
            onChange={handleDrawNameChange}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            className="carousel-name-input"
            autoFocus
          />
        ) : (
          <div className="carousel-name-display" onClick={handleNameClick}>
            <h3 className="carousel-name-title">{drawName}</h3>
            <span className="edit-icon">✏️</span>
          </div>
        )}
      </div>

      {results.length === 0 ? (
        <div className="draw-section">
          <div className="animation-control">
            <label htmlFor="animation-speed">
              Animation Speed: <strong>{animationSpeed} sec</strong> per reveal
              {animationSpeed > 0 && names.length > 0 && (
                <span>
                  {' '}
                  (total:{' '}
                  {animationSpeed * names.length >= 60
                    ? `${(animationSpeed * names.length / 60).toFixed(1)} min`
                    : `${animationSpeed * names.length} sec`})
                </span>
              )}
            </label>
            <input
              type="range"
              id="animation-speed"
              min="0"
              max="15"
              step="0.5"
              value={animationSpeed}
              onChange={handleSpeedChange}
              className="speed-slider"
            />
            <p className="speed-hint">
              {animationSpeed === 0
                ? 'Instant reveal (no animation)'
                : animationSpeed <= 2
                  ? 'Fast reveal'
                  : animationSpeed <= 5
                    ? 'Medium reveal'
                    : animationSpeed <= 10
                      ? 'Slow reveal'
                      : 'Very slow reveal (maximum suspense!)'}
            </p>
          </div>
          <p>Ready to draw names for {names.length} people</p>
          <button onClick={handleDraw} className="draw-button">
            🎲 Draw Names
          </button>
        </div>
      ) : (
        <div className="results-section">
          {isAnimating && (
            <p className="animation-status">
              Revealing {visibleResults.length} of {results.length} results...
            </p>
          )}
          <ul className="results-list">
            {visibleResults.map((person, index) => {
              // Only animate the most recently added item (last in the list during animation)
              // Once animation is complete, no items should animate
              const isNewItem =
                isAnimating && index === visibleResults.length - 1;

              // Randomly assign different animations to each item for more fun
              const animations = [
                'bounce-in',
                'slide-in',
                'fade-in',
                'zoom-in',
                'flip-in',
              ];
              const randomIndex = Math.floor(Math.random() * animations.length);
              const animationType = animations[randomIndex];

              return (
                <li
                  key={person.name}
                  className={`result-item ${isNewItem ? `result-item-${animationType}` : ''}`}
                >
                  <strong>{person.name}</strong> → {person.gives_to}
                </li>
              );
            })}
          </ul>

          <div className="results-actions">
            <div className="primary-actions">
              <button
                onClick={handleCopy}
                className="copy-button primary-action"
              >
                📋 Copy Results
              </button>
              <button
                onClick={handleShare}
                className="share-button primary-action"
              >
                📲 Share Results
              </button>
            </div>

            <div className="secondary-actions">
              <button onClick={() => setResults([])} className="redraw-button">
                🎲 Draw Again
              </button>
            </div>

            <div className="download-separator">
              <span>◆ ◆ ◆</span>
            </div>

            <div className="download-label">download results:</div>

            <div className="download-actions">
              <button
                onClick={handleExport}
                className="export-button"
                title="Save this draw to import next year and avoid repeat matches"
              >
                📤 Export Draw
              </button>
              <button onClick={handlePNGExport} className="png-export-button">
                🖼️ Save as PNG
              </button>
              <button onClick={handleSave} className="save-button">
                💾 Save to File
              </button>
            </div>
          </div>
          <p
            className="export-help"
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
            }}
          >
            <strong>💡 Tip:</strong> Export this draw to use next year -
            imported draws automatically exclude previous matches!
          </p>
        </div>
      )}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ isOpen: false, title: '', message: '' })}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
}
