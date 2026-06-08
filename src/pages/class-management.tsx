import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';
import { axiosGet, axiosPost } from '../utils/apis/axios';
import API from '../configs/API';
import { ToastTopHelper } from '@/utils/utils';
import { useRouter } from 'next/router';
import PrivateRoute from '@/commons/PrivateRoute';
import useStyles from "../styles/class-management/useClassManagementStyle";

const ClassPage: React.FC = () => {
    const classes = useStyles();
    const [classLevels, setClassLevels] = useState<any[]>([]);
    const [classNames, setClassNames] = useState<any[]>([]);
    const [newClassLevel, setNewClassLevel] = useState<string>('');
    const [newClassName, setNewClassName] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const router = useRouter();

    // Fetch ClassLevels and ClassNames
    useEffect(() => {
        const fetchClassLevels = async () => {
            const { success, data } = await axiosGet(API.CLASS.LEVELS);
            if (success) {
                setClassLevels(data);
            }
        };

        const fetchClassNames = async () => {
            const { success, data } = await axiosGet(API.CLASS.NAMES);
            if (success) {
                setClassNames(data);
            }
        };

        fetchClassLevels();
        fetchClassNames();
    }, []);

    const handleCreateClassLevel = async () => {
        if (!newClassLevel) {
            ToastTopHelper.error('Khối lớp không được để trống');
            return;
        }

        // Validate level_name phải là một số nguyên từ 1 đến 12
        const levelNumber = parseInt(newClassLevel, 10);
        if (isNaN(levelNumber) || levelNumber < 1 || levelNumber > 12) {
            ToastTopHelper.error('Khối lớp phải là một số nguyên từ 1 đến 12');
            return;
        }

        const { success, data } = await axiosPost(API.CLASS.CREATE_LEVEL, { level_name: newClassLevel });
        if (success) {
            setClassLevels([...classLevels, data]);
            setNewClassLevel('');
            ToastTopHelper.success('Khối lớp đã được tạo');
        }
    };


    const handleCreateClassName = async () => {
        if (!newClassName || !selectedLevel) {
            ToastTopHelper.error('Tên lớp và Khối lớp phải được chọn');
            return;
        }

        const classNamePattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{2,}$/;
        if (!classNamePattern.test(newClassName)) {
            ToastTopHelper.error('Tên lớp phải có ít nhất 2 ký tự, gồm ít nhất 1 chữ và 1 số');
            return;
        }

        const { success, data } = await axiosPost(API.CLASS.CREATE_NAME, {
            class_name: newClassName,
            level: selectedLevel,
        });
        if (success) {
            setClassNames([...classNames, data]);
            setNewClassName('');
            setSelectedLevel('');
            ToastTopHelper.success('Lớp đã được tạo');
        }
    };


    return (
        <PrivateRoute>
            <Box className={classes.wrapContainer}>
                <Container maxWidth="lg">
                    <Card className={classes.pageCard}>
                        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                    <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: 22, sm: 28, md: 34 }, fontWeight: 800 }}>
                        Quản lý Khối Lớp và Lớp Học
                    </Typography>
                    <Grid container spacing={{ xs: 2, md: 4 }}>
                        {/* Khối lớp */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Tạo Khối Lớp Mới</Typography>
                            <TextField
                                label="Tên Khối Lớp"
                                fullWidth
                                variant="outlined"
                                value={newClassLevel}
                                onChange={(e) => setNewClassLevel(e.target.value)}
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" fullWidth onClick={handleCreateClassLevel} sx={{ mt: 1, textTransform: 'none', py: 1.25 }}>
                                Tạo Khối Lớp
                            </Button>
                        </Grid>

                        {/* Lớp học */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Tạo Lớp Mới</Typography>
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <InputLabel>Chọn Khối Lớp</InputLabel>
                                <Select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    label="Chọn Khối Lớp"
                                >
                                    {classLevels.map((level) => (
                                        <MenuItem key={level.id} value={level.id}>
                                            {level.level_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Tên Lớp"
                                fullWidth
                                variant="outlined"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" fullWidth onClick={handleCreateClassName} sx={{ mt: 1, textTransform: 'none', py: 1.25 }}>
                                Tạo Lớp
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mt: { xs: 2, md: 4 } }}>
                        {/* Danh sách Khối Lớp */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Danh Sách Khối Lớp</Typography>
                            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 420 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Khối Lớp</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {classLevels.map((level) => (
                                            <TableRow key={level.id}>
                                                <TableCell>{level.level_name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        {/* Danh sách Lớp Học */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Danh Sách Lớp</Typography>
                            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 520 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Khối Lớp</TableCell>
                                            <TableCell>Lớp Học</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {classNames.map((className) => {
                                            const level = classLevels.find(level => level.id === className.level);

                                            return (
                                                <TableRow key={className.id}>
                                                    <TableCell>{level ? level.level_name : 'Không có khối'}</TableCell>
                                                    <TableCell>{className.class_name}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                    </Grid>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </PrivateRoute >
    );
};

export default ClassPage;
