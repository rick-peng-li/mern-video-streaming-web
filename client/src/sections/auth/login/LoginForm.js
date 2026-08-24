import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Alert, Snackbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { API_SERVER } from '../../../constants';

// ----------------------------------------------------------------------

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password should be of minimum 6 characters').required('Password is required'),
});

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('error');

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(`${API_SERVER}/api/users/login`, values);
      if (response.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        setAlertType('success');
        setAlertMessage('Login successful');
        setTimeout(() => navigate('/videos', { replace: true }), 1000);
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="email"
            label="Email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Checkbox name="remember" label="Remember me" />
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={formik.isSubmitting}
        >
          Login
        </LoadingButton>
      </form>

      <Snackbar
        open={!!alertMessage}
        autoHideDuration={4000}
        onClose={() => setAlertMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlertMessage(null)} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
