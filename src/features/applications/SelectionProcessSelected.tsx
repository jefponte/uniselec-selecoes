import { useState } from "react";
import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemButton, Grid, Button, Modal } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useGetDocumentsQuery } from "../documents/documentSlice";

const REGISTRATION_START_DATE = new Date("2024-08-02T08:00:00");
const REGISTRATION_END_DATE = new Date("2024-08-04T23:59:00");

export const SelectionProcessSelected = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });
  const { data, isFetching, error } = useGetDocumentsQuery(options);

  const handleButtonClick = () => {
    const now = new Date();
    if (now >= REGISTRATION_START_DATE && now <= REGISTRATION_END_DATE) {
      window.location.href = "/applications/create";
    } else {
      setModalOpen(true);
    }
  };

  const handleClose = () => setModalOpen(false);

  if (error) {
    return <Typography>Error fetching applications</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", padding: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" align="center" sx={{ color: "#0d47a1", fontWeight: "bold" }}>
          Sistema de Seleção de Alunos da UNILAB
        </Typography>
      </Box>
      <Paper sx={{ p: 4, backgroundColor: "#e3f2fd" }}>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h5" sx={{ color: "#1565c0" }}>Seleções em Andamento</Typography>
          </Box>
          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: "#0d47a1" }}>
                PROCESSO SELETIVO UNILAB – PERÍODO LETIVO 2024.1
              </Typography>
              <Typography variant="body2">Início: 02/08/2024 a partir das 08:00</Typography>
              <Typography variant="body2">Término: 04/08/2024 às 23:59</Typography>
              <Box mt={2}>
                <Typography variant="h6" sx={{ color: "#0d47a1" }}>Vagas ofertadas</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Campus de Baturité - CE</Typography>
                <List dense>
                  <ListItem><ListItemText primary="Medicina (CE)" /></ListItem>
                  {/* Adicione mais itens conforme necessário */}
                </List>
              </Box>
            </Grid>
            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleButtonClick}
                sx={{ mb: 2 }}
              >
                Inscrições
              </Button>
              <Typography variant="h6" sx={{ color: "#0d47a1" }}>Documentos Publicados</Typography>
              <List dense>
                {data?.data.map((document) => (
                  <ListItem key={document.id}>
                    <ListItemButton component="a" href={`http://localhost:8080/storage/${document.path}`} target="_blank">
                      <PictureAsPdfIcon sx={{ mr: 2 }} />
                      <ListItemText primary={document.title} secondary={document.description} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Modal
        open={isModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            outline: 'none',
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Período de Inscrições
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            As inscrições estarão abertas de 02/08/2024 a partir das 08:00 até 04/08/2024 às 23:59.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};
