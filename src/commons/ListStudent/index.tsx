import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { axiosGet } from '@/utils/apis/axios';
import API from '@/configs/API';
import PaginationCustom from '@/commons/PaginationCustom';
import usePagination from '@/hooks/usePagination';
import useStyles from './style';

const ListStudent: React.FC = () => {
  const classes = useStyles();
  const [students, setStudents] = useState<any>({ results: [], count: 0, page_size: 10 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassName, setSelectedClassName] = useState<string>('');
  const [classNames, setClassNames] = useState<any[]>([]);

  const { page, totalPage, onPageChange } = usePagination(students.count, students.page_size);


  const handleFetchStudents = async () => {
    const { success, data } = await axiosGet(API.AUTH.LIST_STUDENT, {
      params: {
        page,
        page_size: 10,
        search: searchQuery,  // Send the search query in the request
        class_name_id: selectedClassName
      }
    });

    if (success) {
      setStudents(data);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (_, newPage: number) => {
    onPageChange(newPage);
  };

  useEffect(() => {
    handleFetchStudents();
  }, [page, searchQuery, selectedClassName]);  // Re-fetch when the page or search query changes

  useEffect(() => {

    const fetchClassNames = async () => {
      const { success, data } = await axiosGet(API.CLASS.NAMES);
      if (success) {
        setClassNames(data);
      }
    };


    fetchClassNames();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: 22, sm: 28, md: 34 }, fontWeight: 800 }}>
        Danh Sách Học Sinh
      </Typography>

      {/* Search Field */}
      <Grid container spacing={4} >
        <Grid item xs={12} md={6} mt={2}>
          <TextField
            label="Tìm kiếm theo Họ và Tên"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange} />
        </Grid>

        <Grid item xs={12} md={6} >
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Chọn Lớp</InputLabel>
            <Select
              value={selectedClassName}
              onChange={(e) => setSelectedClassName(e.target.value)}
              label="Chọn Lớp"
            >
              {/* Clear option */}
              <MenuItem value="">
                <em>None</em>
              </MenuItem>

              {classNames.map((className) => {
                const levelName = className.level_name;
                const classNameLabel = `${levelName}${className.class_name}`;

                return (
                  <MenuItem key={className.id} value={className.id}>
                    {classNameLabel}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ overflowX: 'auto', mt: 1 }}>
        <Table sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Họ và Tên</TableCell>
              <TableCell>Lớp</TableCell>
              <TableCell>Điểm Học Kỳ 1</TableCell>
              <TableCell>Điểm Học Kỳ 2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.results?.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                <TableCell>{student.full_name}</TableCell>
                <TableCell>{student.class_name}</TableCell>
                <TableCell>{(student?.student_score?.semester_1_avg)?.toFixed(1) ?? 'Chưa có điểm'}</TableCell>
                <TableCell>{(student?.student_score?.semester_2_avg)?.toFixed(1) ?? 'Chưa có điểm'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Hiển thị phân trang */}
      {!!totalPage && (
        <PaginationCustom
          paginationStyle={classes.pagination}
          count={totalPage}
          page={page}
          onChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default ListStudent;
