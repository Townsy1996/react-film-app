import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter to provide routing context
import Header from './components/Header';
import ActorList from './components/ActorList';
import ActorForm from './components/ActorForm';
import axios from 'axios';


jest.mock("axios");


describe('ActorForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ActorForm', () => {
    render(<ActorForm />);
    expect(screen.queryByText(/Error/)).toBeNull();
    expect(screen.getByTestId('first-add-actor-button')).toBeInTheDocument();
    expect(screen.queryByTestId('add-actor-button')).not.toBeInTheDocument();
  });


  test('toggles form visibility', () => {
    render(<ActorForm />);
    const addButton = screen.getByTestId('first-add-actor-button');
    
    fireEvent.click(addButton);

    expect(screen.getByLabelText('First Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name:')).toBeInTheDocument();
    expect(screen.getByTestId('add-actor-button')).toBeInTheDocument();
    
    fireEvent.click(addButton);

    expect(screen.queryByLabelText('First Name:')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Last Name:')).not.toBeInTheDocument();
    expect(screen.queryByTestId('add-actor-button')).not.toBeInTheDocument();
  });



  test('add actor function performs successfully', async () => {
    
    axios.post.mockResolvedValueOnce({ data: { id: 1, firstName: 'John', lastName: 'Doe' } });
    const onAddActorMock = jest.fn();

    render(<ActorForm onAddActor={onAddActorMock} />);
    fireEvent.click(screen.getByTestId('first-add-actor-button'));

    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });

    fireEvent.click(screen.getByTestId('add-actor-button'));

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      'http://16.171.0.136:8080/actor/create',
      { firstName: 'John', lastName: 'Doe' }
    );
    await screen.findByText('Add Actor'); 
    expect(onAddActorMock).toHaveBeenCalledWith({ id: 1, firstName: 'John', lastName: 'Doe' });
  });


});

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


describe('ActorList Component Tests', () => {
  test('renders the ActorList component', () => {
    render(<MemoryRouter><ActorList /></MemoryRouter>);
    const actorListElement = screen.getByTestId('actor-list');
    expect(actorListElement).toBeInTheDocument();
  });


  test('renders loading message initially', () => {
    render(<MemoryRouter><ActorList /></MemoryRouter>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

});



