import React, { useEffect, useState } from 'react';
import useStyles from '../styles/list-room/useListRoomStyle';
import PrivateRoute from '@/commons/PrivateRoute';
import { Box, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { axiosGet } from '@/utils/apis/axios';
import API from '@/configs/API';
import usePagination from '@/hooks/usePagination';
import moment from 'moment';
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
    const [students, setStudents] = useState<any>([]);

    const { page, totalPage, onPageChange } = usePagination(students?.count || 0, students?.page_size || 10);

    const getClassList = async () => {
        const { success, data } = await axiosGet(API.CLASS.NAMES);
        if (success) {
            setClassesList(data);
        }
    };

    const getStudentsInClass = async () => {
        if (!selectedClass) return;

        const { success, data } = await axiosGet(`${API.CLASS.CLASS_LIST}`, {
            params: {
                class_id: selectedClass,
                page,
                page_size: 10
            }
        });

        if (success) {
            setStudents(data);
        }
    };

    const handleClassChange = (event: React.ChangeEvent<{ value: unknown }>, page: number) => {
        setSelectedClass(event.target.value as string);
        onPageChange(page);
    };

    const handlePageChange = (_, newPage: number) => {
        onPageChange(newPage);
    };

    const listStudents = students?.results?.students || [];

    // Manage the selected tab state
    const [value, setValue] = useState('1');

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
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
            <Box sx={{
                minHeight: "100vh",
                width: "100%",
                paddingTop: 8,
                paddingRight: 2.5,
                paddingLeft: 2.5,
                backgroundImage: `url(${backgroundImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                flexDirection: "column",
            }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Danh sách lớp" value="1" />
                            <Tab label="Danh Sách Học Sinh" value="2" />
                            <Tab label="Bảng Điểm Môn Học" value="3" />
                            <Tab label="Báo Cáo Tổng Kết Môn" value="4" />
                            <Tab label="Báo Cáo Tổng Kết Học Kỳ" value="5" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
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
                    <TabPanel value="2"><ListStudent /></TabPanel>
                    <TabPanel value="3"><ListSubjectScorePage /></TabPanel>
                    <TabPanel value="4"><SubjectReport /></TabPanel>
                    <TabPanel value="5"><SemesterReport /></TabPanel>
                </TabContext>
            </Box>
        </PrivateRoute>
    );
};

export default HomePage;
