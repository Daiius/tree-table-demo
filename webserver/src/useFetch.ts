import React, { useState, useEffect } from 'react';

export const useFetch = (
  url: string,
  update?: any[]
) => {

  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    const asyncFunc = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        if (response.ok) {
          setData(await response.json());
        } else {
          setError(await response.json());
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    asyncFunc();

  }, update ?? []);

  return [data, isLoading, error];
};
