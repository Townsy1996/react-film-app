import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './components/Header';
import ActorList from './components/ActorList';
import ActorForm from './components/ActorForm';
import Home from './pages/Home';
import axios from 'axios';
import App from './App';
import Starlist from './pages/StarList';
import Findafilm from './pages/Findafilm';
import FilmCategorySelector from './components/FilmCatergorySelector';
import ActorFilms from './components/ActorFilms';


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

describe('StarList Component Tests', () => {
  test('renders StarList Page', () => {
    render(<MemoryRouter><Starlist /></MemoryRouter>);
  });
});

describe('FindAFilm Component Tests', () => {
  test('renders FindAFilm Page', () => {
    render(<MemoryRouter><Findafilm /></MemoryRouter>);
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

describe('FilmCategorySelector component tests', () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: [{ categoryId: 1, name: 'Action' }] });
    axios.get.mockResolvedValueOnce({ data: [{ filmId: 1, title: 'Movie 1' }, { filmId: 2, title: 'Movie 2' }] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  test('renders category select and films list', async () => {
    render(<MemoryRouter><FilmCategorySelector /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByLabelText(/What are you in the mood for?/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Minimum Runtime:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Maximum Runtime:/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Filter/i })).toBeInTheDocument();
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.getByText(/No films found for the selected category and runtime range./i)).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith('http://16.171.0.136:8080/cat/getAll');

  });

  test("cat select and time-filter render", async () => {
    render(<MemoryRouter><FilmCategorySelector /></MemoryRouter>);
    await waitFor(() => {
      expect(screen.getByTestId("film-cat-select")).toBeInTheDocument();
      expect(screen.getByTestId("time-filter")).toBeInTheDocument();

    });


  });





  test('updates film list when category is selected', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ categoryId: 1, name: 'Action' }] });
    axios.get.mockResolvedValueOnce({ data: [{ filmId: 1, title: 'Movie 1', runTime: 120 }] });

    render(<MemoryRouter><FilmCategorySelector /></MemoryRouter>);


    await waitFor(() => {
      expect(screen.getByLabelText(/What are you in the mood for?/i)).toBeInTheDocument();
    });


    fireEvent.change(screen.getByLabelText(/What are you in the mood for?/i), { target: { value: 'Action' } });


    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://16.171.0.136:8080/cat/getAll');
      expect(axios.get).toHaveBeenCalledWith('http://16.171.0.136:8080/film/getByCatName/');

    });
  });

  test('handles error during category fetch', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch categories'));

    render(<MemoryRouter><FilmCategorySelector /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(/No films found for the selected category and runtime range./i)).toBeInTheDocument();
    });
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

    render(<MemoryRouter><ActorList /></MemoryRouter>);

    await waitFor(() => {
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
    axios.delete.mockResolvedValueOnce({}); 

    render(<MemoryRouter><ActorList /></MemoryRouter>);

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
    axios.put.mockResolvedValueOnce({ data: { actorId: 1, firstName: 'John Updated', lastName: 'Doe' } }); 

    render(<MemoryRouter><ActorList /></MemoryRouter>);

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('update-button')); 
    });

    fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John Updated' } });
    fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });

    fireEvent.click(screen.getByText('Update')); 
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://16.171.0.136:8080/actor/update/1', { firstName: 'John Updated', lastName: 'Doe' });
      expect(screen.getByText('John Updated Doe')).toBeInTheDocument(); 
      expect(screen.queryByTestId('update-form')).not.toBeInTheDocument(); 
    });
  });

  test('handles error gracefully', async () => {
    const errorMessage = 'Failed to fetch actors';
    axios.get.mockRejectedValueOnce(new Error(errorMessage)); 

    render(<MemoryRouter><ActorList /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument(); // Check if error message is displayed
    });
  });
});

describe('ActorFilms Component', () => {
  it('renders loading state initially', () => {

    axios.get.mockResolvedValue({ data: [] });

    const { getByText } = render(<ActorFilms actorId="1" onClose={() => { }} />);
    expect(getByText('Loading films...')).toBeInTheDocument();
  });

  it('renders error state if axios request fails', async () => {

    axios.get.mockRejectedValue(new Error('Network Error'));

    const { getByText } = render(<ActorFilms actorId="1" onClose={() => { }} />);
    await waitFor(() => {
      expect(getByText('Error: Network Error')).toBeInTheDocument();
    });
  });

  it('renders films when axios request succeeds', async () => {

    const sampleFilms = [{ filmId: 1, title: 'Film 1' }, { filmId: 2, title: 'Film 2' }];
    axios.get.mockResolvedValue({ data: sampleFilms });

    const { getByText } = render(<ActorFilms actorId="1" onClose={() => { }} />);
    await waitFor(() => {
      expect(getByText('Films Starring this Actor:')).toBeInTheDocument();
      expect(getByText('Film 1')).toBeInTheDocument();
      expect(getByText('Film 2')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(<ActorFilms actorId="1" onClose={onCloseMock} />);

    fireEvent.click(getByText('Close'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

});

