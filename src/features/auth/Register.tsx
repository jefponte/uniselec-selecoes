import { Box, Grid, Paper, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegisterMutation } from './authApiSlice';
import { RegisterForm } from './components/RegisterForm';
import { User } from "../../types/User";
import useTranslate from '../polyglot/useTranslate';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

interface UserForm {
    id?: number;
    name?: string;
    email?: string;
    confirmEmail?: string;
    cpf?: string;
    password?: string;
    confirmPassword?: string;
}

interface Credentials {
    name: string;
    email: string;
    cpf: string;
    password: string;
}

export const Register = () => {
    const translate = useTranslate('auth');
    const [register, statusLogin] = useRegisterMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [credentialsForm, setCredentialsForm] = useState<UserForm>({
        name: "",
        email: "",
        confirmEmail: "",
        cpf: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCredentialsForm({ ...credentialsForm, [name]: value });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const { name = "", email = "", cpf = "", password = "" } = credentialsForm;
        const credentials: Credentials = { name, email, cpf, password };

        // não usamos unwrap aqui; o erro vai cair em statusLogin.error
        await register(credentials);
    }

    useEffect(() => {
        if (statusLogin.isSuccess) {
            enqueueSnackbar("Registro realizado com sucesso!", { variant: "success" });
            setIsLoading(false);

            if (location.pathname === '/register') {
                navigate('/candidate-dashboard');
            }
        }

        if (statusLogin.error) {
            const error = statusLogin.error as FetchBaseQueryError;

            // Erros de validação vindos da API (shape conhecido)
            if ('data' in error && error.data && (error as any).data.error) {
                const errors = (error.data as { error: { [key: string]: string[] } }).error;
                if (errors) {
                    Object.entries(errors).forEach(([field, messages]) => {
                        if (Array.isArray(messages)) {
                            messages.forEach((message) => {
                                enqueueSnackbar(translate(message), { variant: "error" });
                            });
                        }
                    });
                }
            } else {
                // Fallback: problemas de comunicação (API offline, timeout, DNS, etc.)
                enqueueSnackbar("Falha de comunicação! Tente novamente mais tarde!", {
                    variant: "error",
                });
            }

            setIsLoading(false);
        }
    }, [
        enqueueSnackbar,
        statusLogin.error,
        statusLogin.isSuccess,
        navigate,
        location.pathname,
        translate
    ]);

    return (
        <Box>
            <Paper sx={{ padding: 2, maxWidth: 600, mx: 'auto', marginTop: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Registro
                </Typography>
                <RegisterForm
                    credentials={credentialsForm as User}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </Paper>
        </Box>
    );
};
