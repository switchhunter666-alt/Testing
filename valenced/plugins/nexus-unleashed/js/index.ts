/**
 * NEXUS Unleashed / Valenced external plugin.
 *
 * The studio is accessible from the plugin's Settings screen inside Discord.
 * This plugin does not intercept traffic, impersonate users, or mutate other
 * people's clients. Clipboard sharing is initiated by the user.
 */
import { React, ReactNative } from '@valenced/react';
import { Clipboard } from '@valenced/externals/react-native-clipboard';
import { buildCardLink, formatMessage, MODES } from './formats';
import type { Mode } from './formats';

function SettingsComponent() {
  const [draft, setDraft] = React.useState('Hello from NEXUS Unleashed!');
  const [mode, setMode] = React.useState<Mode>('NEXUS Frame');
  const [feedback, setFeedback] = React.useState('Ready');
  const [cardHost, setCardHost] = React.useState('');
  const { ScrollView, View, Text, TextInput, Pressable } = ReactNative;
  const e = React.createElement;
  const preview = formatMessage(draft, mode);

  const button = (label: string, action: () => void, selected = false) =>
    e(Pressable, {
      key: label,
      accessibilityRole: 'button',
      accessibilityLabel: label,
      onPress: action,
      style: {
        backgroundColor: selected ? '#6253d9' : '#30334f',
        borderRadius: 11, paddingVertical: 12, paddingHorizontal: 14,
        marginRight: 8, marginBottom: 9,
      },
    }, e(Text, {style: {color: '#ffffff', fontWeight: '700'}}, label));

  return e(ScrollView, {contentContainerStyle: {
    padding: 16, paddingBottom: 48, backgroundColor: '#121422',
  }},
    e(Text, {style: {fontSize: 23, color: 'white', fontWeight: '800'}}, 'NEXUS / UNLEASHED'),
    e(Text, {style: {color: '#c5c9ea', marginTop: 7, marginBottom: 17}},
      'Creative text tools inside Discord. Compose, transform and copy into any conversation.'),
    e(Text, {style: {color: '#ffffff', fontWeight: '700', marginBottom: 8}}, 'YOUR MESSAGE'),
    e(TextInput, {
      value: draft, onChangeText: setDraft, multiline: true,
      maxLength: 1800, placeholder: 'Write something original...',
      placeholderTextColor: '#9fa4bf',
      style: {backgroundColor: '#242940', color: 'white',
        borderWidth: 1, borderColor: '#565b8c',
        borderRadius: 12, minHeight: 110, padding: 14, textAlignVertical: 'top'},
    }),
    e(Text, {style: {color: '#ffffff', fontWeight: '700', marginTop: 20, marginBottom: 10}}, 'TRANSFORM'),
    e(View, {style: {flexDirection: 'row', flexWrap: 'wrap'}},
      ...MODES.map(name => button(name, () => {
        setMode(name);
        setFeedback('Selected ' + name);
      }, mode === name)),
    ),
    e(Text, {style: {color: '#ffffff', fontWeight: '700', marginTop: 12, marginBottom: 9}}, 'PREVIEW'),
    e(Text, {selectable: true, style: {
      backgroundColor: '#242940', color: 'white', borderRadius: 12,
      padding: 15, minHeight: 86,
    }}, preview || 'Type a message to see the output.'),
    e(View, {style: {marginTop: 16, flexDirection: 'row', flexWrap: 'wrap'}},
      button('COPY FOR DISCORD', () => {
        try {
          Clipboard.setString(preview);
          setFeedback('Copied. Paste into any Discord chat.');
        } catch (error) {
          console.error('[NEXUS] Clipboard failed', error);
          setFeedback('Clipboard unavailable on this build.');
        }
      }, true),
      button('CLEAR', () => { setDraft(''); setFeedback('Cleared'); }),
    ),
    e(Text, {style: {color: '#ffffff', fontWeight: '700', marginTop: 20, marginBottom: 8}}, 'SHARE AS DISCORD CARD'),
    e(Text, {style: {color: '#aeb8d5', marginBottom: 8}},
      'Deploy the optional Share Cards worker, then enter its HTTPS URL. Card links can be previewed by ordinary Discord clients.'),
    e(TextInput, {
      value: cardHost, onChangeText: setCardHost,
      autoCapitalize: 'none', autoCorrect: false,
      placeholder: 'https://your-worker.workers.dev',
      placeholderTextColor: '#9fa4bf',
      style: {backgroundColor: '#242940', color: 'white', borderRadius: 12,
        padding: 12, marginBottom: 11},
    }),
    button('COPY LIVE CARD LINK', () => {
      try {
        const link = buildCardLink(cardHost, preview);
        Clipboard.setString(link);
        setFeedback('Card link copied! Paste into Discord to test its preview.');
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Cannot make card link.');
      }
    }),
    e(Text, {accessibilityLiveRegion: 'polite', style: {color: '#b0a8ff', marginTop: 6}}, feedback),
    e(Text, {style: {color: '#8d95b9', marginTop: 19, fontSize: 12}},
      'Only supported Discord formatting is visible to other users. No background account automation.'),
  );
}

export default plugin({
  start() {
    console.log('[NEXUS] Unleashed creative studio loaded');
  },
  stop() {
    console.log('[NEXUS] Unleashed creative studio stopped');
  },
  SettingsComponent,
});
