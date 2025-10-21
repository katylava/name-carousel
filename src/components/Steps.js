import { useState, useEffect, useRef } from 'react';
import { Welcome } from './Welcome';
import { EnterNames } from './EnterNames';
import { SelectExclusions } from './SelectExclusions';
import { Results } from './Results';
import { NotificationModal } from './NotificationModal';

const steps = [
  {
    number: '1',
    title: 'Enter Names',
    component: EnterNames,
    buttonText: 'Next',
  },
  {
    number: '2',
    title: 'Select Exclusions',
    component: SelectExclusions,
    buttonText: 'Draw',
  },
  {
    number: '3',
    title: 'Draw Names',
    component: Results,
    buttonText: null,
  },
];

export function Steps() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [drawName, setDrawName] = useState('');
  const [names, setNames] = useState([]);
  const [exclusions, setExclusions] = useState({});
  const [results, setResults] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const isInitialMount = useRef(true);

  // Load app state from localStorage on component mount
  useEffect(() => {
    // Check if user has seen welcome
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome === 'true') {
      setShowWelcome(false);
    }

    // Load draw name
    const savedDrawName = localStorage.getItem('drawName');
    if (savedDrawName) {
      setDrawName(savedDrawName);
    }

    // Load names
    const savedNames = localStorage.getItem('names');
    if (savedNames) {
      const namesList = savedNames.split('\n').filter(name => name.trim());
      setNames(namesList);
    }

    // Load current step
    const savedStep = localStorage.getItem('currentStep');
    if (savedStep) {
      const stepNumber = parseInt(savedStep, 10);
      if (stepNumber >= 0 && stepNumber < steps.length) {
        setCurrentStep(stepNumber);
      }
    }

    // Load results
    const savedResults = localStorage.getItem('results');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setResults(parsedResults);
      } catch (e) {
        console.error('Failed to parse saved results:', e);
      }
    }
  }, []);

  // Save current step to localStorage whenever it changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem('currentStep', currentStep.toString());
  }, [currentStep]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem('results', JSON.stringify(results));
    }
  }, [results]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleStartOver = () => {
    setShowConfirmModal(true);
  };

  const confirmStartOver = () => {
    // Clear all localStorage data
    localStorage.removeItem('names');
    localStorage.removeItem('exclusions');
    localStorage.removeItem('results');
    localStorage.removeItem('currentStep');
    localStorage.removeItem('hasSeenWelcome');
    localStorage.removeItem('drawName');
    localStorage.removeItem('appliedCouplesCount');
    localStorage.removeItem('lastAnimatedResults');

    // Reset all state
    setShowWelcome(true);
    setCurrentStep(0);
    setDrawName('');
    setNames([]);
    setExclusions({});
    setResults([]);
  };

  const handleStartDraw = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  // If showing welcome page, render it instead of steps
  if (showWelcome) {
    return (
      <Welcome
        onStart={handleStartDraw}
        setNames={setNames}
        setDrawName={setDrawName}
        setExclusions={setExclusions}
        setResults={setResults}
      />
    );
  }

  const canNavigateToStep = stepIndex => {
    // Step 1 is always accessible
    if (stepIndex === 0) return true;

    // Steps 2 and 3 require names
    if (stepIndex >= 1 && names.length > 0) return true;

    return false;
  };

  const handleStepClick = stepIndex => {
    if (canNavigateToStep(stepIndex) && stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  const listItems = steps.map((step, index) => {
    const isClickable = canNavigateToStep(index) && index !== currentStep;
    const className = [
      index === currentStep ? 'current' : '',
      isClickable ? 'clickable' : 'disabled',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li
        key={step.number}
        className={className}
        onClick={() => handleStepClick(index)}
        style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
      >
        {step.number}
        <span>{step.title}</span>
      </li>
    );
  });

  const StepComponent = steps[currentStep].component;

  return (
    <>
      <ul className="steps-list">{listItems}</ul>
      <StepComponent
        drawName={drawName}
        setDrawName={setDrawName}
        names={names}
        setNames={setNames}
        exclusions={exclusions}
        setExclusions={setExclusions}
        results={results}
        setResults={setResults}
      />
      <div className="step-navigation">
        {currentStep > 0 && (
          <button onClick={handlePrevious}>&larr; Previous</button>
        )}
        {steps[currentStep].buttonText && (
          <button
            onClick={handleNext}
            disabled={currentStep === 0 && names.length < 3}
          >
            {steps[currentStep].buttonText} &rarr;
          </button>
        )}
        <button onClick={handleStartOver} className="start-over-button">
          Start Over
        </button>
      </div>
      <NotificationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Start Over?"
        message="Are you sure you want to start over? All data you have entered will be lost."
        type="confirm"
        onConfirm={confirmStartOver}
        confirmText="Yes, Start Over"
        cancelText="Cancel"
      />
    </>
  );
}
