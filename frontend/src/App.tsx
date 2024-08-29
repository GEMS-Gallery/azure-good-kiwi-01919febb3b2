import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import TaxPayerForm from './components/TaxPayerForm';
import TaxPayerList from './components/TaxPayerList';
import TaxPayerSearch from './components/TaxPayerSearch';

interface TaxPayer {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
}

function App() {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
      setLoading(false);
    }
  };

  const handleAddTaxPayer = async (newTaxPayer: Omit<TaxPayer, 'tid'>) => {
    try {
      setLoading(true);
      const tid = BigInt(Date.now());
      await backend.createTaxPayer(tid, newTaxPayer.firstName, newTaxPayer.lastName, newTaxPayer.address);
      await fetchTaxPayers();
    } catch (error) {
      console.error('Error adding tax payer:', error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          TaxPayer Management System
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <TaxPayerForm onSubmit={handleAddTaxPayer} />
          <TaxPayerSearch />
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <TaxPayerList taxPayers={taxPayers} />
        )}
      </Box>
    </Container>
  );
}

export default App;
