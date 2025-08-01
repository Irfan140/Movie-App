import { useEffect, useState } from "react";

// This is custom hook we created, which will help us to handling API req wihout cluttering the components
// by abstracting away the logic for fetching the data , managing the loading and error states and
// it will even provide us with a way to manually trigger a refetch when needed

// T makes a function generic allowing us to later on pass the specific data types that we want the function return to be
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  // When we wanna do something at the start of loading our components
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
