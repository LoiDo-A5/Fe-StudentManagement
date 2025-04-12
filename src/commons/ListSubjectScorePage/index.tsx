import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Autocomplete } from '@mui/material';
import { axiosGet } from '@/utils/apis/axios';
import API from '@/configs/API';
import useStyles from './style';
import { ToastTopHelper } from '@/utils/utils';

const ListSubjectScorePage: React.FC = () => {
  const classes = useStyles();
  const [classNames, setClassNames] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [semester, setSemester] = useState<number>(1); // Default semester 1
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [subjectScores, setSubjectScores] = useState<any[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const { success, data } = await axiosGet(API.CLASS.NAMES);
      if (success) setClassNames(data);
    };

    const fetchSubjects = async () => {
      const { success, data } = await axiosGet(API.SUBJECT.LIST);
      if (success) setSubjects(data);
    };

    fetchClasses();
    fetchSubjects();
  }, []);

  const handleFetchSubjectScores = async () => {
    if (!selectedClass) {
      ToastTopHelper.error('Vui lòng chọn lớp');
      return;
    }

    // Kiểm tra nếu chưa chọn môn học
    if (!selectedSubject) {
      ToastTopHelper.error('Vui lòng chọn môn học');
      return;
    }

    // Kiểm tra nếu chưa chọn học kỳ
    if (!semester) {
      ToastTopHelper.error('Vui lòng chọn học kỳ');
      return;
    }

    const { success, data, error } = await axiosGet(API.SUBJECT_SCORE.LIST, {
      params: {
        class_id: selectedClass,
        subject_id: selectedSubject,
        semester,
      },
    });
    if (success) {
      setSubjectScores(data);
    }
  };

  return (
    <div className={classes.wrapContainer}>
      <Typography variant="h4" gutterBottom>
        Bảng Điểm Môn Học
      </Typography>
      <Grid container spacing={4}>
        {/* Select Class */}
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

        {/* Select Subject */}
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

        {/* Select Semester */}
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

        {/* Submit Button */}
        <Grid item xs={12} md={4}>
          <Button variant="contained" color="primary" fullWidth onClick={handleFetchSubjectScores}>
            Xem Bảng Điểm
          </Button>
        </Grid>

        {/* Display Subject Scores */}
        <Grid item xs={12}>
          <TableContainer component={Paper} >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Họ và Tên</TableCell>
                  <TableCell>Điểm 15’</TableCell>
                  <TableCell>Điểm 1 Tiết</TableCell>
                  <TableCell>Điểm Cuối HK</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjectScores.map((score, index) => (
                  <TableRow key={score.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{score.student_name}</TableCell>
                    <TableCell>{score.midterm_score}</TableCell>
                    <TableCell>{score.final_score}</TableCell>
                    <TableCell>{score.final_exam_score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default ListSubjectScorePage;
