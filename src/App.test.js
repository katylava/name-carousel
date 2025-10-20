import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';
import App from './App';

test('renders step 1 indicator', async () => {
  render(<App currentStep="1" />);
  const listItems = await screen.findAllByRole('listitem');
  expect(listItems).toHaveLength(3);
  expect(listItems[0]).toHaveClass('current');
  expect(within(listItems[0]).getByRole('heading')).toBeInTheDocument();
  expect(within(listItems[1]).queryByRole('heading')).not.toBeInTheDocument();
  expect(within(listItems[2]).queryByRole('heading')).not.toBeInTheDocument();
});
