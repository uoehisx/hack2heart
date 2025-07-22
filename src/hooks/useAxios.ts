import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface UseAxiosResult<T = any> {
  data: T | null;
  loading: boolean;
  error: any;
  request: (config: AxiosRequestConfig) => Promise<void>;
}

export function useAxios<T = any>(): UseAxiosResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const request = useCallback(async (config: AxiosRequestConfig) => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<T> = await axios(config);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
}
