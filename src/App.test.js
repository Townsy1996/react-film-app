import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter to provide routing context
import Header from './components/Header';



describe('Header Component', () => {
  test('renders the header component', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    const headerElement = screen.getByTestId('header');
    expect(headerElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Find a Film')).toBeInTheDocument();
    expect(screen.getByText('Star List')).toBeInTheDocument();
  });

  test('renders the main title', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    const mainTitleElement = screen.getByText('Flick Finder');
    expect(mainTitleElement).toBeInTheDocument();
    expect(mainTitleElement).toHaveAttribute('id', 'main-title');
});
});

