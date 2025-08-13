import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, Animated, Keyboard, ImageBackground } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useChat, ChatMessage } from '../context/ChatContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeInsets } from '../hooks/useSafeInsets';
import { useNavigation } from '@react-navigation/native';
import { SmartVetAI, AIResponse } from '../services/SmartVetAI';

export default function ChatScreen() {
  const { messages, setMessages, isProcessing, setIsProcessing, refreshChat, hasResponses } = useChat();
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const { colors, theme } = useTheme();
  const insets = useSafeInsets();
  const navigation = useNavigation();
  const refreshButtonScale = useRef(new Animated.Value(0)).current;

  // Theme-based background images - now using PNG for both web and mobile
  const backgroundImage = theme === 'light' 
    ? require('../../assets/ChatGPThorizontal.png')
    : require('../../assets/ChatGPThorizontal1.png');

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  useEffect(() => {
    // Animate refresh button appearance
    Animated.spring(refreshButtonScale, {
      toValue: hasResponses ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [hasResponses]);

  // Add keyboard listeners for better mobile experience
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
          setTimeout(() => scrollToEnd(), 100);
        }
      );

      return () => {
        keyboardDidShowListener?.remove();
      };
    }
  }, []);

  const scrollToEnd = () => {
    setTimeout(() => {
      listRef.current?.scrollToEnd?.({ animated: true });
    }, 80);
  };

  const confirmRefreshChat = () => {
    if (Platform.OS === 'web') {
      // For web, use browser confirm
      if (window.confirm('This will clear all messages and start a new conversation. Continue?')) {
        console.log('Refresh button pressed - clearing chat');
        setText('');
        setIsProcessing(false);
        refreshChat();
        setTimeout(() => {
          listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
        }, 100);
        console.log('Refresh completed');
      }
    } else {
      // For mobile, use Alert
      Alert.alert(
        'Refresh Chat',
        'This will clear all messages and start a new conversation. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Refresh', 
            style: 'destructive',
            onPress: () => {
              console.log('Refresh button pressed - clearing chat');
              setText('');
              setIsProcessing(false);
              refreshChat();
              setTimeout(() => {
                listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
              }, 100);
              console.log('Refresh completed');
            }
          }
        ]
      );
    }
  };

  const send = async () => {
    if (!text.trim() || isProcessing) return;
    
    const userMessage: ChatMessage = { 
      id: String(Date.now()), 
      role: 'user', 
      text: text.trim() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setText('');
    setIsProcessing(true);

    // Add thinking message
    const thinkingId = String(Date.now() + 1);
    setMessages(prev => [...prev, {
      id: thinkingId,
      role: 'thinking',
      text: '🧠 Analyzing symptoms...'
    }]);

    try {
      // Simulate AI thinking process
      await SmartVetAI.simulateThinking((step) => {
        setMessages(prev => prev.map(msg => 
          msg.id === thinkingId 
            ? { ...msg, text: step }
            : msg
        ));
      });

      // Get AI response
      const aiResponse: AIResponse = await SmartVetAI.processMessage(userMessage.text);
      
      // If requires doctor, show doctor search animation
      if (aiResponse.requiresDoctor && aiResponse.doctorInfo) {
        // Show doctor search steps
        await SmartVetAI.simulateDoctorSearch((step) => {
          setMessages(prev => prev.map(msg => 
            msg.id === thinkingId 
              ? { ...msg, text: step }
              : msg
          ));
        });
      }
      
      // Remove thinking message and add AI response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== thinkingId);
        return [...filtered, {
          id: String(Date.now() + 2),
          role: 'bot',
          text: aiResponse.text,
          confidence: aiResponse.confidence,
          urgency: aiResponse.urgency,
          recommendations: aiResponse.recommendations,
          doctorInfo: aiResponse.doctorInfo
        }];
      });

    } catch (error) {
      // Remove thinking message and add error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== thinkingId);
        return [...filtered, {
          id: String(Date.now() + 2),
          role: 'bot',
          text: 'I apologize, but I\'m experiencing technical difficulties. Please try again or consult with a veterinarian directly.',
          urgency: 'low'
        }];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'emergency': return '#FF4444';
      case 'high': return '#FF8800';
      case 'medium': return '#FFAA00';
      case 'low': return colors.accent;
      default: return colors.accent;
    }
  };

  const getUrgencyIcon = (urgency?: string) => {
    switch (urgency) {
      case 'emergency': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🟡';
      case 'low': return '✅';
      default: return '💬';
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    const isThinking = item.role === 'thinking';
    
    return (
      <View style={[styles.msgRow, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
        <View style={[
          styles.msgBubble, 
          { 
            backgroundColor: isUser ? colors.primary : (isThinking ? (colors.border as string) + '40' : colors.surface),
            borderColor: isUser ? colors.accent : colors.border,
            opacity: isThinking ? 0.8 : 1,
          }
        ]}>
          {/* Main message */}
          <Text style={{ 
            color: isUser ? '#fff' : colors.text,
            fontSize: 16,
            lineHeight: 22,
            fontStyle: isThinking ? 'italic' : 'normal'
          }}>
            {item.text}
          </Text>

          {/* AI Response Details */}
          {!isUser && !isThinking && item.confidence && (
            <View style={styles.aiDetails}>
              {/* Confidence and Urgency */}
              <View style={styles.aiMeta}>
                <View style={styles.confidenceContainer}>
                  <Text style={[styles.confidenceText, { color: colors.text }]}>
                    {getUrgencyIcon(item.urgency)} {item.confidence}% confidence
                  </Text>
                </View>
                {item.urgency && item.urgency !== 'low' && (
                  <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) }]}>
                    <Text style={styles.urgencyText}>
                      {item.urgency.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Doctor Information */}
              {item.doctorInfo && (
                <View style={styles.doctorContainer}>
                  <Text style={[styles.doctorTitle, { color: colors.text }]}>
                    👨‍⚕️ Recommended Specialist:
                  </Text>
                  <TouchableOpacity 
                    style={[styles.doctorCard, { backgroundColor: (colors.primary as string) + '20', borderColor: colors.primary }]}
                    onPress={() => navigation.navigate('Doctors' as never)}
                  >
                    <View style={styles.doctorInfo}>
                      <Text style={[styles.doctorName, { color: colors.text }]}>
                        {item.doctorInfo.name}
                      </Text>
                      <Text style={[styles.doctorSpecialty, { color: colors.text }]}>
                        {item.doctorInfo.specialty}
                      </Text>
                      <Text style={[styles.doctorLocation, { color: colors.text }]}>
                        📍 {item.doctorInfo.location}
                      </Text>
                      <Text style={[styles.doctorRating, { color: colors.text }]}>
                        ⭐ {item.doctorInfo.rating}/5.0
                      </Text>
                    </View>
                    <View style={styles.doctorAction}>
                      <Ionicons name="arrow-forward" size={20} color={colors.primary as string} />
                    </View>
                  </TouchableOpacity>
                  <Text style={[styles.doctorNote, { color: colors.text }]}>
                    Tap to view doctor profile and book consultation
                  </Text>
                </View>
              )}

              {/* Recommendations */}
              {item.recommendations && item.recommendations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                  <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                    📋 Recommendations:
                  </Text>
                  {item.recommendations.map((rec: string, index: number) => (
                    <Text key={index} style={[styles.recommendationItem, { color: colors.text }]}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined} 
      style={[styles.container]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : Platform.OS === 'android' ? 20 : 0}
    >
      <ImageBackground
        source={backgroundImage}
        style={[styles.container, { backgroundColor: colors.background }]}
        resizeMode="cover"
        imageStyle={{ opacity: 0.05 }}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ 
            padding: 16,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        />

      {/* Floating Refresh Button - only show if there are responses */}
      {hasResponses && (
        <Animated.View style={[
          styles.floatingRefreshButton, 
          { 
            backgroundColor: colors.surface, 
            borderColor: colors.border,
            shadowColor: colors.text,
            transform: [{ scale: refreshButtonScale }]
          }
        ]}>
          <TouchableOpacity 
            style={styles.floatingRefreshTouch}
            onPress={confirmRefreshChat}
          >
            <Ionicons name="refresh" size={16} color={colors.text as string} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={[
        styles.inputRow, 
        { 
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + 10,
        }
      ]}>
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TextInput
            placeholder="Describe your cat's symptoms..."
            placeholderTextColor={colors.text as string + '80'}
            value={text}
            onChangeText={setText}
            style={[styles.input, { color: colors.text }]}
            multiline
            maxLength={500}
            onSubmitEditing={send}
            returnKeyType="send"
            blurOnSubmit={false}
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.sendBtn, 
            { 
              backgroundColor: (text.trim() && !isProcessing) ? colors.accent : colors.border,
            }
          ]} 
          onPress={send}
          disabled={!text.trim() || isProcessing}
        >
          <Ionicons name={isProcessing ? "hourglass-outline" : "send"} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingRefreshButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 1000,
  },
  floatingRefreshTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  msgRow: { marginVertical: 4 },
  msgBubble: { 
    maxWidth: '85%', 
    padding: 14, 
    borderRadius: 18, 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  aiMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceContainer: {
    flex: 1,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  urgencyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  doctorContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  doctorTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  doctorLocation: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  doctorRating: {
    fontSize: 12,
    fontWeight: '600',
  },
  doctorAction: {
    paddingLeft: 8,
  },
  doctorNote: {
    fontSize: 11,
    fontStyle: 'italic',
    opacity: 0.7,
    textAlign: 'center',
  },
  recommendationsContainer: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  recommendationItem: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
    marginBottom: 2,
  },
  inputRow: { 
    flexDirection: 'row', 
    padding: 16, 
    alignItems: 'flex-end', 
    borderTopWidth: 1,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: { 
    fontSize: 16,
    lineHeight: 20,
    minHeight: 20,
  },
  sendBtn: { 
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});