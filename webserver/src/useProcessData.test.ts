import { useProcessData } from 'useProcessData';
import axios from 'axios';
import { renderHook, waitFor } from '@testing-library/react';


describe('useProcessData custom hook test', () => {

  test('simple axios test', async () => {
    const response = await axios.post(
      '/api/login',
      { username: "test", password: "test" }
    );

    console.log(response.data);

    expect(response.data).not.toBeUndefined();
  });

  test('useProcessData() call test', async () => {
    const { result } = renderHook(() => useProcessData());

    await waitFor(() => expect(result.current.node).not.toBeUndefined());

    console.log(result);
    
    expect(result.current.node).not.toBeUndefined();
  });
});

