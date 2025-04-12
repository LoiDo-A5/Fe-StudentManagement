import React, { useEffect, useState } from 'react';
import { Button, Container, TextField, Typography, Grid } from '@mui/material';
import { axiosGet, axiosPut } from '@/utils/apis/axios';
import API from '@/configs/API';
import { ToastTopHelper } from '@/utils/utils';
import PrivateRoute from '@/commons/PrivateRoute';
import useStyles from "../styles/subject/useSubjectStyle";

const SystemSettingPage: React.FC = () => {
  const classes = useStyles();
  const [minAge, setMinAge] = useState<number>(15);
  const [maxAge, setMaxAge] = useState<number>(20);
  const [maxStudentsPerClass, setMaxStudentsPerClass] = useState<number>(40);
  const [passScore, setPassScore] = useState<number>(5.0);

  const [minAgeError, setMinAgeError] = useState('');
  const [maxAgeError, setMaxAgeError] = useState('');
  const [maxStudentsError, setMaxStudentsError] = useState('');
  const [passScoreError, setPassScoreError] = useState('');

  useEffect(() => {
    const fetchSetting = async () => {
      const { success, data } = await axiosGet(API.SETTING.SYSTEM);
      if (success) {
        setMinAge(data.min_student_age);
        setMaxAge(data.max_student_age);
        setMaxStudentsPerClass(data.max_students_per_class);
        setPassScore(data.pass_score);
      }
    };
    fetchSetting();
  }, []);

  const validate = (): boolean => {
    let isValid = true;

    if (isNaN(minAge) || minAge < 1 || minAge > 100) {
      setMinAgeError('Tuổi tối thiểu phải từ 1 đến 100');
      isValid = false;
    } else {
      setMinAgeError('');
    }

    if (isNaN(maxAge) || maxAge < 1 || maxAge > 100) {
      setMaxAgeError('Tuổi tối đa phải từ 1 đến 100');
      isValid = false;
    } else {
      setMaxAgeError('');
    }

    if (minAge >= maxAge) {
      setMinAgeError('Tuổi tối thiểu phải nhỏ hơn tuổi tối đa');
      setMaxAgeError('Tuổi tối đa phải lớn hơn tuổi tối thiểu');
      isValid = false;
    }

    if (maxStudentsPerClass <= 0) {
      setMaxStudentsError('Sĩ số tối đa phải lớn hơn 0');
      isValid = false;
    } else {
      setMaxStudentsError('');
    }

    if (isNaN(passScore) || passScore < 0 || passScore > 10) {
      setPassScoreError('Điểm chuẩn phải từ 0 đến 10');
      isValid = false;
    } else {
      setPassScoreError('');
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const { success } = await axiosPut(API.SETTING.SYSTEM, {
      min_student_age: minAge,
      max_student_age: maxAge,
      max_students_per_class: maxStudentsPerClass,
      pass_score: passScore,
    });

    if (success) {
      ToastTopHelper.success('Cập nhật thành công!');
    }
  };

  return (
    <PrivateRoute>
      <Container className={classes.background}>
        <Typography variant="h4" gutterBottom>
          Cài đặt hệ thống
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tuổi tối thiểu"
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              error={!!minAgeError}
              helperText={minAgeError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tuổi tối đa"
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              error={!!maxAgeError}
              helperText={maxAgeError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Sĩ số tối đa của lớp"
              type="number"
              value={maxStudentsPerClass}
              onChange={(e) => setMaxStudentsPerClass(Number(e.target.value))}
              error={!!maxStudentsError}
              helperText={maxStudentsError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Điểm chuẩn đạt môn"
              type="number"
              value={passScore}
              onChange={(e) => setPassScore(Number(e.target.value))}
              error={!!passScoreError}
              helperText={passScoreError}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </Grid>
        </Grid>
      </Container>
    </PrivateRoute>
  );
};

export default SystemSettingPage;
