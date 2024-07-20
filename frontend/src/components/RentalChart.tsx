import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { format, parseISO } from 'date-fns';
import { Box, Heading, useColorModeValue, Flex, Input, Button } from '@chakra-ui/react';
import { TbCalendarSearch } from 'react-icons/tb';

interface RentalData {
  date: string;
  count: number;
}

export default function RentalChart({ refresh }: { refresh: number }) {
  const [rentalData, setRentalData] = useState<RentalData[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const chartBackgroundColor = useColorModeValue('rgba(75, 192, 192, 0.6)', 'rgba(75, 192, 192, 0.2)');
  const chartBorderColor = useColorModeValue('rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.8)');
  const fontColor = useColorModeValue('rgba(0, 0, 0, 0.87)', 'rgba(255, 255, 255, 0.87)');

  useEffect(() => {
    fetchRentalData();
  }, [refresh]);

  async function fetchRentalData() {
    try {
      const response = await fetch(`http://localhost:8080/horarios/rentals?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      setRentalData(data);
    } catch (error) {
      console.error('Error fetching rental data:', error);
    }
  }

  const handleFilter = () => {
    fetchRentalData();
  };

  const totalEarnings = rentalData.reduce((total, data) => total + data.count * 80, 0);

  const chartData = {
    labels: rentalData.map(data => format(parseISO(data.date), 'dd/MM/yyyy')),
    datasets: [
      {
        label: 'Número de Aluguéis',
        data: rentalData.map(data => data.count),
        backgroundColor: chartBackgroundColor,
        borderColor: chartBorderColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade',
          color: fontColor,
        },
        ticks: {
          color: fontColor,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Data',
          color: fontColor,
        },
        ticks: {
          color: fontColor,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: fontColor,
        },
      },
    },
  };

  return (
    <Box
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="md"
      boxShadow="md"
      maxW={{ base: '888px' }}
      mx="auto"
      mt={4}
    >
      <Heading as="h2" size="lg" mb={4} textAlign="center" color={fontColor}>
        Aluguéis por dia
      </Heading>
      <Flex justifyContent="space-between" mb={4} direction="column" gap={5}>
        <Flex>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Data de Início"
            mr={2}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Data de Fim"
            mr={2}
          />
          <Button px={5} onClick={handleFilter}><TbCalendarSearch size={50}/></Button>
        </Flex>
        <Heading as="h3" size="md" color="#12D96C">
          Ganhos totais: R$ {totalEarnings.toFixed(2)}
        </Heading>
      </Flex>
      <Box height={{ base: '300px', md: '500px' }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Box>
  );
}