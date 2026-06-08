import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
import { axiosGet } from '@/utils/apis/axios';
import API from '@/configs/API';
import useStyles from './style';
import { ToastTopHelper } from '@/utils/utils';

const SubjectReport: React.FC = () => {
  const classes = useStyles();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [semester, setSemester] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [reportData, setReportData] = useState<any[]>([]);
  const [subjectName, setSubjectName] = useState<string>('');


  useEffect(() => {
    const fetchSubjects = async () => {
      const { success, data } = await axiosGet(API.SUBJECT.LIST);
      if (success) setSubjects(data);
    };
    fetchSubjects();
  }, []);

  const handleFetchSubjectReport = async () => {
    if (!selectedSubject || !semester) {
      ToastTopHelper.error('Vui lòng chọn môn và học kỳ');
      return;
    }
    const { success, data } = await axiosGet(API.SUBJECT_REPORT.LIST, {
      params: {
        subject_id: selectedSubject,
        semester,
      },
    });

    if (success) {
      setReportData(data.report);
      setSubjectName(data.subject);
    }
  };

  return (
    <Container className={classes.wrapContainer} sx={{ px: { xs: 0, sm: 2 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: 22, sm: 28, md: 34 }, fontWeight: 800 }}>
        Báo Cáo Tổng Kết Môn
      </Typography>

      <Grid container spacing={3} alignItems="center">
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

        <Grid item xs={12} md={4}>
          <Button variant="contained" color="primary" fullWidth onClick={handleFetchSubjectReport}>
            Xem Báo Cáo
          </Button>
        </Grid>
      </Grid>

      {reportData.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: { xs: 15, sm: 18 } }}>
            Môn: {subjectName} - Học kỳ: {semester}
          </Typography>

          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Lớp</TableCell>
                  <TableCell>Sĩ số</TableCell>
                  <TableCell>Số lượng đạt</TableCell>
                  <TableCell>Tỷ lệ (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.stt}</TableCell>
                    <TableCell>{row.class_name}</TableCell>
                    <TableCell>{row.total_students}</TableCell>
                    <TableCell>{row.passed_students}</TableCell>
                    <TableCell>{row.pass_rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default SubjectReport;