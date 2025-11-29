import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "./authSlice";
import { useSnackbar } from "notistack";
import { useUpdateProfileMutation } from "./authApiSlice";
import { User } from "../../types/User";

type UserWithPasswordConf = Partial<User> & {
  password?: string;
  password_confirmation?: string;
  confirmEmail?: string;
};

type PasswordCriteria = {
  length: boolean;
  number: boolean;
  special: boolean;
};

type PasswordCriteriaKey = keyof PasswordCriteria;

export function AuthProfileEdit() {
  const authUser = useAppSelector(selectAuthUser) as UserWithPasswordConf;
  const { enqueueSnackbar } = useSnackbar();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  if (!authUser || !authUser.id) {
    return (
      <Box p={2}>
        <Typography variant="h6" color="error">
          Usuário não autenticado.
        </Typography>
      </Box>
    );
  }

  const [userState, setUserState] = useState<UserWithPasswordConf>({
    ...authUser,
    password: "",
    password_confirmation: "",
    confirmEmail: authUser.email ?? "",
  });

  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setUserState({
      ...authUser,
      password: "",
      password_confirmation: "",
      confirmEmail: authUser.email ?? "",
    });
  }, [authUser]);

  // Atualizar critérios da senha

  useEffect(() => {
    const pwd = userState.password ?? "";

    setPasswordCriteria({
      length: pwd.length >= 8,
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    });
  }, [userState.password]);

  const isPasswordStrong =
    !userState.password || Object.values(passwordCriteria).every(Boolean);

  const handleField =
    (field: keyof UserWithPasswordConf) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserState((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validação e-mail
    if (
      (userState.email || userState.confirmEmail) &&
      userState.email !== userState.confirmEmail
    ) {
      enqueueSnackbar("Os e-mails informados não conferem.", {
        variant: "error",
      });
      return;
    }

    // validação senha forte
    if (userState.password && !isPasswordStrong) {
      enqueueSnackbar(
        "A senha deve ter no mínimo 8 caracteres, um número e um caractere especial.",
        { variant: "error" }
      );
      return;
    }

    // validação confirmação da senha
    if (
      userState.password &&
      userState.password_confirmation &&
      userState.password !== userState.password_confirmation
    ) {
      enqueueSnackbar("A confirmação da senha não confere.", {
        variant: "error",
      });
      return;
    }

    const payload: Record<string, any> = {};

    Object.entries(userState).forEach(([key, value]) => {
      if (!value) return;

      if (key === "confirmEmail") return;

      if (key === "password_confirmation") {
        if (userState.password) payload[key] = value;
        return;
      }

      payload[key] = value;
    });

    try {
      await updateProfile(payload).unwrap();
      enqueueSnackbar("Perfil atualizado com sucesso!", { variant: "success" });
    } catch {
      enqueueSnackbar("Erro ao atualizar perfil.", { variant: "error" });
    }
  };

  const criteriaList: { key: PasswordCriteriaKey; label: string }[] = [
    { key: "length", label: "Pelo menos 8 caracteres" },
    { key: "number", label: "Pelo menos 1 número (0-9)" },
    { key: "special", label: "Pelo menos 1 caractere especial (!@#$%...)" },
  ];

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          p={5}
        >
          <Typography component="h1" variant="h5">
            Alterar Dados do Perfil
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Atualize seu nome, e-mail e senha. Campos vazios serão ignorados.
          </Typography>
        </Box>

        <Box p={3} mb={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Dados pessoais */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Dados pessoais
                </Typography>
              </Grid>

              {/* Nome */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={userState.name || ""}
                  onChange={handleField("name")}
                  disabled={isLoading}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={userState.email || ""}
                  onChange={handleField("email")}
                  disabled={isLoading}
                  error={
                    Boolean(userState.confirmEmail) &&
                    userState.email !== userState.confirmEmail
                  }
                />
              </Grid>

              {/* Confirm Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirmar e-mail"
                  type="email"
                  value={userState.confirmEmail || ""}
                  onChange={handleField("confirmEmail")}
                  disabled={isLoading}
                  helperText={
                    userState.email &&
                    userState.confirmEmail &&
                    userState.email !== userState.confirmEmail
                      ? "Os e-mails não conferem."
                      : "Confirme o e-mail"
                  }
                  error={
                    Boolean(userState.email) &&
                    Boolean(userState.confirmEmail) &&
                    userState.email !== userState.confirmEmail
                  }
                />
              </Grid>

              {/* Senha */}
              <Grid item xs={12} mt={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Alterar senha
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Preencha apenas se quiser alterar sua senha.
                </Typography>
              </Grid>

              {/* Nova senha */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nova senha"
                  type="password"
                  value={userState.password || ""}
                  onChange={handleField("password")}
                  disabled={isLoading}
                  error={Boolean(userState.password && !isPasswordStrong)}
                  helperText={
                    userState.password && !isPasswordStrong
                      ? "A senha não atende os critérios."
                      : "Deixe em branco para não alterar"
                  }
                />

                {userState.password && (
                  <Box mt={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      A senha deve conter:
                    </Typography>

                    {criteriaList.map((item) => (
                      <Typography
                        key={item.key}
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: passwordCriteria[item.key]
                            ? "success.main"
                            : "text.secondary",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{ fontWeight: "bold", mr: 1 }}
                        >
                          {passwordCriteria[item.key] ? "✓" : "•"}
                        </Box>
                        {item.label}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Confirmar senha */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirmar nova senha"
                  type="password"
                  value={userState.password_confirmation || ""}
                  onChange={handleField("password_confirmation")}
                  disabled={isLoading}
                  error={
                    Boolean(userState.password) &&
                    Boolean(userState.password_confirmation) &&
                    userState.password !== userState.password_confirmation
                  }
                  helperText={
                    userState.password &&
                    userState.password_confirmation &&
                    userState.password !== userState.password_confirmation
                      ? "A confirmação não confere."
                      : ""
                  }
                />
              </Grid>

              {/* Ações */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  <Button variant="outlined" href="/profile" disabled={isLoading}>
                    Voltar
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Aguarde..." : "Salvar alterações"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
