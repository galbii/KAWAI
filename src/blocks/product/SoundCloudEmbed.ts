import type { Block } from 'payload'

export const SoundCloudEmbed: Block = {
  slug: 'product-soundcloud-embed',
  labels: {
    singular: '🎵 SoundCloud Player',
    plural: 'SoundCloud Players',
  },
  imageURL: 'https://via.placeholder.com/300x200?text=SoundCloud+Embed',
  imageAltText:
    'Embed a SoundCloud track or playlist — paste a SoundCloud URL and a player appears on the product page. Leave the URL empty to hide this block.',
  interfaceName: 'ProductSoundCloudEmbedBlock',
  fields: [
    // URL
    {
      name: 'soundcloudUrl',
      type: 'text',
      admin: {
        description:
          'Paste any SoundCloud URL — track or playlist (e.g. https://soundcloud.com/kawai-global/sets/ca401-audio-demos). Leave empty to hide the block.',
        placeholder: 'https://soundcloud.com/artist/track-or-playlist',
      },
    },
    // Optional section heading
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading above the player (e.g., "Listen — CA401 Audio Demos")',
        placeholder: 'Listen',
      },
    },
    // Player options group
    {
      name: 'playerOptions',
      type: 'group',
      admin: { description: 'Controls for the SoundCloud widget' },
      fields: [
        {
          name: 'visual',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Visual mode — shows large artwork above the waveform. Classic mode is compact and minimal.',
          },
        },
        {
          name: 'autoPlay',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Auto-play when the page loads (not recommended — browsers often block this)',
          },
        },
        {
          name: 'showComments',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show SoundCloud comments on the waveform' },
        },
        {
          name: 'showRelated',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Show related tracks after playback ends' },
        },
      ],
    },
    // Theme
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light (Pearl)', value: 'light' },
        { label: 'Dark (Charcoal)', value: 'dark' },
      ],
      admin: { description: 'Section background theme' },
    },
  ],
}
