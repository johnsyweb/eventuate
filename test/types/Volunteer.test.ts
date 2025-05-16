import { Volunteer, VolunteerWithCount } from '../../src/types/Volunteer';

describe('VolunteerWithCount', () => {
  let mockLocalStorage: Record<string, string>;
  const testVolunteer: Volunteer = {
    name: 'Test Runner',
    link: 'https://www.parkrun.org.uk/parkrunner/1234567/',
    athleteID: 1234567,
    vols: 25, // Add vols to prevent constructor fetch
  };

  beforeEach(() => {
    mockLocalStorage = {};
    global.localStorage = {
      getItem: (key: string) => mockLocalStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockLocalStorage[key] = value;
      },
      removeItem: (key: string) => {
        mockLocalStorage = Object.fromEntries(
          Object.entries(mockLocalStorage).filter(([k]) => k !== key)
        );
      },
      clear: () => {
        mockLocalStorage = {};
      },
      length: 0,
      key: (index: number) => Object.keys(mockLocalStorage)[index] || null,
    };
    global.DOMParser = jest.fn().mockImplementation(() => ({
      parseFromString: jest.fn().mockReturnValue({
        querySelector: jest.fn().mockImplementation((selector: string) => {
          if (selector === 'h3#volunteer-summary + table tfoot td:last-child') {
            return { textContent: '42' };
          }
          if (selector === '#content > p:last-of-type') {
            return { textContent: 'Age Category: VM35-39' };
          }
          return null;
        }),
      }),
    }));
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        text: () => Promise.resolve('<div>Mock HTML</div>'),
      })
    );
    jest.spyOn(Date, 'now').mockImplementation(() => 1621152000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  test('constructor initializes with provided values', () => {
    const basicVolunteer = {
      name: 'Test Runner',
      link: 'https://www.parkrun.org.uk/parkrunner/1234567/',
      athleteID: 1234567,
    };
    const volunteer = new VolunteerWithCount(basicVolunteer);
    expect(volunteer.name).toBe('Test Runner');
    expect(volunteer.athleteID).toBe(1234567);
    expect(volunteer.vols).toBe(0);
    expect(volunteer.agegroup).toBe('');
  });

  test('constructor fetches data only when vols is not provided', () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    // Create volunteer with no vols - should trigger fetch
    new VolunteerWithCount({
      name: 'Test Runner',
      link: 'https://www.parkrun.org.uk/parkrunner/1234567/',
      athleteID: 1234567,
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // Create volunteer with vols - should not trigger fetch
    new VolunteerWithCount({
      name: 'Test Runner',
      link: 'https://www.parkrun.org.uk/parkrunner/1234567/',
      athleteID: 1234567,
      vols: 25,
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1); // Count should not increase
  });

  test('fetchdata returns undefined when valid cache exists', async () => {
    const cachedData = {
      vols: 25,
      agegroup: 'VM35-39',
      timestamp: Date.now(),
    };
    localStorage.setItem('volunteer_1234567', JSON.stringify(cachedData));

    const volunteer = new VolunteerWithCount(testVolunteer);
    const result = volunteer.fetchdata();

    expect(result).toBeUndefined();
    expect(volunteer.vols).toBe(25);
    expect(volunteer.agegroup).toBe('VM35-39');
  });

  test('fetchdata fetches new data when cache is expired', async () => {
    const cachedData = {
      vols: 25,
      agegroup: 'VM35-39',
      timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25 hours old
    };
    localStorage.setItem('volunteer_1234567', JSON.stringify(cachedData));

    const fetchSpy = jest.spyOn(global, 'fetch');

    const volunteer = new VolunteerWithCount(testVolunteer);
    const result = volunteer.fetchdata();

    expect(result).toBeDefined();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test('handles localStorage errors gracefully', async () => {
    const error = new Error('Storage quota exceeded');
    global.localStorage.getItem = jest.fn().mockImplementation(() => {
      throw error;
    });

    const volunteer = new VolunteerWithCount(testVolunteer);
    const result = volunteer.fetchdata();

    expect(result).toBeDefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
