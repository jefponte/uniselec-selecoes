import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import { Link as RouterLink } from "react-router-dom";

export const MaintenancePage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <ConstructionIcon sx={{ fontSize: 64 }} />
        </Box>

        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          Página em manutenção
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Estamos realizando uma manutenção programada nesta funcionalidade.
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Por favor, tente novamente mais tarde. Enquanto isso, você pode
          continuar navegando pelo Portal Seleções.
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            sx={{ borderRadius: 8, px: 4 }}
          >
            Ir para a página inicial
          </Button>

          <Button
            component={RouterLink}
            to="/sobre"
            variant="outlined"
            size="large"
            sx={{ borderRadius: 8, px: 4 }}
          >
            Sobre o UniSelec
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
