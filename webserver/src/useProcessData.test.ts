import { useProcessData } from 'useProcessData';
import useSWR from 'swr';
import axios from 'axios';
import { getAPIUrl } from 'communications';
import { renderHook, act } from '@testing-library/react';

jest.mock('communications', () => ({
  ...jest.requireActual('communications'),
  getAPIUrl: jest.fn().mockImplementation(() => {
    console.log("getAPIUrl called!!");
    return "http://tree-table-demo-webapi-test-webserver:8000";}
  ),
}));

describe('useProcessData custom hook test', () => {

  test('simple axios test', async () => {
    const response = await axios.post(
      getAPIUrl() + '/api/login',
      { username: "test", password: "test" }
    );

    console.log(response.data);

    expect(response.data).not.toBeUndefined();
  });

  test('useProcessData() call test', () => {
    const { result, rerender } = renderHook(() => useProcessData());

    rerender();
    rerender();
    rerender();
    //act(() => {});

    console.log(result);
    
    expect(result.current.node).not.toBeUndefined();
  });
});

