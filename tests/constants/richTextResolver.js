export const IMAGE_DATA = {
  type: 'doc',
  content: [
    {
      type: 'image',
      attrs: {
        src: 'https://asset',
      },
    },
  ],
}

export const SPAN_WITH_RED_CLASS = {
  type: 'doc',
  content: [
    {
      text: 'red text',
      type: 'text',
      marks: [
        {
          type: 'styled',
          attrs: {
            class: 'red',
          },
        },
      ],
    },
  ],
}

export const LINK_DATA = {
  type: 'doc',
  content: [
    {
      text: 'link text',
      type: 'text',
      marks: [
        {
          type: 'link',
          attrs: {
            href: '/link',
            target: '_blank',
            uuid: '300aeadc-c82d-4529-9484-f3f8f09cf9f5',
          },
        },
      ],
    },
  ],
}

export const EMAIL_LINK_DATA = {
  type: 'doc',
  content: [
    {
      text: 'an email link',
      type: 'text',
      marks: [
        {
          type: 'link',
          attrs: {
            href: 'email@client.com',
            target: '_blank',
            uuid: null,
            linktype: 'email',
          },
        },
      ],
    },
  ],
}

export const LONG_TEXT_FOR_IMMUTABILITY_TEST = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: 'Lorem',
          type: 'text',
          marks: [
            {
              type: 'bold',
            },
          ],
        },
        {
          text: ' ipsum, ',
          type: 'text',
        },
        {
          text: 'dolor',
          type: 'text',
          marks: [
            {
              type: 'strike',
            },
          ],
        },
        {
          text: ' sit amet ',
          type: 'text',
        },
        {
          text: 'consectetur',
          type: 'text',
          marks: [
            {
              type: 'underline',
            },
          ],
        },
        {
          text: ' adipisicing elit. ',
          type: 'text',
        },
        {
          text: 'Eos architecto',
          type: 'text',
          marks: [
            {
              type: 'code',
            },
          ],
        },
        {
          text: ' asperiores temporibus ',
          type: 'text',
        },
        {
          text: 'suscipit harum ',
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: '/test/our-service',
                uuid: '931e04b7-f701-4fe4-8ec0-78be0bee8809',
                anchor: 'anchor-text',
                target: '_blank',
                linktype: 'story',
              },
            },
          ],
        },
        {
          text: 'ut, fugit, cumque ',
          type: 'text',
        },
        {
          text: 'molestiae ',
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'asdfsdfasf',
                uuid: null,
                anchor: null,
                target: '_blank',
                linktype: 'url',
              },
            },
          ],
        },
        {
          text: 'ratione non adipisci, ',
          type: 'text',
        },
        {
          text: 'facilis',
          type: 'text',
          marks: [
            {
              type: 'italic',
            },
          ],
        },
        {
          text: ' inventore optio dolores. Rem, perspiciatis ',
          type: 'text',
        },
        {
          text: 'deserunt!',
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: '/home',
                uuid: 'fc6a453f-9aa6-4a00-a22d-49c5878f7983',
                anchor: null,
                target: '_self',
                linktype: 'story',
              },
            },
          ],
        },
        {
          text: ' Esse, maiores!',
          type: 'text',
        },
      ],
    },
  ],
}

export const CUSTOM_ATTRIBUTE_DATA = {
  type: 'paragraph',
  content: [
    {
      text: 'A nice link with custom attr',
      type: 'text',
      marks: [
        {
          type: 'link',
          attrs: {
            href: 'www.storyblok.com',
            uuid: '300aeadc-c82d-4529-9484-f3f8f09cf9f5',
            anchor: null,
            custom: {
              rel: 'nofollow',
              title: 'nice test',
            },
            target: '_blank',
            linktype: 'url'
          }
        }
      ]
    }
  ]
}

export const LINK_WITH_ANCHOR_FOR_CUSTOM_SCHEMA = {
  type: 'doc',
  content: [
    {
      text: 'link text from custom schema',
      type: 'text',
      marks: [
        {
          type: 'link',
          attrs: {
            href: '/link',
            target: '_blank',
            uuid: '300aeadc-c82d-4529-9484-f3f8f09cf9f5',
            anchor: 'anchor-text',
          },
        },
      ],
    },
  ],
}

export const LONG_TEXT_WITH_LINKS_SUB_SUP_SCRIPTS = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'bold'
            }
          ],
          text: 'Lorem Ipsum'
        },
        {
          type: 'text',
          text: ' is simply dummy text of the '
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'test.com',
                uuid: null,
                linktype: 'url',
                target: '_self',
                anchor: null,
                custom: {
                  title: 'test one',
                  rel: 'test two'
                }
              }
            }
          ],
          text: 'printing and typesetting industry'
        },
          {
            type: 'text',
            text: `. Lorem Ipsum has been the industry's standard dummy text ever since the `
          },
          {
            type: 'text',
            marks: [
              {
                type: 'superscript'
              }
            ],
            text: '1500s'
          },
          {
            type: 'text',
            text: ', when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the '
          },
          {
            type: 'text',
            marks: [
              {
                type: 'subscript'
              }
            ],
            text: '1960s'
          },
          {
            type: 'text',
            text: ' with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like '
          },
          {
            type: 'text',
            marks: [
              {
                type: 'superscript'
              }
            ],
            text: 'Aldus PageMaker'
          },
          {
            type: 'text',
            text: ' including versions of '
          },
          {
            type: 'text',
            marks: [
              {
                type: 'subscript'
              }
            ],
            text: 'Lorem Ipsum'
          },
          {
            type: 'text',
            text: '.'
          }
      ]
    }
  ]
}

export const PARAGRAPH_WITH_ANCHOR_IN_THE_MIDDLE = {
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "text": "a long text with a super nice ",
          "type": "text"
        },
        {
          "text": "anchor here",
          "type": "text",
          "marks": [
            {
              "type": "anchor",
              "attrs": {
                "id": "test2"
              }
            }
          ]
        },
        {
          "text": ", and at the end of the text is a normal tag",
          "type": "text"
        }
      ]
    }
  ]
}

export const PARAGRAPH_WITH_ANCHOR = {
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "text": "Paragraph with anchor in the midle",
          "type": "text",
          "marks": [
            {
              "type": "anchor",
              "attrs": {
                "id": "test"
              }
            }
          ]
        }
      ]
    }
  ]
}

export const TEXT_COLOR_DATA = {
  type: 'doc',
  content: [
    {
      text: 'Colored text',
      type: 'text',
      marks: [
        {
          type: 'textStyle',
          attrs: {
            color: '#E72929',
          },
        },
      ],
    },
  ],
}

export const HIGLIGHT_COLOR_DATA = {
  type: 'doc',
  content: [
    {
      text: 'Highlighted text',
      type: 'text',
      marks: [
        {
          type: 'highlight',
          attrs: {
            color: '#E72929',
          },
        },
      ],
    },
  ],
}

export const BOLD_TEXT = {
  type: 'doc',
  content: [
    {
      type: 'text',
      marks: [
        {
          type: 'bold',
        },
      ],
      text: 'Lorem Ipsum',
    },
  ],
}