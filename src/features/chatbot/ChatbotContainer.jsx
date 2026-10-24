import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
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
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link, useLocation } from 'react-router-dom';
import { chatActions } from './chatSlice';
import { chatApiAction } from './chatApiSlice';
import { appConstants } from '../../constant/appConstants';
import { formatCurrency } from '../../utils/helper';
import { optimizeImage } from '../../utils/imageUrl';

function AssistantAvatar({ size = 28, isDark }) {
  return (
    <Box
      component="picture"
      sx={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: '50%',
        display: 'inline-block',
        overflow: 'hidden',
        border: `1px solid ${isDark ? 'rgba(242, 117, 143, 0.4)' : 'rgba(217, 69, 107, 0.3)'}`,
        flexShrink: 0,
        backgroundColor: 'transparent',
      }}
    >
      <source srcSet="/assets/assistant-icon.webp" type="image/webp" />
      <img
        src="/assets/assistant-icon.png"
        width={size}
        height={size}
        draggable={false}
        alt="TWS Assistant"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
        }}
      />
    </Box>
  );
}

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
  const messagesContainerRef = useRef(null);

  // Prevent background body scrolling when full-screen chat is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen, isMobile]);

  // Reliable bottom scroll via requestAnimationFrame and scrollHeight
  useLayoutEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      const frame = requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [messages, isOpen, isTyping, lastFailedMessage]);

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
      } else if (status === 502 || status === 503) {
        errMsg = 'Chat service is resting for a brief moment. Feel free to browse our Shop or contact us directly on WhatsApp!';
      }

      setLastFailedMessage(text);
      dispatch(
        chatActions.addMessage({
          role: 'assistant',
          content: errMsg,
          isError: true,
          status,
          showWhatsAppFallback: status === 502 || status === 503 || status === 0 || !status,
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
          bottom: { xs: hasStickyBar ? 96 : 24, md: 28 },
          right: { xs: 16, sm: 20, md: 28 },
          zIndex: 1301,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="chat-close"
                initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                <IconButton
                  onClick={() => dispatch(chatActions.toggleChat())}
                  aria-label="Close chat"
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: '#FFFFFF',
                    boxShadow: isDark
                      ? '0 8px 24px rgba(242, 117, 143, 0.4)'
                      : '0 8px 24px rgba(217, 69, 107, 0.35)',
                    border: `2.5px solid ${isDark ? '#F2758F' : '#FFFFFF'}`,
                    '&:hover': {
                      backgroundColor: isDark ? '#E55E7A' : '#C4365A',
                    },
                  }}
                >
                  <CloseRoundedIcon sx={{ fontSize: 26 }} />
                </IconButton>
              </motion.div>
            ) : (
              <motion.div
                key="chat-launcher"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
              >
                <IconButton
                  onClick={() => dispatch(chatActions.toggleChat())}
                  aria-label="Open gift assistant chat"
                  sx={{
                    width: { xs: hasStickyBar ? 52 : 56, sm: 64 },
                    height: { xs: hasStickyBar ? 52 : 56, sm: 64 },
                    p: 0,
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    border: `2.5px solid ${isDark ? '#F2758F' : '#FFFFFF'}`,
                    boxShadow: isDark
                      ? '0 8px 28px rgba(242, 117, 143, 0.35)'
                      : '0 8px 24px rgba(217, 69, 107, 0.30)',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <Box
                    component="picture"
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      display: 'block',
                      overflow: 'hidden',
                    }}
                  >
                    <source srcSet="/assets/assistant-icon.webp" type="image/webp" />
                    <img
                      src="/assets/assistant-icon.png"
                      width="100%"
                      height="100%"
                      draggable={false}
                      alt="TWS Gifts Assistant"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                        userSelect: 'none',
                      }}
                    />
                  </Box>

                  {/* Online Dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 1,
                      right: 1,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#4CAF50',
                      border: `2px solid ${theme.palette.background.paper}`,
                      boxShadow: '0 0 4px rgba(76, 175, 80, 0.6)',
                      zIndex: 2,
                    }}
                  />
                </IconButton>

                <Typography
                  sx={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: 1,
                    mt: 0.75,
                    color: theme.palette.text.primary,
                    px: '10px',
                    py: '3px',
                    borderRadius: '999px',
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: isDark
                      ? '0 2px 8px rgba(0,0,0,0.4)'
                      : '0 2px 8px rgba(74,33,24,0.08)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Assistant
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
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
            elevation={12}
            sx={{
              position: 'fixed',
              top: { xs: 0, sm: 'auto' },
              left: { xs: 0, sm: 'auto' },
              bottom: { xs: 0, sm: '96px' },
              right: { xs: 0, sm: '24px' },
              width: { xs: '100%', sm: 'min(380px, calc(100vw - 24px))' },
              height: {
                xs: '100dvh',
                sm: 'min(560px, calc(100dvh - 96px - 88px))',
              },
              maxHeight: {
                xs: '100dvh',
                sm: 'min(560px, calc(100dvh - 96px - 88px))',
              },
              borderRadius: { xs: 0, sm: '24px' },
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1300,
              backgroundColor: theme.palette.background.paper,
              border: { xs: 'none', sm: `1px solid ${theme.palette.divider}` },
              boxShadow: isDark
                ? '0 16px 48px rgba(0, 0, 0, 0.6)'
                : '0 16px 48px rgba(74, 33, 24, 0.15)',
              paddingBottom: { xs: 'env(safe-area-inset-bottom, 0px)', sm: 0 },
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                flexShrink: 0,
                backgroundColor: isDark ? '#231613' : '#FDF7EE',
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  component="picture"
                  sx={{
                    width: 42,
                    height: 42,
                    minWidth: 42,
                    minHeight: 42,
                    borderRadius: '50%',
                    border: `1.5px solid ${theme.palette.primary.main}`,
                    display: 'block',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <source srcSet="/assets/assistant-icon.webp" type="image/webp" />
                  <img
                    src="/assets/assistant-icon.png"
                    width="42"
                    height="42"
                    draggable={false}
                    alt="TWS Gifts Assistant"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block',
                      userSelect: 'none',
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: '"Fraunces", serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: theme.palette.text.primary,
                      lineHeight: 1.2,
                    }}
                  >
                    TWS Gifts Assistant
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        backgroundColor: '#4CAF50',
                        display: 'inline-block',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        display: 'block',
                        fontSize: '0.75rem',
                        lineHeight: 1.2,
                      }}
                    >
                      Online • Answers in seconds
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <IconButton
                onClick={() => dispatch(chatActions.setChatOpen(false))}
                aria-label="Close chat"
                sx={{
                  width: 44,
                  height: 44,
                  minWidth: 44,
                  minHeight: 44,
                  color: theme.palette.text.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    color: theme.palette.text.primary,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(74, 33, 24, 0.08)',
                  },
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Box>

            {/* Messages Scroll Area */}
            <Box
              ref={messagesContainerRef}
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                p: 2,
                pb: 2.5,
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
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 1,
                        maxWidth: '100%',
                        width: '100%',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {!isUser && <AssistantAvatar size={28} isDark={isDark} />}
                      <Box
                        sx={{
                          maxWidth: isUser ? '85%' : 'calc(85% - 36px)',
                          p: 1.5,
                          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          backgroundColor: isUser
                            ? theme.palette.primary.main
                            : isDark
                            ? '#2A1B17'
                            : '#FBF5ED',
                          color: isUser ? '#FFFFFF' : theme.palette.text.primary,
                          border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                        }}
                      >
                        {msg.content}
                      </Box>
                    </Box>

                    {/* Retry button & WhatsApp fallback on error */}
                    {msg.isError && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, ml: isUser ? 0 : '36px', flexWrap: 'wrap' }}>
                        {lastFailedMessage && (
                          <Chip
                            icon={<RefreshRoundedIcon sx={{ fontSize: 14 }} />}
                            label="Retry message"
                            size="small"
                            onClick={() => handleSend(lastFailedMessage)}
                            sx={{
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              borderRadius: '8px',
                            }}
                          />
                        )}
                        {(msg.status === 502 || msg.status === 503 || msg.showWhatsAppFallback) && (
                          <Chip
                            component="a"
                            href={`https://wa.me/${appConstants.whatsappNumber}?text=${encodeURIComponent(
                              appConstants.whatsappDefaultMessage || 'Hi TWS Gifts! I need help with gift recommendations.'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            clickable
                            icon={<WhatsAppIcon sx={{ fontSize: 15, color: '#25D366 !important' }} />}
                            label="Chat on WhatsApp"
                            size="small"
                            sx={{
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              borderRadius: '8px',
                              backgroundColor: isDark ? 'rgba(37, 211, 102, 0.12)' : '#E8F5E9',
                              color: '#25D366',
                              border: '1px solid rgba(37, 211, 102, 0.4)',
                              '&:hover': {
                                backgroundColor: isDark ? 'rgba(37, 211, 102, 0.2)' : '#D7ECD9',
                              },
                            }}
                          />
                        )}
                      </Box>
                    )}

                    {/* Horizontal Mini Product Cards */}
                    {msg.products && msg.products.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1.25,
                          mt: 1.25,
                          ml: isUser ? 0 : '36px',
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
                              flexShrink: 0,
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
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 1,
                    alignSelf: 'flex-start',
                  }}
                >
                  <AssistantAvatar size={28} isDark={isDark} />
                  <Box
                    sx={{
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
                </Box>
              )}
            </Box>

            {/* Quick Reply Chips */}
            {messages.length <= 3 && (
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.75,
                  flexShrink: 0,
                  maxHeight: 96,
                  overflowY: 'auto',
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
                      maxWidth: '100%',
                      height: 'auto',
                      py: 0.5,
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        px: 1,
                        py: 0.25,
                      },
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
                pb: { xs: 'calc(12px + env(safe-area-inset-bottom, 0px))', sm: 1.5 },
                flexShrink: 0,
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
                aria-label="Send message"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: '#FFFFFF',
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  flexShrink: 0,
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
