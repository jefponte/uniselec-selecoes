import {
  Box,
  Grid,
  TextField,
  FormControl,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Autocomplete,
  RadioGroup,
  Radio,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { useState, useEffect, FormEvent, SyntheticEvent } from "react";
import { Application } from "../../../types/Application";
import { useAppSelector } from "../../../app/hooks";
import { selectAuthUser } from "../../auth/authSlice";
import { Link, useParams } from "react-router-dom";
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useGetProcessSelectionQuery } from "../../processSelections/processSelectionSlice";

type Props = {
  application: Application;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, applicationData2: Application) => void;
};

const sexOptions = ["Masculino", "Feminino", "Outro"];
const ufOptions = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];
const vagaOptions = [
  { label: "LB - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LB - Q: Candidatos autodeclarados quilombolas, com renda familiar bruta per capita igual ou inferior a  1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - Q: Candidatos autodeclarados quilombolas, com renda familiar bruta per capita igual ou inferior a  1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LB - PCD: Candidatos com deficiência, que tenham renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - PCD: Candidatos com deficiência, que tenham renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LB - EP: Candidatos com renda familiar bruta per capita igual ou inferior a 1 salário mínimo que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - EP: Candidatos com renda familiar bruta per capita igual ou inferior a 1 salário mínimo que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LI - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LI - Q: Candidatos autodeclarados quilombolas, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - Q: Candidatos autodeclarados quilombolas, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LI - PCD: Candidatos com deficiência, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - PCD: Candidatos com deficiência, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LI - EP: Candidatos que, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - EP: Candidatos que, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
];

const bonusOptions = [
  { label: "10%: Estudantes que tenham cursado integralmente o ensino médio em escolas públicas.", value: "10%: Estudantes que tenham cursado integralmente o ensino médio em escolas públicas." },
  { label: "20%: Estudantes que tenham cursado e concluído integralmente o ensino médio em instituições de ensino, públicas ou privadas, localizadas na região do Maciço do Baturité.", value: "20%: Estudantes que tenham cursado e concluído integralmente o ensino médio em instituições de ensino, públicas ou privadas, localizadas na região do Maciço do Baturité." },
  { label: "Nenhuma das anteriores", value: "Nenhuma das anteriores" },
];

export function ApplicationForm({
  application,
  isdisabled = false,
  isLoading = false,
  handleSubmit
}: Props) {
  const [formState, setFormState] = useState(application.data || {});
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [enemError, setEnemError] = useState<string | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const userAuth = useAppSelector(selectAuthUser);

  const { id } = useParams();
  const { data: processSelection, isFetching: isFetchingProcess } = useGetProcessSelectionQuery({ id: id! });


  useEffect(() => {
    setFormState({ ...formState, ...application?.data, edital: "Edital nº 04/2024 - PROCESSO SELETIVO UNILAB – PERÍODO LETIVO 2024.1 Curso Medicina", position: "Medicina", location_position: "Baturité-CE" });
  }, [application]);

  useEffect(() => {
    if (userAuth) {
      setFormState((prevState) => ({
        ...prevState,
        name: userAuth.name,
        email: userAuth.email,
        cpf: userAuth.cpf,
      }));
    }
  }, [userAuth]);

  const handleAutocompleteChange = (event: SyntheticEvent<Element, Event>, value: string | null, name: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value || "",
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormState((prevState) => {
      const vaga = prevState.vaga || [];
      if (checked) {
        return { ...prevState, vaga: [...vaga, value] };
      } else {
        return { ...prevState, vaga: vaga.filter((item: string) => item !== value) };
      }
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, bonus: e.target.value === "none" ? [] : [e.target.value] });
  };

  const handleConfirmDialogOpen = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpenConfirmDialog(true);
  };

  const handleConfirmDialogClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(formEvent, { data: { ...formState } } as Application);
  };

  const validateEnemNumber = (enem: string) => {
    // // Verifica se o número de inscrição tem exatamente 12 caracteres
    // if (enem.length !== 12) {
    //   return "O número de inscrição do ENEM deve ter 12 dígitos.";
    // }
    // // Verifica se todos os caracteres são dígitos numéricos
    // if (!/^\d+$/.test(enem)) {
    //   return "O número de inscrição do ENEM deve conter apenas números.";
    // }
    // // Verifica se os primeiros dois dígitos correspondem ao ano 2023
    // if (enem.slice(0, 2) !== "23") {
    //   return "O número de inscrição do ENEM não corresponde ao ano de 2023.";
    // }
    return null;
  };

  const handleEnemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;

    // Limita o valor a 12 dígitos
    if (value.length > 12) {
      value = value.slice(0, 12);
    }

    const error = validateEnemNumber(value);
    setEnemError(error);
    setFormState({ ...formState, enem: value });
  };


  useEffect(() => {

    alert(JSON.stringify(processSelection));
  }, [processSelection]);


  return (
    <Box p={2}>
      <form onSubmit={handleConfirmDialogOpen}>
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
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                data-testid="name"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                name="social_name"
                label="Nome Social"
                value={formState.social_name || ""}
                onChange={(e) => setFormState({ ...formState, social_name: e.target.value })}
                data-testid="social_name"
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
                error={!!cpfError}
                helperText={cpfError || ""}
                disabled={isdisabled}
                data-testid="cpf"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="birtdate"
                label="Data de Nascimento"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formState.birtdate || ""}
                disabled={isdisabled}
                onChange={(e) => setFormState({ ...formState, birtdate: e.target.value })}
                data-testid="birtdate"
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
                    required
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
                onChange={(e) => setFormState({ ...formState, phone1: e.target.value })}
                disabled={isdisabled}
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
                onChange={(e) => setFormState({ ...formState, address: e.target.value })}
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
                    required
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
                onChange={(e) => setFormState({ ...formState, city: e.target.value })}
                disabled={isdisabled}
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
                value="Edital nº 04/2024 - PROCESSO SELETIVO UNILAB – PERÍODO LETIVO 2024.1 Curso Medicina"
                disabled
                data-testid="edital"
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
                error={!!enemError}
                helperText={enemError || ""}
                disabled={isdisabled}
                onChange={handleEnemChange}
                data-testid="enem"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box borderBottom={1} mb={2}>
              <Typography variant="h6">Modalidade</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" mb={2}>
              O candidato pode se inscrever em mais de uma modalidade, desde que faça jus a elas.
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Check style={{ color: "green" }} />
              <Typography variant="body1" ml={1}>
                AC: Ampla Concorrência
              </Typography>
            </Box>
            <FormGroup>
              {vagaOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      name="vaga"
                      value={option.value}
                      checked={formState.vaga?.includes(option.value) || false}
                      onChange={(e) => handleCheckboxChange(e as React.ChangeEvent<HTMLInputElement>)}
                      data-testid={`vaga-${option.value}`}
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
            <Typography variant="body2" color="textSecondary" mb={2}>
              O candidato pode marcar apenas uma opção de bonificação, se fizer jus a ela.
            </Typography>
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
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/">
                Página Inicial
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

      {/* Modal de Confirmação */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleConfirmDialogClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmar Inscrição</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Por favor, revise os detalhes da inscrição antes de confirmar:
          </DialogContentText>
          <Box mt={2}>
            <Typography variant="body1"><strong>Nome Completo:</strong> {formState.name}</Typography>
            <Typography variant="body1"><strong>Nome Social:</strong> {formState.social_name || "Não informado"}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {formState.email}</Typography>
            <Typography variant="body1"><strong>CPF:</strong> {formState.cpf}</Typography>
            <Typography variant="body1">
              <strong>Data de Nascimento: </strong>
              {formState.birtdate && isValid(parseISO(formState.birtdate)) ?
                format(parseISO(formState.birtdate), 'dd/MM/yyyy', { locale: ptBR }) :
                'Data inválida'}
            </Typography>
            <Typography variant="body1"><strong>Sexo:</strong> {formState.sex}</Typography>
            <Typography variant="body1"><strong>Telefone 1:</strong> {formState.phone1}</Typography>
            <Typography variant="body1"><strong>Endereço:</strong> {formState.address}</Typography>
            <Typography variant="body1"><strong>UF:</strong> {formState.uf}</Typography>
            <Typography variant="body1"><strong>Cidade:</strong> {formState.city}</Typography>
            <Typography variant="body1"><strong>Edital:</strong> Edital nº 04/2024 - PROCESSO SELETIVO UNILAB – PERÍODO LETIVO 2024.1 Curso Medicina</Typography>
            <Typography variant="body1"><strong>Curso Pretendido:</strong> Medicina</Typography>
            <Typography variant="body1"><strong>Local de Oferta:</strong> Baturité</Typography>
            <Typography variant="body1"><strong>Número de Inscrição do ENEM:</strong> {formState.enem}</Typography>
            <Typography variant="body1"><strong>Modalidades:</strong></Typography>
            <List>
              {formState.vaga?.map((vaga, index) => (
                <ListItem key={index}>
                  <Typography variant="body2">• {vaga}</Typography>
                </ListItem>
              ))}
            </List>
            <Typography variant="body1"><strong>Critérios de Bonificação:</strong></Typography>
            <List>
              {formState.bonus?.map((bonus, index) => (
                <ListItem key={index}>
                  <Typography variant="body2">• {bonus}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirmSubmit}
            color="secondary"
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
