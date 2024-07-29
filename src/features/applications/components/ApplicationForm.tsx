import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Autocomplete,
  Typography,
  RadioGroup,
  Radio,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Application } from "../../../types/Application";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectAuthUser } from "../../auth/authSlice";

type Props = {
  application: Application;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent, checked?: boolean) => void;
  handleAutocompleteChange: (event: any, value: any, field: string) => void;
};

const sexOptions = ["Masculino", "Feminino", "Outro"];
const ufOptions = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];
const vagaOptions = [
  { label: "AC: Ampla Concorrência", value: "AC", alwaysChecked: true },
  { label: "AC/B: Candidato(s) de ampla concorrência que tenham cursado integralmente o Ensino Médio em instituições públicas de ensino.", value: "AC/B" },
  { label: "LB - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - PPI" },
  { label: "LB - Q: Candidatos autodeclarados quilombolas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - Q" },
  { label: "LB - PCD: Candidatos com deficiência, que tenham renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - PCD" },
  { label: "LB - EP: Candidatos com renda familiar bruta per capita igual ou inferior a 1 salário mínimo que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - EP" },
  { label: "LI - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - PPI" },
  { label: "LI - Q: Candidatos autodeclarados quilombolas, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - Q" },
  { label: "LI - PCD: Candidatos com deficiência, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - PCD" },
  { label: "LI - EP: Candidatos que, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - EP" },
];

const bonusOptions = [
  { label: "10%: Estudantes que tenham cursado integralmente o ensino médio em escolas públicas.", value: "10%" },
  { label: "20%: Estudantes que tenham cursado e concluído integralmente o ensino médio em instituições de ensino, públicas ou privadas, localizadas na região do Maciço do Baturité.", value: "20%" },
  { label: "Nenhuma das anteriores", value: "none" },
];

export function ApplicationForm({
  application,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleAutocompleteChange,
}: Props) {
  const [formState, setFormState] = useState(application.data || {});
  const userAuth = useAppSelector(selectAuthUser);

  useEffect(() => {
    if (userAuth) {
      setFormState((prevState) => ({
        ...prevState,
        name: userAuth.name,
        email: userAuth.email,
      }));
    }
  }, [userAuth]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, checked?: boolean) => {
    const { name, value } = e.target;
    if (name === "vaga") {
      setFormState((prevState) => {
        const vaga = prevState.vaga || [];
        if (checked) {
          return { ...prevState, vaga: [...vaga, value] };
        } else {
          return { ...prevState, vaga: vaga.filter((item: string) => item !== value) };
        }
      });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setFormState({ ...formState, bonus: value === "none" ? [] : [value] });
  };

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Dados Pessoais */}
          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Dados Pessoais</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="name"
                label="Nome Completo"
                value={formState.name || ""}
                disabled
                data-testid="name"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="email"
                label="Email"
                type="email"
                value={formState.email || ""}
                disabled
                data-testid="email"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="cpf"
                label="CPF do Candidato"
                value={formState.cpf || ""}
                disabled={isdisabled}
                onChange={handleCheckboxChange}
                data-testid="cpf"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="dob"
                label="Data de Nascimento"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formState.dob || ""}
                disabled={isdisabled}
                onChange={handleCheckboxChange}
                data-testid="dob"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={sexOptions}
                getOptionLabel={(option) => option}
                onChange={(event, value) => handleAutocompleteChange(event, value, "sex")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sexo"
                    name="sex"
                    value={formState.sex || ""}
                    disabled={isdisabled}
                    data-testid="sex"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="phone1"
                label="Telefone 1"
                value={formState.phone1 || ""}
                disabled={isdisabled}
                onChange={handleCheckboxChange}
                data-testid="phone1"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="address"
                label="Endereço"
                value={formState.address || ""}
                disabled={isdisabled}
                onChange={handleCheckboxChange}
                data-testid="address"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={ufOptions}
                getOptionLabel={(option) => option}
                onChange={(event, value) => handleAutocompleteChange(event, value, "uf")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="UF"
                    name="uf"
                    value={formState.uf || ""}
                    disabled={isdisabled}
                    data-testid="uf"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="city"
                label="Cidade"
                value={formState.city || ""}
                disabled={isdisabled}
                onChange={handleCheckboxChange}
                data-testid="city"
              />
            </FormControl>
          </Grid>

          {/* Dados da Candidatura */}
          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Dados da Candidatura</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="edital"
                label="Edital"
                value="Edital nº 04/2024 - PROCESSO SELETIVO SISURE/UNILAB – PERÍODO LETIVO 2024.1 Curso Medicina"
                disabled
                data-testid="edital"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="campus"
                label="Local de Oferta"
                value="Baturité"
                disabled
                data-testid="campus"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="enem"
                label="Número de Inscrição do ENEM"
                value={formState.enem || ""}
                disabled={isdisabled}
                onChange={handleCheckboxChange}
                data-testid="enem"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="course"
                label="Curso Pretendido"
                value="Medicina"
                disabled
                data-testid="course"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Modalidade</Typography>
            </Box>
            <FormGroup>
              {vagaOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      name="vaga"
                      value={option.value}
                      checked={option.alwaysChecked || formState.vaga?.includes(option.value) || false}
                      onChange={(e, checked) => handleCheckboxChange(e, checked)}
                      data-testid={`vaga-${option.value}`}
                      disabled={option.alwaysChecked}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Critérios de Bonificação</Typography>
            </Box>
            <RadioGroup
              name="bonus"
              value={formState.bonus && formState.bonus.length > 0 ? formState.bonus[0] : "none"}
              onChange={handleRadioChange}
            >
              {bonusOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={isdisabled} />}
                  label={option.label}
                  data-testid={`bonus-${option.value}`}
                />
              ))}
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Termos de Responsabilidade</Typography>
            </Box>
            <Typography variant="body2" mb={2}>
              1. O candidato deverá ler o Edital da respectiva seleção, seus anexos e os atos normativos neles mencionados, para certificar-se de que preenche todos os requisitos exigidos para a participação e aceita todas as condições nele estabelecidas.
            </Typography>
            <Typography variant="body2" mb={2}>
              2. Antes de efetuar sua inscrição, verifique se os dados digitados estão corretos e somente depois, confirme o envio de suas informações.
            </Typography>
            <Typography variant="body2" mb={2}>
              3. A Unilab não se responsabiliza por solicitação de inscrição não recebida devido a quaisquer motivos de ordem técnica dos computadores, falhas de comunicação, congestionamento das linhas de comunicação, procedimento indevido do candidato, bem como por outros fatores que impossibilitem a transferência de dados, sendo de responsabilidade exclusiva do candidato acompanhar a situação de sua inscrição.
            </Typography>
            <FormControlLabel
              control={<Checkbox required name="termsAgreement" />}
              label="Declaro que li e concordo com o termo de responsabilidade."
              onChange={(e, checked) => handleCheckboxChange(e, checked)}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/applications">
                Voltar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isdisabled || isLoading}
              >
                {isLoading ? "Loading..." : "Realizar Inscrições"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
