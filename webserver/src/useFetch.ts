import { useState, useEffect } from 'react';

export type UseFetchResult<T> = {
  data: T|undefined;
  isLoading: boolean;

  // try-catch parameter type should be any.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
}

// naive implementation of a custom hook to use fetch api
export const useFetch = <T>(
  url: string,
 
  // useEffect update array type is any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update?: any[]
): UseFetchResult<T> => {

  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);

  // try-catch parameter type should be any.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any>();

  useEffect(() => {
    const asyncFunc = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        if (response.ok) {
          setData((await response.json()) as T);
        } else {
          setError(await response.json());
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    // cannot use await in useEffect
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    asyncFunc();

  }, update ?? []);

  return {
    data, 
    isLoading,
    // try-catch parameter type should be any.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    error
  };
};

