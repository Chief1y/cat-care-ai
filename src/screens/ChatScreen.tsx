import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Msg = { id: string; role: 'user' | 'bot'; text: string };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 'welcome', role: 'bot', text: 'Hello! Ask me about your cat. Describe symptoms or ask for tips.' },
  ]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<Msg>>(null);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const scrollToEnd = () => {
    setTimeout(() => {
      listRef.current?.scrollToEnd?.({ animated: true });
    }, 80);
  };

  const send = () => {
    if (!text.trim()) return;
    const u: Msg = { id: String(Date.now()), role: 'user', text: text.trim() };
    setMessages((m) => [...m, u]);
    setText('');

    // fake bot reply
    setTimeout(() => {
      const reply: Msg = {
        id: String(Date.now() + 1),
        role: 'bot',
        text: simpleBotReply(u.text),
      };
      setMessages((m) => [...m, reply]);
    }, 700);
  };

  const simpleBotReply = (input: string) => {
    const s = input.toLowerCase();
    if (s.includes('not eating') || s.includes('not eat') || s.includes('won\'t eat')) {
      return 'If your cat stopped eating for more than 24 hours, it can be serious. Please consider seeing a vet. Do you want to connect with a vet?';
    }
    if (s.includes('vomit') || s.includes('vomiting')) {
      return 'Vomiting occasionally might be harmless, but repeated vomiting needs a vet check. Try to keep your cat hydrated.';
    }
    return "I don't fully understand — please provide more details (age, appetite, vomiting, sneezing, energy).";
  };

  const renderItem = ({ item }: { item: Msg }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, { justifyContent: isUser ? 'flex-end' : 'flex-start' }]}>
        <View style={[
          styles.msgBubble, 
          { 
            backgroundColor: isUser ? colors.primary : colors.surface,
            borderColor: isUser ? colors.accent : colors.border,
          }
        ]}>
          <Text style={{ 
            color: isUser ? '#fff' : colors.text,
            fontSize: 16,
            lineHeight: 22,
          }}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={[styles.container, { backgroundColor: colors.background }]}
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
            placeholder="Type a message..."
            placeholderTextColor={colors.text as string + '80'}
            value={text}
            onChangeText={setText}
            style={[styles.input, { color: colors.text }]}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.sendBtn, 
            { 
              backgroundColor: text.trim() ? colors.accent : colors.border,
            }
          ]} 
          onPress={send}
          disabled={!text.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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