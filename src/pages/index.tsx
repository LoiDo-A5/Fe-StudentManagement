import React, { useEffect, useState } from 'react';
import useStyles from '../styles/list-room/useListRoomStyle';
import PrivateRoute from '@/commons/PrivateRoute';
import { Box, Card, CardContent, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { axiosGet } from '@/utils/apis/axios';
import API from '@/configs/API';
import usePagination from '@/hooks/usePagination';
import TabClassList from '@/commons/TabClassList';
import ListSubjectScorePage from '@/commons/ListSubjectScorePage';
import ListStudent from '@/commons/ListStudent';
import SubjectReport from '@/commons/SubjectReport';
import SemesterReport from '@/commons/SemesterReport';
import backgroundImage from "../images/background2.jpg";

const HomePage: React.FC = () => {
  const classes = useStyles();
  const [classesList, setClassesList] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<any>({});

  const { page, totalPage, onPageChange } = usePagination(students?.count || 0, students?.page_size || 10);

  const getClassList = async () => {
    const { success, data } = await axiosGet(API.CLASS.NAMES);
    if (success) {
      setClassesList(data);
    }
  };

  const getStudentsInClass = async () => {
    if (!selectedClass) return;

    const { success, data } = await axiosGet(API.CLASS.CLASS_LIST, {
      params: {
        class_id: selectedClass,
        page,
        page_size: 10,
      },
    });

    if (success) {
      setStudents(data);
    }
  };

  const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>, nextPage: number) => {
    setSelectedClass(event.target.value as string);
    onPageChange(nextPage);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    onPageChange(newPage);
  };

  const listStudents = students?.results?.students || [];
  const [value, setValue] = useState('1');

  const handleChange = (_: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    getClassList();
  }, []);

  useEffect(() => {
    getStudentsInClass();
  }, [selectedClass, page]);

  return (
    <PrivateRoute>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          pt: { xs: 9, sm: 10 },
          px: { xs: 1.5, sm: 2.5, md: 4 },
          pb: { xs: 2.5, md: 4 },
          backgroundImage: `linear-gradient(180deg, rgba(248,250,252,0.88), rgba(240,246,255,0.94)), url(${backgroundImage.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: { xs: 4, md: 5 },
              overflow: 'hidden',
              border: '1px solid rgba(148,163,184,0.18)',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255,255,255,0.78)',
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2.5, md: 3.5 } }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="dashboard tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                      minHeight: { xs: 44, md: 52 },
                      '& .MuiTabs-scroller': {
                        overflowX: 'auto !important',
                      },
                      '& .MuiTabs-flexContainer': {
                        gap: { xs: 0.75, md: 1 },
                      },
                    }}
                  >
                    {[
                      ['1', 'Danh sách lớp'],
                      ['2', 'Danh Sách Học Sinh'],
                      ['3', 'Bảng Điểm Môn Học'],
                      ['4', 'Báo Cáo Tổng Kết Môn'],
                      ['5', 'Báo Cáo Tổng Kết Học Kỳ'],
                    ].map(([tabValue, label]) => (
                      <Tab
                        key={tabValue}
                        label={label}
                        value={tabValue}
                        sx={{
                          minHeight: { xs: 44, md: 52 },
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: { xs: 12.5, sm: 13.5, md: 14 },
                          px: { xs: 1.2, md: 2.2 },
                          color: 'text.secondary',
                          '&.Mui-selected': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    ))}
                  </TabList>
                </Box>

                <TabPanel value="1" sx={{ px: { xs: 0, md: 1 }, py: { xs: 2, md: 3 } }}>
                  <TabClassList
                    selectedClass={selectedClass}
                    setSelectedClass={setSelectedClass}
                    classesList={classesList}
                    listStudents={listStudents}
                    totalPage={totalPage}
                    page={page}
                    onPageChange={onPageChange}
                    handlePageChange={handlePageChange}
                    handleClassChange={handleClassChange}
                  />
                </TabPanel>
                <TabPanel value="2" sx={{ px: { xs: 0, md: 1 }, py: { xs: 2, md: 3 } }}><ListStudent /></TabPanel>
                <TabPanel value="3" sx={{ px: { xs: 0, md: 1 }, py: { xs: 2, md: 3 } }}><ListSubjectScorePage /></TabPanel>
                <TabPanel value="4" sx={{ px: { xs: 0, md: 1 }, py: { xs: 2, md: 3 } }}><SubjectReport /></TabPanel>
                <TabPanel value="5" sx={{ px: { xs: 0, md: 1 }, py: { xs: 2, md: 3 } }}><SemesterReport /></TabPanel>
              </TabContext>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </PrivateRoute>
  );
};

export default HomePage;