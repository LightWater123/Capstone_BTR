import { useState, useEffect } from 'react';

// This hook fetches the predictive maintenance data from your Laravel API.
export const usePredictiveMaintenance = () => {
  const [maintenanceDates, setMaintenanceDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch('/api/maintenance/predictive') // Make sure this path is correct for your setup
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setMaintenanceDates(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // The empty dependency array means this effect runs once on mount

  return { maintenanceDates, loading, error };
};