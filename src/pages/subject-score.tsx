import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Autocomplete } from '@mui/material';
import { axiosGet, axiosPost } from '../utils/apis/axios';
import API from '../configs/API';
import { ToastTopHelper } from '@/utils/utils';
import PrivateRoute from '@/commons/PrivateRoute';
import useStyles from "../styles/class-management/useClassManagementStyle";

const validateNumber = (value: string) => {
  const parsedValue = parseFloat(value);
  return !isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 10;
};

const SubjectScorePage: React.FC = () => {
  const classes = useStyles();
  const [classNames, setClassNames] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [semester, setSemester] = useState<number>(1); // Mặc định Học kỳ 1
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);  // Danh sách học sinh
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // Chọn học sinh

  const [midtermScores, setMidtermScores] = useState<number | null>(null);
  const [finalScores, setFinalScores] = useState<number | null>(null);
  const [finalExamScores, setFinalExamScores] = useState<number | null>(null);


  useEffect(() => {
    const fetchClasses = async () => {
      const { success, data } = await axiosGet(API.CLASS.NAMES);
      if (success) setClassNames(data);
    };

    const fetchSubjects = async () => {
      const { success, data } = await axiosGet(API.SUBJECT.LIST);
      if (success) setSubjects(data);
    };

    const fetchStudents = async () => {
      const { success, data } = await axiosGet(API.AUTH.LIST_USER);
      if (success) {
        setStudents(data.results);
      }
    };

    fetchClasses();
    fetchSubjects();
    fetchStudents();
  }, []);


  const handleSubmit = async () => {
    if (!selectedStudent) {
      ToastTopHelper.error('Vui lòng chọn học sinh');
      return;
    }

    if (!selectedClass) {
      ToastTopHelper.error('Vui lòng chọn lớp');
      return;
    }

    if (!selectedSubject) {
      ToastTopHelper.error('Vui lòng chọn môn học');
      return;
    }

    if (!semester) {
      ToastTopHelper.error('Vui lòng chọn học kỳ');
      return;
    }

    // Kiểm tra các điểm đã nhập
    if (midtermScores === null || midtermScores === '' || isNaN(midtermScores)) {
      ToastTopHelper.error('Vui lòng nhập điểm 15 phút hợp lệ');
      return;
    }

    if (finalScores === null || finalScores === '' || isNaN(finalScores)) {
      ToastTopHelper.error('Vui lòng nhập điểm 1 tiết hợp lệ');
      return;
    }

    if (finalExamScores === null || finalExamScores === '' || isNaN(finalExamScores)) {
      ToastTopHelper.error('Vui lòng nhập điểm cuối học kỳ hợp lệ');
      return;
    }

    const subjectScoreData = {
      student: selectedStudent?.id,  // Add the student ID
      class_name: selectedClass,  // Add the class ID
      subject: selectedSubject,
      semester,
      midterm_score: midtermScores,
      final_score: finalScores,
      final_exam_score: finalExamScores,
    }

    console.log('subjectScoreData', subjectScoreData)

    const { success, data } = await axiosPost(API.SUBJECT_SCORE.CREATE, subjectScoreData);

    if (success) {
      setSelectedSubject('')
      setMidtermScores('')
      setFinalScores('')
      setFinalExamScores('')
      ToastTopHelper.success('Điểm đã được cập nhật');
    }
  };

  return (
    <PrivateRoute>
      <Box className={classes.wrapContainer}>
        <Container maxWidth="lg">
          <Card className={classes.pageCard}>
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: 22, sm: 28, md: 34 }, fontWeight: 800 }}>
            Nhập Điểm Môn Học
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {/* Chọn Khối Lớp */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Chọn Khối Lớp</InputLabel>
                <Select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  label="Chọn Khối Lớp"
                >
                  {classNames.map((className) => (
                    <MenuItem key={className.id} value={className.id}>
                      {`${className.level_name} ${className.class_name}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Chọn Môn Học */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Chọn Môn</InputLabel>
                <Select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  label="Chọn Môn"
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Chọn Học Kỳ */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Chọn Học Kỳ</InputLabel>
                <Select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  label="Chọn Học Kỳ"
                >
                  <MenuItem value={1}>Học kỳ 1</MenuItem>
                  <MenuItem value={2}>Học kỳ 2</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Chọn Học Sinh */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Chọn Học Sinh</Typography>
              <Autocomplete
                value={selectedStudent}
                onChange={(event, newValue) => setSelectedStudent(newValue)}
                options={students}
                getOptionLabel={(option) => option.full_name || ''}
                renderInput={(params) => <TextField {...params} label="Học Sinh" variant="outlined" />}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                disableClearable
                fullWidth
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.full_name}
                  </li>
                )}
              />
            </Grid>

            {/* Nhập điểm 15' */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Nhập Điểm 15’</Typography>
              <TextField
                label="Nhập Điểm 15'"
                fullWidth
                variant="outlined"
                value={midtermScores}
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateNumber(value)) {
                    setMidtermScores(parseFloat(value) || 0);
                  } else {
                    ToastTopHelper.error('Điểm phải là số từ 0 đến 10');
                  }
                }} margin="normal"
              />
            </Grid>

            {/* Nhập điểm 1 Tiết */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Nhập Điểm 1 Tiết</Typography>
              <TextField
                label="Nhập Điểm 1 Tiết"
                fullWidth
                variant="outlined"
                value={finalScores}
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateNumber(value)) {
                    setFinalScores(parseFloat(value));
                  } else {
                    ToastTopHelper.error('Điểm phải là số từ 0 đến 10');
                  }
                }} margin="normal"
              />
            </Grid>

            {/* Nhập điểm Cuối HK */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Nhập Điểm Cuối HK</Typography>
              <TextField
                label="Nhập Điểm Cuối HK"
                fullWidth
                variant="outlined"
                value={finalExamScores}
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateNumber(value)) {
                    setFinalExamScores(parseFloat(value));
                  } else {
                    ToastTopHelper.error('Điểm phải là số từ 0 đến 10');
                  }
                }} margin="normal"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ py: 1.25, textTransform: 'none' }}>
                Cập nhật điểm
              </Button>
            </Grid>
          </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </PrivateRoute>
  );
};

export default SubjectScorePage;
