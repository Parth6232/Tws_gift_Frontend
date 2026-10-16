import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Chip,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { Link, useLocation } from 'react-router-dom';
import { chatActions } from './chatSlice';
import { chatApiAction } from './chatApiSlice';
import { appConstants } from '../../constant/appConstants';
import { formatCurrency } from '../../utils/helper';
import { optimizeImage } from '../../utils/imageUrl';

export default function ChatbotContainer() {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const hasStickyBar = location.pathname.startsWith('/product/');

  const isOpen = useSelector((state) => state.chat?.isOpen);
  const messages = useSelector((state) => state.chat?.messages || []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  const [sendMessageMutation] = chatApiAction.useSendMessageMutation();
  const chatBottomRef = useRef(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || isTyping) return;

    setInput('');
    setLastFailedMessage(null);

    // Add user message to Redux
    const userMsg = { role: 'user', content: text };
    dispatch(chatActions.addMessage(userMsg));
    setIsTyping(true);

    try {
      // Build last 10 messages
      const last10 = [...messages, userMsg]
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await sendMessageMutation({ messages: last10 }).unwrap();

      dispatch(
        chatActions.addMessage({
          role: 'assistant',
          content: res.reply || 'Here is what I found for you!',
          products: res.products || [],
        })
      );
    } catch (err) {
      const status = err?.status || err?.originalStatus;
      let errMsg = 'I am having a little trouble connecting right now. Please try again in a moment!';
      if (status === 429) {
        errMsg = 'Slow down a little, friend! Too many messages received at once. Please give me a second.';
      } else if (status === 503) {
        errMsg = 'Chat service is resting for a brief moment. Feel free to browse our Shop or contact us on WhatsApp!';
      }

      setLastFailedMessage(text);
      dispatch(
        chatActions.addMessage({
          role: 'assistant',
          content: errMsg,
          isError: true,
        })
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: hasStickyBar ? 84 : 24, md: 28 },
          right: { xs: 20, md: 28 },
          zIndex: 1000,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <IconButton
            onClick={() => dispatch(chatActions.toggleChat())}
            aria-label="Open gift assistant chat"
            sx={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              color: '#FFFFFF',
              boxShadow: isDark
                ? '0 8px 24px rgba(242, 117, 143, 0.4)'
                : '0 8px 24px rgba(217, 69, 107, 0.35)',
              border: `2px solid ${isDark ? '#F2758F' : '#FFFFFF'}`,
              '&:hover': {
                backgroundColor: isDark ? '#E55E7A' : '#C4365A',
              },
            }}
          >
            {isOpen ? (
              <CloseRoundedIcon sx={{ fontSize: 26 }} />
            ) : (
              <CardGiftcardRoundedIcon sx={{ fontSize: 26 }} />
            )}
          </IconButton>
        </motion.div>
      </Box>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            elevation={10}
            sx={{
              position: 'fixed',
              bottom: { xs: 0, sm: 96 },
              right: { xs: 0, sm: 24 },
              width: { xs: '100vw', sm: 'min(380px, calc(100vw - 24px))' },
              height: { xs: '100dvh', sm: 'min(560px, calc(100dvh - 120px))' },
              borderRadius: { xs: 0, sm: '24px' },
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1001,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: isDark
                ? '0 16px 48px rgba(0, 0, 0, 0.6)'
                : '0 16px 48px rgba(74, 33, 24, 0.15)',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                backgroundColor: isDark ? '#231613' : '#FDF7EE',
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  🎁
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Fraunces", serif',
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: theme.palette.text.primary,
                      }}
                    >
                      TWS Gifts Assistant
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                    TWS Gifts Gift Stylist
                  </Typography>
                </Box>
              </Box>

              <IconButton
                size="small"
                onClick={() => dispatch(chatActions.setChatOpen(false))}
                sx={{ color: theme.palette.text.secondary }}
              >
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Messages Scroll Area */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
              aria-live="polite"
            >
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '82%',
                        p: 1.5,
                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        backgroundColor: isUser
                          ? theme.palette.primary.main
                          : isDark
                          ? '#2A1B17'
                          : '#FBF5ED',
                        color: isUser ? '#FFFFFF' : theme.palette.text.primary,
                        border: isUser
                          ? 'none'
                          : `1px solid ${theme.palette.divider}`,
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      {msg.content}
                    </Box>

                    {/* Retry button on error */}
                    {msg.isError && lastFailedMessage && (
                      <Chip
                        icon={<RefreshRoundedIcon sx={{ fontSize: 14 }} />}
                        label="Retry message"
                        size="small"
                        onClick={() => handleSend(lastFailedMessage)}
                        sx={{ mt: 0.75, cursor: 'pointer', fontSize: '0.75rem' }}
                      />
                    )}

                    {/* Horizontal Mini Product Cards */}
                    {msg.products && msg.products.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1.25,
                          mt: 1.25,
                          maxWidth: '100%',
                          overflowX: 'auto',
                          py: 0.5,
                          scrollbarWidth: 'none',
                          '&::-webkit-scrollbar': { display: 'none' },
                        }}
                      >
                        {msg.products.map((p) => (
                          <Box
                            key={p._id || p.slug}
                            component={Link}
                            to={`/product/${p.slug}`}
                            onClick={() => {
                              if (isMobile) dispatch(chatActions.setChatOpen(false));
                            }}
                            sx={{
                              width: 140,
                              minWidth: 140,
                              p: 1,
                              borderRadius: '12px',
                              border: `1px solid ${theme.palette.divider}`,
                              backgroundColor: theme.palette.background.paper,
                              textDecoration: 'none',
                              color: theme.palette.text.primary,
                              display: 'flex',
                              flexDirection: 'column',
                              transition: 'transform 0.15s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                borderColor: theme.palette.primary.main,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                height: 90,
                                borderRadius: '8px',
                                overflow: 'hidden',
                                mb: 0.75,
                                backgroundColor: isDark ? '#231613' : '#FDF7EE',
                              }}
                            >
                              <img
                                src={optimizeImage(p.image, 200)}
                                alt={p.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                lineHeight: 1.2,
                                height: '2.4em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mb: 0.5,
                              }}
                            >
                              {p.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: '"Fraunces", serif',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                mt: 'auto',
                              }}
                            >
                              {formatCurrency(p.price)}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <Box
                  sx={{
                    alignSelf: 'flex-start',
                    p: 1.5,
                    borderRadius: '16px 16px 16px 4px',
                    backgroundColor: isDark ? '#2A1B17' : '#FBF5ED',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Box
                    component={motion.div}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: theme.palette.primary.main }}
                  />
                  <Box
                    component={motion.div}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                    sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: theme.palette.primary.main }}
                  />
                  <Box
                    component={motion.div}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: theme.palette.primary.main }}
                  />
                </Box>
              )}

              <div ref={chatBottomRef} />
            </Box>

            {/* Quick Reply Chips */}
            {messages.length <= 3 && (
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: 'flex',
                  gap: 1,
                  overflowX: 'auto',
                  borderTop: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isDark ? '#231613' : '#FDF7EE',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {appConstants.chatbotQuickReplies.map((chip, idx) => (
                  <Chip
                    key={idx}
                    label={chip}
                    size="small"
                    onClick={() => handleSend(chip)}
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      borderRadius: '8px',
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Input Form */}
            <Box
              sx={{
                p: 1.5,
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about gifts, budgets..."
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                InputProps={{
                  sx: {
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    backgroundColor: isDark ? '#231613' : '#FFFDF9',
                  },
                }}
              />
              <IconButton
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: '#FFFFFF',
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: isDark ? '#E55E7A' : '#C4365A',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: theme.palette.divider,
                    color: theme.palette.text.secondary,
                  },
                }}
              >
                <SendRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Paper>
        )}
      </AnimatePresence>
    </>
  );
}
