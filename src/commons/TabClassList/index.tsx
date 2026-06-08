import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PaginationCustom from '../PaginationCustom';
import moment from 'moment';
import useStyles from './styles';

interface TabClassListProps {
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
  classesList: any[];
  listStudents: any[];
  totalPage: number;
  page: number;
  onPageChange: (page: number) => void;
  handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  handleClassChange: (event: React.ChangeEvent<{ value: unknown }>, page: number) => void;
}

const TabClassList: React.FC<TabClassListProps> = ({
  selectedClass,
  classesList,
  listStudents,
  totalPage,
  page,
  handlePageChange,
  handleClassChange
}) => {
  const classes = useStyles();


  return (
    <Box>
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography className={classes.titleRoom}>DANH SÁCH LỚP</Typography>
      </Box>

      <FormControl fullWidth sx={{ mb: { xs: 2, md: 4 } }}>
        <InputLabel id="class-select-label">Chọn lớp</InputLabel>
        <Select
          labelId="class-select-label"
          id="class-select"
          value={selectedClass}
          onChange={handleClassChange}
          label="Chọn lớp"
        >
          {classesList.map((classItem) => (
            <MenuItem key={classItem.id} value={classItem.id}>
              {`${classItem.level_name}${classItem.class_name}`}  - Sĩ số: {classItem.number_of_students}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} sx={{ mt: { xs: 1.5, md: 4 }, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Địa chỉ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listStudents.map((student, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.full_name}</TableCell>
                <TableCell>{student.gender === 0 ? 'Nam' : 'Nữ'}</TableCell>
                <TableCell>{moment(student.birthday).format('DD/MM/YYYY')}</TableCell>
                <TableCell>{student.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

export default TabClassList;
