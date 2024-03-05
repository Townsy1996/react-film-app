import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './components/Header';
import ActorList from './components/ActorList';
import ActorForm from './components/ActorForm';
import Home from './pages/Home';
import axios from 'axios';
import App from './App';


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

describe('App Component Tests', () => {
  test('renders whole app component', () => {
    render(<App />);
  });
});

describe('Header Component Tests', () => {
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

describe('Home page Component Tests', () => {
  test('renders the home component', () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    const homeElement = screen.getByTestId('home-comp');
    expect(homeElement).toBeInTheDocument();
  });
});

describe('ActorList Component Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the ActorList component', () => {
    render(<MemoryRouter><ActorList /></MemoryRouter>);
    const actorListElement = screen.getByTestId('actor-list');
    expect(actorListElement).toBeInTheDocument();
  });


  test('renders loading message initially', () => {
    render(<MemoryRouter><ActorList /></MemoryRouter>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });


  test('fetches actors and renders them correctly', async () => {
    const actors = [
      { actorId: 1, firstName: 'John', lastName: 'Doe' },
      { actorId: 2, firstName: 'Jane', lastName: 'Smith' },
    ];

    axios.get.mockResolvedValueOnce({ data: actors });

    render(<ActorList />);

    await waitFor(() => {

      expect(screen.getByTestId('actor-list')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('handles deleting actor correctly', async () => {
    const actors = [
      { actorId: 1, firstName: 'John', lastName: 'Doe' },
      { actorId: 2, firstName: 'Jane', lastName: 'Smith' },
    ];

    axios.get.mockResolvedValueOnce({ data: actors });

    render(<ActorList />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByTestId('delete-button')[0]);
      fireEvent.click(screen.getByTestId('confirm-button'));

    });
    await waitFor(() => {

      expect(screen.queryByText('John Doe')).toBeNull();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('handles updating actor details correctly', async () => {
    const actors = [
      { actorId: 1, firstName: 'John', lastName: 'Doe' },
    ];

    axios.get.mockResolvedValueOnce({ data: actors });
    axios.put.mockResolvedValueOnce({ data: { actorId: 1, firstName: 'John', lastName: 'Updated Doe' } });

    render(<ActorList />);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('update-button'));
    });


    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'Updated' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });


    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {

      expect(axios.put).toHaveBeenCalledWith('http://16.171.0.136:8080/actor/update/1', { firstName: 'Updated', lastName: 'Doe' });
      expect(screen.getByText('John Updated Doe')).toBeInTheDocument();
    });
  });

});



