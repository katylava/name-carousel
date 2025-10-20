import { useState, useEffect } from 'react';

export function SelectExclusions({
  drawName,
  setDrawName,
  names,
  exclusions,
  setExclusions,
}) {
  const [couples, setCouples] = useState([]);
  const [couplesExpanded, setCouplesExpanded] = useState(false);
  const [appliedCouplesCount, setAppliedCouplesCount] = useState(0);

  // Load exclusions from localStorage on component mount
  useEffect(() => {
    const savedExclusions = localStorage.getItem('exclusions');
    if (savedExclusions && Object.keys(exclusions).length === 0) {
      try {
        const parsedExclusions = JSON.parse(savedExclusions);
        setExclusions(parsedExclusions);
      } catch (e) {
        console.error('Failed to parse saved exclusions:', e);
      }
    }

    // Load couple count
    const savedCoupleCount = localStorage.getItem('appliedCouplesCount');
    if (savedCoupleCount) {
      setAppliedCouplesCount(parseInt(savedCoupleCount, 10));
    }
  }, [exclusions, setExclusions]);

  // Save exclusions to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(exclusions).length > 0) {
      localStorage.setItem('exclusions', JSON.stringify(exclusions));
    }
  }, [exclusions]);

  const handleExclusionToggle = (giver, excluded) => {
    setExclusions(prev => {
      const personExclusions = prev[giver] || [];
      const newExclusions = { ...prev };

      if (personExclusions.includes(excluded)) {
        newExclusions[giver] = personExclusions.filter(
          name => name !== excluded
        );
      } else {
        newExclusions[giver] = [...personExclusions, excluded];
      }

      return newExclusions;
    });
  };

  const handleAddCouple = () => {
    setCouples(prev => [...prev, { person1: '', person2: '' }]);
  };

  const handleCoupleChange = (index, field, value) => {
    setCouples(prev =>
      prev.map((couple, i) =>
        i === index ? { ...couple, [field]: value } : couple
      )
    );
  };

  const handleApplyCouple = index => {
    const couple = couples[index];
    if (couple.person1 && couple.person2 && couple.person1 !== couple.person2) {
      // Make them mutually exclusive
      handleExclusionToggle(couple.person1, couple.person2);
      handleExclusionToggle(couple.person2, couple.person1);
      const newCount = appliedCouplesCount + 1;
      setAppliedCouplesCount(newCount);
      localStorage.setItem('appliedCouplesCount', newCount.toString());
    }
  };

  const handleRemoveCouple = index => {
    setCouples(prev => prev.filter((_, i) => i !== index));
  };

  const getExclusionsSummary = () => {
    const summary = [];
    Object.entries(exclusions).forEach(([person, excluded]) => {
      if (excluded.length > 0) {
        summary.push(
          `${person} cannot be matched with: ${excluded.join(', ')}`
        );
      }
    });
    return summary;
  };

  return (
    <>
      <h2>Select exclusions</h2>
      <p>Choose who cannot be matched with whom</p>

      <div className="couples-section">
        <div
          className="couples-header"
          onClick={() => setCouplesExpanded(!couplesExpanded)}
          style={{ cursor: 'pointer' }}
        >
          <h3>
            <span className="expand-arrow">
              {couplesExpanded ? '▼' : '►'}
            </span>{' '}
            Quick Setup: Couples
            {!couplesExpanded && (
              <span className="couples-count">
                {' '}
                - {appliedCouplesCount}{' '}
                {appliedCouplesCount === 1 ? 'couple' : 'couples'} configured
              </span>
            )}
          </h3>
        </div>

        {couplesExpanded && (
          <>
            <p>Add couples who should not be matched together</p>

            {couples.map((couple, index) => (
              <div key={index} className="couple-row">
                <select
                  className="couple-person-1"
                  value={couple.person1}
                  onChange={e =>
                    handleCoupleChange(index, 'person1', e.target.value)
                  }
                >
                  <option value="">Select person...</option>
                  {names.map(name => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <span> and </span>
                <select
                  className="couple-person-2"
                  value={couple.person2}
                  onChange={e =>
                    handleCoupleChange(index, 'person2', e.target.value)
                  }
                >
                  <option value="">Select person...</option>
                  {names.map(name => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => handleApplyCouple(index)}>
                  Apply Couple
                </button>
                <button type="button" onClick={() => handleRemoveCouple(index)}>
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={handleAddCouple}>
              {couples.length > 0 ? 'Add Another Couple' : 'Add Couple'}
            </button>
          </>
        )}
      </div>

      <div className="exclusions-grid">
        <p>
          Choose who cannot be matched with whom. Check the boxes to exclude
          specific matches.
        </p>

        <div className="grid-container">
          <div className="grid-header">
            <div className="header-col-1">This person...</div>
            <div className="header-col-2">...cannot be matched with:</div>
          </div>
          {names.map(giver => (
            <div key={giver} className="person-row">
              <div className="person-name">
                <strong>{giver}</strong>
              </div>
              <div className="exclusion-checkboxes">
                {names
                  .filter(name => name !== giver)
                  .map(excluded => (
                    <label key={excluded} className="exclusion-checkbox">
                      <input
                        type="checkbox"
                        data-exclude={excluded}
                        checked={(exclusions[giver] || []).includes(excluded)}
                        onChange={() => handleExclusionToggle(giver, excluded)}
                      />
                      {excluded}
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {Object.keys(exclusions).length > 0 && (
        <div className="exclusions-summary">
          <h3>Exclusions Summary</h3>
          <ul>
            {getExclusionsSummary().map((summary, index) => (
              <li key={index}>{summary}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
