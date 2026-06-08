import React, { useEffect, useMemo, useState } from 'react';
import PrivateRoute from '@/commons/PrivateRoute';
import API from '@/configs/API';
import { axiosGet, axiosPost } from '@/utils/apis/axios';
import { RootState } from '@/utils/types';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import ReplyIcon from '@mui/icons-material/Reply';

type ForumUser = {
  id: number;
  name?: string;
  full_name?: string;
  username?: string;
  avatar?: string;
  role?: number;
};

type ForumSpace = {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  created_by: ForumUser;
  post_count?: number;
  created_at?: string;
};

type ForumComment = {
  id: number;
  content: string;
  author: ForumUser;
  created_at: string;
  parent?: number | null;
  replies?: ForumComment[];
};

type ForumPost = {
  id: number;
  title: string;
  content: string;
  kind: 'question' | 'discussion' | 'resource';
  is_pinned: boolean;
  forum: ForumSpace;
  author: ForumUser;
  like_count?: number;
  comment_count?: number;
  liked_by_me?: boolean;
  created_at: string;
  comments?: ForumComment[];
};

const forumKinds = [
  { value: 'question', label: 'Câu hỏi' },
  { value: 'discussion', label: 'Thảo luận' },
  { value: 'resource', label: 'Tài liệu' },
];

const ForumPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.account.user);
  const [spaces, setSpaces] = useState<ForumSpace[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [replyTarget, setReplyTarget] = useState<{ postId: number | null; commentId: number | null }>({
    postId: null,
    commentId: null,
  });
  const [spaceForm, setSpaceForm] = useState({ title: '', description: '', is_public: true });
  const [postForm, setPostForm] = useState({ title: '', content: '', kind: 'question' });
  const [commentDraft, setCommentDraft] = useState<Record<number, string>>({});
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const selectedSpace = useMemo(() => spaces.find((space) => space.id === selectedSpaceId) || null, [spaces, selectedSpaceId]);

  const fetchSpaces = async () => {
    setLoadingSpaces(true);
    const { success, data } = await axiosGet(API.FORUM.SPACES);
    if (success) {
      setSpaces(data);
      if (!selectedSpaceId && data.length > 0) {
        setSelectedSpaceId(data[0].id);
      }
    }
    setLoadingSpaces(false);
  };

  const fetchPosts = async (spaceId: number) => {
    setLoadingPosts(true);
    const { success, data } = await axiosGet(API.FORUM.POSTS, {
      params: { forum_id: spaceId },
    });
    if (success) {
      setPosts(data);
    }
    setLoadingPosts(false);
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  useEffect(() => {
    if (selectedSpaceId) {
      fetchPosts(selectedSpaceId);
      setExpandedPostId(null);
      setReplyTarget({ postId: null, commentId: null });
    } else {
      setPosts([]);
    }
  }, [selectedSpaceId]);

  const handleCreateSpace = async () => {
    if (!spaceForm.title.trim()) return;

    const { success, data } = await axiosPost(API.FORUM.SPACES, spaceForm);
    if (success) {
      setSpaceForm({ title: '', description: '', is_public: true });
      setSpaces((current) => [data, ...current]);
      setSelectedSpaceId(data.id);
    }
  };

  const handleCreatePost = async () => {
    if (!selectedSpaceId || !postForm.title.trim() || !postForm.content.trim()) return;

    const { success } = await axiosPost(API.FORUM.POSTS, {
      forum_id: selectedSpaceId,
      title: postForm.title,
      content: postForm.content,
      kind: postForm.kind,
    });

    if (success) {
      setPostForm({ title: '', content: '', kind: 'question' });
      await fetchPosts(selectedSpaceId);
    }
  };

  const handleToggleLike = async (postId: number) => {
    const { success } = await axiosPost(API.FORUM.TOGGLE_LIKE(postId), {});
    if (success && selectedSpaceId) {
      await fetchPosts(selectedSpaceId);
    }
  };

  const handleSubmitComment = async (postId: number) => {
    const content = commentDraft[postId]?.trim();
    if (!content || !selectedSpaceId) return;

    const { success } = await axiosPost(API.FORUM.COMMENTS, {
      post_id: postId,
      parent_id: replyTarget.postId === postId ? replyTarget.commentId : null,
      content,
    });

    if (success) {
      setCommentDraft((current) => ({ ...current, [postId]: '' }));
      setReplyTarget({ postId: null, commentId: null });
      await fetchPosts(selectedSpaceId);
    }
  };

  const renderComment = (comment: ForumComment, depth = 0, postId: number) => {
    const marginLeft = depth * 3;
    return (
      <Box key={comment.id} sx={{ ml: marginLeft, mt: 1.5 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderColor: 'rgba(15,23,42,0.08)',
            backgroundColor: depth === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(248,250,252,0.92)',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar src={comment.author?.avatar} sx={{ width: 32, height: 32 }} />
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight={700} fontSize={14}>
                  {comment.author?.name || comment.author?.full_name || comment.author?.username || 'Học sinh'}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  {moment(comment.created_at).fromNow()}
                </Typography>
              </Stack>
              <Typography sx={{ mt: 0.75, whiteSpace: 'pre-wrap' }}>{comment.content}</Typography>
              <Button
                size="small"
                startIcon={<ReplyIcon fontSize="small" />}
                sx={{ mt: 1, textTransform: 'none' }}
                onClick={() => setReplyTarget({ postId, commentId: comment.id })}
              >
                Trả lời
              </Button>
            </Box>
          </Stack>
        </Paper>

        {replyTarget.postId === postId && replyTarget.commentId === comment.id && (
          <Box sx={{ mt: 1.25, ml: 4 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={commentDraft[postId] || ''}
              onChange={(event) => setCommentDraft((current) => ({ ...current, [postId]: event.target.value }))}
              placeholder="Viết phản hồi ngay bên dưới bình luận này..."
            />
            <Button sx={{ mt: 1 }} variant="contained" onClick={() => handleSubmitComment(postId)}>
              Gửi trả lời
            </Button>
          </Box>
        )}

        {comment.replies?.map((reply) => renderComment(reply, depth + 1, postId))}
      </Box>
    );
  };

  return (
    <PrivateRoute>
      <Box
        sx={{
          minHeight: '100vh',
          pt: 10,
          pb: 6,
          px: { xs: 2, md: 4 },
          background: 'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 35%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 50%, #f8fafc 100%)',
        }}
      >
        <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 5,
              background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #2563eb 100%)',
              color: 'white',
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'absolute', inset: 0, opacity: 0.16, background: 'radial-gradient(circle at 20% 20%, white, transparent 20%), radial-gradient(circle at 80% 10%, white, transparent 15%)' }} />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ position: 'relative' }}>
              <Box>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <ForumOutlinedIcon />
                  <Typography variant="h4" fontWeight={800}>
                    Diễn đàn học tập
                  </Typography>
                </Stack>
                <Typography sx={{ mt: 1, maxWidth: 820, color: 'rgba(255,255,255,0.88)' }}>
                  Tạo không gian thảo luận riêng cho lớp, đặt câu hỏi, đăng tài liệu, trao đổi đáp án, và xây dựng luồng học tập theo kiểu diễn đàn phổ biến: chủ đề, bài viết, bình luận lồng nhau, và thả tim cho bài hữu ích.
                </Typography>
              </Box>
              <Chip
                label={`${spaces.length} diễn đàn`}
                sx={{ backgroundColor: 'rgba(255,255,255,0.14)', color: 'white', fontWeight: 700 }}
              />
            </Stack>
          </Paper>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">
            <Box sx={{ width: { xs: '100%', lg: 360 } }}>
              <Paper sx={{ p: 2.5, borderRadius: 4, mb: 2 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5 }}>
                  Tạo diễn đàn mới
                </Typography>
                <Stack spacing={1.5}>
                  <TextField
                    label="Tên diễn đàn"
                    value={spaceForm.title}
                    onChange={(event) => setSpaceForm((current) => ({ ...current, title: event.target.value }))}
                    fullWidth
                  />
                  <TextField
                    label="Mô tả"
                    value={spaceForm.description}
                    onChange={(event) => setSpaceForm((current) => ({ ...current, description: event.target.value }))}
                    fullWidth
                    multiline
                    minRows={3}
                  />
                  <FormControl fullWidth>
                    <Select
                      value={spaceForm.is_public ? 'public' : 'private'}
                      onChange={(event) => setSpaceForm((current) => ({ ...current, is_public: event.target.value === 'public' }))}
                    >
                      <MenuItem value="public">Công khai</MenuItem>
                      <MenuItem value="private">Riêng tư</MenuItem>
                    </Select>
                  </FormControl>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateSpace} sx={{ textTransform: 'none', py: 1.25 }}>
                    Tạo diễn đàn
                  </Button>
                </Stack>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: 4 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5 }}>
                  Danh sách diễn đàn
                </Typography>
                <Stack spacing={1.25}>
                  {loadingSpaces && <Typography color="text.secondary">Đang tải danh sách...</Typography>}
                  {!loadingSpaces && spaces.length === 0 && (
                    <Typography color="text.secondary">Chưa có diễn đàn nào. Hãy tạo diễn đàn đầu tiên.</Typography>
                  )}
                  {spaces.map((space) => (
                    <Paper
                      key={space.id}
                      onClick={() => setSelectedSpaceId(space.id)}
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        cursor: 'pointer',
                        border: selectedSpaceId === space.id ? '1px solid #2563eb' : '1px solid rgba(15,23,42,0.08)',
                        background: selectedSpaceId === space.id ? 'rgba(37,99,235,0.08)' : 'white',
                      }}
                    >
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#2563eb' }}>
                          {(space.title || 'F').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontWeight={700} noWrap>
                              {space.title}
                            </Typography>
                            <Chip size="small" label={space.is_public ? 'Công khai' : 'Riêng tư'} />
                          </Stack>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {space.description || 'Không có mô tả'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Paper sx={{ p: 2.5, borderRadius: 4, mb: 2 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" fontWeight={800}>
                      {selectedSpace?.title || 'Chọn một diễn đàn để bắt đầu'}
                    </Typography>
                    <Typography color="text.secondary">
                      {selectedSpace?.description || 'Các bài đăng, like và bình luận sẽ xuất hiện tại đây.'}
                    </Typography>
                  </Box>
                  {selectedSpace && (
                    <Chip label={`${posts.length} bài viết`} color="primary" variant="outlined" />
                  )}
                </Stack>
              </Paper>

              <Paper sx={{ p: 2.5, borderRadius: 4, mb: 2 }}>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1.5 }}>
                  Đăng bài mới
                </Typography>
                {!selectedSpace ? (
                  <Typography color="text.secondary">Hãy chọn hoặc tạo một diễn đàn trước khi đăng bài.</Typography>
                ) : (
                  <Stack spacing={1.5}>
                    <TextField
                      label="Tiêu đề"
                      value={postForm.title}
                      onChange={(event) => setPostForm((current) => ({ ...current, title: event.target.value }))}
                      fullWidth
                    />
                    <TextField
                      label="Nội dung"
                      value={postForm.content}
                      onChange={(event) => setPostForm((current) => ({ ...current, content: event.target.value }))}
                      multiline
                      minRows={4}
                      fullWidth
                    />
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }}>
                      <FormControl sx={{ minWidth: 180 }}>
                        <Select
                          value={postForm.kind}
                          onChange={(event) => setPostForm((current) => ({ ...current, kind: event.target.value }))}
                        >
                          {forumKinds.map((kind) => (
                            <MenuItem key={kind.value} value={kind.value}>
                              {kind.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreatePost} sx={{ textTransform: 'none' }}>
                        Đăng bài
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </Paper>

              <Stack spacing={2}>
                {loadingPosts && <Typography color="text.secondary">Đang tải bài viết...</Typography>}
                {!loadingPosts && selectedSpace && posts.length === 0 && (
                  <Paper sx={{ p: 3, borderRadius: 4 }}>
                    <Typography fontWeight={700}>Chưa có bài viết nào trong diễn đàn này.</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      Hãy là người mở đầu bằng một câu hỏi, mẹo học tập hoặc tài liệu ôn tập.
                    </Typography>
                  </Paper>
                )}
                {posts.map((post) => {
                  const isExpanded = expandedPostId === post.id;
                  const currentCommentDraft = commentDraft[post.id] || '';

                  return (
                    <Card key={post.id} sx={{ borderRadius: 4, boxShadow: '0 18px 40px rgba(15,23,42,0.08)' }}>
                      <CardContent>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Avatar src={post.author?.avatar} />
                          <Box sx={{ flex: 1 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                              <Box>
                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                  <Typography fontWeight={800} fontSize={18}>
                                    {post.title}
                                  </Typography>
                                  <Chip size="small" label={post.kind} color="primary" variant="outlined" />
                                  {post.is_pinned && <Chip size="small" label="Ghim" color="warning" />}
                                </Stack>
                                <Typography color="text.secondary" fontSize={13} sx={{ mt: 0.5 }}>
                                  {post.author?.name || post.author?.full_name || post.author?.username || 'Học sinh'} · {moment(post.created_at).fromNow()}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {post.forum?.title}
                              </Typography>
                            </Stack>

                            <Typography sx={{ mt: 1.5, whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
                              {post.content}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
                              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <Chip label={`${post.like_count || 0} lượt thích`} size="small" />
                                <Chip label={`${post.comment_count || 0} bình luận`} size="small" />
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                                <IconButton
                                  onClick={() => handleToggleLike(post.id)}
                                  sx={{
                                    border: '1px solid rgba(15,23,42,0.08)',
                                    borderRadius: 2,
                                  }}
                                >
                                  {post.liked_by_me ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                                </IconButton>
                                <Button
                                  variant={isExpanded ? 'contained' : 'outlined'}
                                  onClick={() => {
                                    setExpandedPostId(isExpanded ? null : post.id);
                                    setReplyTarget({ postId: null, commentId: null });
                                  }}
                                  sx={{ textTransform: 'none' }}
                                >
                                  {isExpanded ? 'Thu gọn trao đổi' : 'Mở trao đổi'}
                                </Button>
                              </Stack>
                            </Stack>

                            {isExpanded && (
                              <Box sx={{ mt: 2.5 }}>
                                <Typography fontWeight={700} sx={{ mb: 1 }}>
                                  Thảo luận dưới bài viết
                                </Typography>

                                <Stack spacing={1.5}>
                                  {(post.comments || []).map((comment) => renderComment(comment, 0, post.id))}
                                </Stack>

                                <Box sx={{ mt: 2.5 }}>
                                  {replyTarget.postId === post.id && replyTarget.commentId && (
                                    <Chip
                                      sx={{ mb: 1.25 }}
                                      label="Đang trả lời một bình luận cụ thể"
                                      onDelete={() => setReplyTarget({ postId: null, commentId: null })}
                                    />
                                  )}
                                  <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    placeholder="Viết bình luận để trao đổi cùng lớp..."
                                    value={currentCommentDraft}
                                    onChange={(event) => setCommentDraft((current) => ({ ...current, [post.id]: event.target.value }))}
                                  />
                                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Button variant="contained" onClick={() => handleSubmitComment(post.id)} sx={{ textTransform: 'none' }}>
                                      Gửi bình luận
                                    </Button>
                                    {replyTarget.postId === post.id && replyTarget.commentId && (
                                      <Button
                                        variant="text"
                                        onClick={() => setReplyTarget({ postId: null, commentId: null })}
                                        sx={{ textTransform: 'none' }}
                                      >
                                        Hủy trả lời cụ thể
                                      </Button>
                                    )}
                                  </Stack>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </PrivateRoute>
  );
};

export default ForumPage;