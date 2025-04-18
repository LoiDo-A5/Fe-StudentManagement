import React, { useState, FormEvent } from "react";
import { Button, Container, TextField, Link, Typography, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { axiosPost } from "../utils/apis/axios";
import API from "../configs/API";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Routes from "../utils/Route";
import { ToastTopHelper } from "@/utils/utils";
import useStyles from "../styles/sign-up/useSignUpStyle";
import PrivateRoute from "@/commons/PrivateRoute";

interface SignupFormProps { }

const SignupForm: React.FC<SignupFormProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();

  const [fullName, setFullName] = useState<string>("");
  const [gender, setGender] = useState<any>(1);
  const [birthDate, setBirthDate] = useState<any>("");
  const [address, setAddress] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const validateForm = () => {
    if (!fullName || !email || !password || !confirmPassword || !gender || !birthDate || !address) {
      ToastTopHelper.error("Tất cả các trường đều là bắt buộc");
      return false;
    }


    if (fullName.length > 60) {
      ToastTopHelper.error("Họ và tên không được vượt quá 60 ký tự");
      return false;
    }


    if (address.length > 60) {
      ToastTopHelper.error("Địa chỉ không được vượt quá 60 ký tự");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      ToastTopHelper.error("Địa chỉ email không hợp lệ");
      return false;
    }

    if (password !== confirmPassword) {
      ToastTopHelper.error("Mật khẩu và Xác nhận mật khẩu không khớp");
      return false;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;
    if (!passwordPattern.test(password)) {
      ToastTopHelper.error("Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái, số, 1 chữ cái viết hoa và 1 ký tự đặc biệt");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { success, data } = await axiosPost(API.AUTH.SIGNUP, {
      full_name: fullName,
      email,
      password1: password,
      password2: confirmPassword,
      gender: 1 ? 0 : 1,
      birthday: birthDate,
      address,
    });

    if (success) {
      ToastTopHelper.success('Tạo học sinh thành công');
      router.push(Routes.Home);
    }
  };

  const handleNavigateSignUp = () => {
    router.push(Routes.Login);
  };

  return (
    <PrivateRoute>
      <div className={classes.background}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography className={classes.title}>ĐĂNG KÝ</Typography>

          <TextField
            label="Họ và Tên"
            fullWidth
            variant="outlined"
            margin="normal"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Giới tính</InputLabel>
            <Select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              label="Giới tính"
            >
              <MenuItem value={1}>Nam giới</MenuItem>
              <MenuItem value={2}>Nữ giới</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ngày sinh"
            fullWidth
            variant="outlined"
            margin="normal"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Địa chỉ"
            fullWidth
            variant="outlined"
            margin="normal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mật khẩu"
            fullWidth
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Xác nhận mật khẩu"
            fullWidth
            variant="outlined"
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={classes.submitButton}
          >
            Đăng ký
          </Button>
          <div onClick={handleNavigateSignUp} className={classes.signupLink}>
            <Link variant="body2">
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </PrivateRoute>
  );
};

export default SignupForm;