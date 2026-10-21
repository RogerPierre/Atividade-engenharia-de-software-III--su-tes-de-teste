import {
  cryptocurrencies,
  fiatCurrencies,
  fetchCryptocurrenciesFromApi,
} from './cryptoData';

describe('cryptoData', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('cryptocurrencies static list', () => {
    it('contains expected default cryptocurrencies', () => {
      expect(cryptocurrencies.length).toBeGreaterThan(0);
      const btc = cryptocurrencies.find((c) => c.id === 'bitcoin');
      expect(btc).toBeDefined();
      expect(btc?.symbol).toBe('BTC');
      expect(btc?.name).toBe('Bitcoin');
      expect(btc?.price).toBeGreaterThan(0);
    });

    it('ensures each cryptocurrency has valid properties', () => {
      cryptocurrencies.forEach((crypto) => {
        expect(typeof crypto.id).toBe('string');
        expect(typeof crypto.name).toBe('string');
        expect(typeof crypto.symbol).toBe('string');
        expect(typeof crypto.price).toBe('number');
        expect(typeof crypto.change24h).toBe('number');
        if (crypto.image) {
          expect(typeof crypto.image).toBe('string');
        }
      });
    });
  });

  describe('fiatCurrencies static list', () => {
    it('contains common fiat currencies with valid rates and symbols', () => {
      expect(fiatCurrencies.length).toBeGreaterThanOrEqual(5);
      const usd = fiatCurrencies.find((f) => f.code === 'USD');
      expect(usd).toEqual({ code: 'USD', symbol: '$', rate: 1 });

      const brl = fiatCurrencies.find((f) => f.code === 'BRL');
      expect(brl).toBeDefined();
      expect(brl?.symbol).toBe('R$');
      expect(brl?.rate).toBeGreaterThan(0);
    });
  });

  describe('fetchCryptocurrenciesFromApi', () => {
    it('successfully fetches and maps cryptocurrencies from API', async () => {
      const mockApiResponse = [
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'btc',
          current_price: 70000,
          price_change_percentage_24h: 3.5,
          image: 'https://example.com/btc.png',
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'eth',
          current_price: 3500,
          price_change_percentage_24h: null,
          image: 'https://example.com/eth.png',
        },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });

      const result = await fetchCryptocurrenciesFromApi();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/json',
          }),
        })
      );

      expect(result).toEqual([
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'BTC',
          price: 70000,
          change24h: 3.5,
          image: 'https://example.com/btc.png',
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'ETH',
          price: 3500,
          change24h: 0,
          image: 'https://example.com/eth.png',
        },
      ]);
    });

    it('throws an error when response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 429,
      });

      await expect(fetchCryptocurrenciesFromApi()).rejects.toThrow(
        'Failed to fetch cryptocurrencies: 429'
      );
    });
  });
});
