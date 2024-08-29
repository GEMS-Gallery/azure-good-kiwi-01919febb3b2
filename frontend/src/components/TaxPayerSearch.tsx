import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { backend } from 'declarations/backend';

interface TaxPayer {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
}

const TaxPayerSearch: React.FC = () => {
  const [tid, setTid] = useState('');
  const [searchResult, setSearchResult] = useState<TaxPayer | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const result = await backend.getTaxPayerByTID(BigInt(tid));
      if (result.length > 0) {
        setSearchResult(result[0]);
        setError('');
      } else {
        setSearchResult(null);
        setError('No TaxPayer found with the given TID');
      }
    } catch (error) {
      console.error('Error searching for tax payer:', error);
      setSearchResult(null);
      setError('An error occurred while searching');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px' }}>
      <TextField
        label="Search by TID"
        variant="outlined"
        value={tid}
        onChange={(e) => setTid(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {searchResult && (
        <Box>
          <Typography variant="h6">Search Result:</Typography>
          <Typography>TID: {searchResult.tid.toString()}</Typography>
          <Typography>Name: {searchResult.firstName} {searchResult.lastName}</Typography>
          <Typography>Address: {searchResult.address}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default TaxPayerSearch;
