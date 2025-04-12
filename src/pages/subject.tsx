import React, { useEffect, useState } from 'react';
import {
    Button, Container, Grid, TextField, Typography,
    Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Paper
} from '@mui/material';
import { axiosGet, axiosPost } from '../utils/apis/axios';
import API from '../configs/API';
import { ToastTopHelper } from '@/utils/utils';
import PrivateRoute from '@/commons/PrivateRoute';
import useStyles from "../styles/subject/useSubjectStyle";

const SubjectPage: React.FC = () => {
    const classes = useStyles();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [newSubjectName, setNewSubjectName] = useState<string>('');
    const [newSubjectCode, setNewSubjectCode] = useState<string>('');

    const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
    const [editingSubjectName, setEditingSubjectName] = useState<string>('');
    const [editingSubjectCode, setEditingSubjectCode] = useState<string>('');

    useEffect(() => {
        const fetchSubjects = async () => {
            const { success, data } = await axiosGet(API.SUBJECT.LIST);
            if (success) {
                setSubjects(data);
            }
        };
        fetchSubjects();
    }, []);

    const handleCreateSubject = async () => {
        if (!newSubjectName || !newSubjectCode) {
            ToastTopHelper.error('Tên môn học và mã môn học không được để trống');
            return;
        }

        const { success, data } = await axiosPost(API.SUBJECT.CREATE, {
            name: newSubjectName,
            code: newSubjectCode,
        });

        if (success) {
            setSubjects([...subjects, data]);
            setNewSubjectName('');
            setNewSubjectCode('');
            ToastTopHelper.success('Môn học đã được tạo');
        }
    };

    const handleEditSubject = (subject: any) => {
        setEditingSubjectId(subject.id);
        setEditingSubjectName(subject.name);
        setEditingSubjectCode(subject.code);
    };

    const handleSaveEdit = async () => {
        if (!editingSubjectName || !editingSubjectCode || editingSubjectId === null) return;

        const { success, data } = await axiosPost(API.SUBJECT.DETAIL(editingSubjectId), {
            name: editingSubjectName,
            code: editingSubjectCode,
        }, 'put');

        if (success) {
            setSubjects(subjects.map((s) => (s.id === editingSubjectId ? data : s)));
            ToastTopHelper.success('Cập nhật thành công');
            setEditingSubjectId(null);
        }
    };

    const handleDeleteSubject = async (id: number) => {
        const { success } = await axiosPost(API.SUBJECT.DETAIL(id), {}, 'delete');
        if (success) {
            setSubjects(subjects.filter((s) => s.id !== id));
            ToastTopHelper.success('Xóa thành công');
        }
    };

    return (
        <PrivateRoute>
            <div className={classes.background}>
                <Container maxWidth="lg">
                    <Typography variant="h4" gutterBottom>
                        Quản lý Môn Học
                    </Typography>
                    <Grid container spacing={4}>
                        {/* Tạo Môn Học */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Tạo Môn Học Mới</Typography>
                            <TextField
                                label="Tên Môn Học"
                                fullWidth
                                variant="outlined"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Mã Môn Học"
                                fullWidth
                                variant="outlined"
                                value={newSubjectCode}
                                onChange={(e) => setNewSubjectCode(e.target.value)}
                                margin="normal"
                            />
                            <Button variant="contained" color="primary" fullWidth onClick={handleCreateSubject}>
                                Tạo Môn Học
                            </Button>
                        </Grid>

                        {/* Danh Sách Môn Học */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" mb={2}>Danh Sách Môn Học</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tên Môn Học</TableCell>
                                            <TableCell>Mã Môn Học</TableCell>
                                            <TableCell>Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subjects.map((subject) => (
                                            <TableRow key={subject.id}>
                                                {editingSubjectId === subject.id ? (
                                                    <>
                                                        <TableCell>
                                                            <TextField
                                                                value={editingSubjectName}
                                                                onChange={(e) => setEditingSubjectName(e.target.value)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                value={editingSubjectCode}
                                                                onChange={(e) => setEditingSubjectCode(e.target.value)}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button size="small" onClick={handleSaveEdit}>Lưu</Button>
                                                        </TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell>{subject.name}</TableCell>
                                                        <TableCell>{subject.code}</TableCell>
                                                        <TableCell>
                                                            <Button size="small" onClick={() => handleEditSubject(subject)}>Sửa</Button>
                                                            <Button size="small" color="error" onClick={() => handleDeleteSubject(subject.id)}>Xóa</Button>
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </PrivateRoute>
    );
};

export default SubjectPage;
