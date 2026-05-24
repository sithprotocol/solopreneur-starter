import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../src/app/page';

describe('Page', () => {
  it('renders the starter heading', () => {
    render(<Page />);
    expect(
      screen.getByRole('heading', { name: 'Starter' }),
    ).toBeInTheDocument();
  });
});
