import { render, screen } from '@testing-library/react';
import { AppFooter } from '@/components/layout/AppFooter';

describe('AppFooter', () => {
  it('renders navigation links', () => {
    render(<AppFooter />);
    expect(screen.getByText(/RasaRoots Smart Canteen/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /regions/i })).toBeInTheDocument();
  });
});
