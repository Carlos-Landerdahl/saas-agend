'use client';

import React, { useState, FormEvent } from 'react';
import {
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { AiOutlineSchedule } from 'react-icons/ai';
import { GrFormSchedule } from 'react-icons/gr';

interface ScheduleFormProps {
  onSchedule: () => void;
}

export default function ScheduleForm({ onSchedule }: ScheduleFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [quadraId, setQuadraId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError('Por favor, selecione os horários de início e fim.');
      return;
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd'T'HH:mm:ss");
    const formattedEndDate = format(endDate, "yyyy-MM-dd'T'HH:mm:ss");

    try {
      const response = await fetch('http://localhost:8080/horarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quadra: { id: parseInt(quadraId) },
          inicioReserva: formattedStartDate,
          fimReserva: formattedEndDate,
        }),
      });

      if (response.ok) {
        onSchedule();
        onClose();
      } else {
        setError('Erro ao agendar horário');
      }
    } catch (err) {
      setError('Erro ao agendar horário');
    }
  };

  return (
    <div>
      <Button colorScheme="blue" onClick={onOpen} className='flex gap-1 items-center'>
        Agendar Horário <GrFormSchedule size={25}/>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agendar Horário</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormControl isRequired>
                <FormLabel>ID da Quadra</FormLabel>
                <Input
                  value={quadraId}
                  onChange={(e) => setQuadraId(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Início da Reserva</FormLabel>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  customInput={<Input />}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Fim da Reserva</FormLabel>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  customInput={<Input />}
                />
              </FormControl>
              <div className='flex gap-2 pb-2'>
                <Button colorScheme="green" type="submit" width="full" className='flex gap-2 items-center'>
                  Agendar <AiOutlineSchedule size={25}/>
                </Button>
                <Button colorScheme="red" onClick={onClose}>
                  Fechar
                </Button>
              </div>
              {error && <Text color="red.500">{error}</Text>}
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}