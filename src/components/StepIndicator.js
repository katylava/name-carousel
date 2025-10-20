export default function StepIndicator({ currentStep }) {
  const steps = [
    {
      number: '1',
      title: 'Enter Names',
    },
    {
      number: '2',
      title: 'Select Exclusions',
    },
    {
      number: '3',
      title: 'Draw Names',
    },
  ];
  const stepsList = steps.map(step => {
    const isCurrent = step.number === currentStep;
    return (
      <li
        key={step.number}
        className={isCurrent ? 'current' : ''}
        aria-current={isCurrent ? 'step' : ''}
      >
        {isCurrent && (
          <h2>
            <span className="step-number">{step.number}</span>
            &nbsp;
            <span className="step-title">{step.title}</span>
          </h2>
        )}
        {!isCurrent && <span className="step-number">{step.number}</span>}
      </li>
    );
  });

  return <ul className="StepIndicator">{stepsList}</ul>;
}
