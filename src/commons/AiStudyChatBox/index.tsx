import React, { useMemo, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import API from '@/configs/API';
import Colors from '@/configs/Colors';
import { axiosPost } from '@/utils/apis/axios';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const welcomeMessage: ChatMessage = {
  role: 'assistant',
  content: 'Mình có thể hỗ trợ các chủ đề học tập THPT cấp 3. Bạn gửi bài cần hỏi nhé.',
};

const chatPrimaryColor = Colors.Primary;
const chatPrimaryHoverColor = '#0f56a3';

const AiStudyChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canSend = useMemo(() => message.trim().length > 0 && !isSending, [isSending, message]);

  const openChat = () => {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  };

  const sendMessage = async () => {
    const currentMessage = message.trim();
    if (!currentMessage || isSending) return;

    setMessages((current) => [...current, { role: 'user', content: currentMessage }]);
    setMessage('');
    setIsSending(true);

    const { success, data } = await axiosPost(false, API.AI.CHAT, {
      message: currentMessage,
    });

    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        content: success
          ? data.answer
          : data?.detail || 'Hiện tại trợ lý AI chưa phản hồi được. Bạn thử lại sau nhé.',
      },
    ]);
    setIsSending(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Tooltip title="Trợ lý học tập">
        <IconButton
          onClick={openChat}
          sx={{
            position: 'fixed',
            right: { xs: 16, md: 28 },
            bottom: { xs: 16, md: 28 },
            zIndex: 1300,
            width: 56,
            height: 56,
            color: '#fff',
            backgroundColor: chatPrimaryColor,
            boxShadow: '0 16px 32px rgba(22, 104, 195, 0.3)',
            '&:hover': {
              backgroundColor: chatPrimaryHoverColor,
            },
          }}
          aria-label="Mở trợ lý học tập"
        >
          <SmartToyIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        right: { xs: 12, sm: 20, md: 28 },
        bottom: { xs: 12, sm: 20, md: 28 },
        zIndex: 1300,
        width: { xs: 'calc(100vw - 24px)', sm: 380 },
        maxWidth: 420,
        height: { xs: 520, sm: 560 },
        maxHeight: 'calc(100vh - 24px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid rgba(22, 104, 195, 0.16)',
        boxShadow: '0 20px 48px rgba(22, 104, 195, 0.18)',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{
          px: 2,
          py: 1.5,
          color: '#fff',
          backgroundColor: chatPrimaryColor,
        }}
      >
        <SchoolIcon fontSize="small" />
        <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1 }}>
          Trợ lý học tập
        </Typography>
        <Tooltip title="Đóng">
          <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: '#fff' }} aria-label="Đóng trợ lý">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack spacing={1.25} sx={{ flex: 1, overflowY: 'auto', p: 1.5, backgroundColor: '#f8fafc' }}>
        {messages.map((item, index) => {
          const isUser = item.role === 'user';
          return (
            <Box
              key={`${item.role}-${index}`}
              sx={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '86%',
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                whiteSpace: 'pre-wrap',
                color: isUser ? '#fff' : '#1f2937',
                backgroundColor: isUser ? chatPrimaryColor : '#fff',
                border: isUser ? 'none' : '1px solid rgba(148, 163, 184, 0.24)',
                boxShadow: isUser ? '0 8px 18px rgba(22, 104, 195, 0.16)' : '0 8px 18px rgba(15, 23, 42, 0.06)',
              }}
            >
              <Typography variant="body2" sx={{ lineHeight: 1.55 }}>
                {item.content}
              </Typography>
            </Box>
          );
        })}

        {isSending && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'text.secondary', px: 0.5 }}>
            <CircularProgress size={16} />
            <Typography variant="caption">Đang trả lời...</Typography>
          </Stack>
        )}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ p: 1.5, borderTop: '1px solid rgba(148, 163, 184, 0.22)' }}>
        <TextField
          inputRef={inputRef}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi học tập THPT..."
          size="small"
          fullWidth
          multiline
          maxRows={3}
          sx={{
            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
              borderColor: chatPrimaryColor,
            },
          }}
        />
        <Tooltip title="Gửi">
          <span>
            <IconButton
              onClick={sendMessage}
              disabled={!canSend}
              sx={{
                width: 40,
                height: 40,
                color: '#fff',
                backgroundColor: canSend ? chatPrimaryColor : '#94a3b8',
                '&:hover': {
                  backgroundColor: canSend ? chatPrimaryHoverColor : '#94a3b8',
                },
              }}
              aria-label="Gửi câu hỏi"
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default AiStudyChatBox;
