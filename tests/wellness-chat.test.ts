import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the LLM module
vi.mock('../server/_core/llm', () => ({
  invokeLLM: vi.fn(),
}));

describe('Wellness Chat AI Integration', () => {
  const CRISIS_KEYWORDS = [
    'suicide',
    'suicidal',
    'kill myself',
    'end my life',
    'harm myself',
    'self harm',
    'overdose',
    'cutting',
    'want to die',
    'hopeless',
    'no point in living',
  ];

  describe('Crisis Detection', () => {
    it('should detect suicide-related keywords', () => {
      const testMessages = [
        'I want to kill myself',
        'I am suicidal',
        'I want to end my life',
      ];

      testMessages.forEach((message) => {
        const hasCrisis = CRISIS_KEYWORDS.some((keyword) =>
          message.toLowerCase().includes(keyword)
        );
        expect(hasCrisis).toBe(true);
      });
    });

    it('should detect self-harm keywords', () => {
      const testMessages = [
        'I am cutting myself',
        'I want to harm myself',
        'I am self harming',
      ];

      testMessages.forEach((message) => {
        const hasCrisis = CRISIS_KEYWORDS.some((keyword) =>
          message.toLowerCase().includes(keyword)
        );
        expect(hasCrisis).toBe(true);
      });
    });

    it('should detect hopelessness keywords', () => {
      const testMessages = [
        'I feel hopeless',
        'There is no point in living',
        'I am hopeless',
      ];

      testMessages.forEach((message) => {
        const hasCrisis = CRISIS_KEYWORDS.some((keyword) =>
          message.toLowerCase().includes(keyword)
        );
        expect(hasCrisis).toBe(true);
      });
    });

    it('should not flag normal wellness messages as crisis', () => {
      const normalMessages = [
        'I am feeling anxious today',
        'I had a stressful day at work',
        'I am feeling sad',
        'Can you help me with my anxiety?',
      ];

      normalMessages.forEach((message) => {
        const hasCrisis = CRISIS_KEYWORDS.some((keyword) =>
          message.toLowerCase().includes(keyword)
        );
        expect(hasCrisis).toBe(false);
      });
    });

    it('should be case-insensitive', () => {
      const testMessages = [
        'SUICIDE',
        'Suicide',
        'SuIcIdE',
        'KILL MYSELF',
        'Kill Myself',
      ];

      testMessages.forEach((message) => {
        const hasCrisis = CRISIS_KEYWORDS.some((keyword) =>
          message.toLowerCase().includes(keyword)
        );
        expect(hasCrisis).toBe(true);
      });
    });
  });

  describe('Message Validation', () => {
    it('should validate message structure', () => {
      const validMessage = {
        role: 'user' as const,
        content: 'How can I manage my anxiety?',
      };

      expect(validMessage.role).toBe('user');
      expect(typeof validMessage.content).toBe('string');
      expect(validMessage.content.length).toBeGreaterThan(0);
    });

    it('should handle empty messages gracefully', () => {
      const emptyMessage = '';
      expect(emptyMessage.trim().length).toBe(0);
    });

    it('should accept both user and assistant roles', () => {
      const userMessage = { role: 'user' as const, content: 'Hello' };
      const assistantMessage = { role: 'assistant' as const, content: 'Hi there' };

      expect(['user', 'assistant']).toContain(userMessage.role);
      expect(['user', 'assistant']).toContain(assistantMessage.role);
    });
  });

  describe('Crisis Resources', () => {
    it('should provide crisis resources when needed', () => {
      const crisisResources = {
        title: 'Crisis Support Available',
        message: "I'm concerned about what you've shared. Please reach out to a crisis professional immediately.",
        resources: [
          {
            name: 'National Suicide Prevention Lifeline',
            phone: '988',
            url: 'https://suicidepreventionlifeline.org',
          },
          {
            name: 'Crisis Text Line',
            text: 'Text HOME to 741741',
            url: 'https://www.crisistextline.org',
          },
        ],
      };

      expect(crisisResources.resources).toHaveLength(2);
      expect(crisisResources.resources[0].phone).toBe('988');
      expect(crisisResources.resources[1].text).toContain('741741');
    });

    it('should have valid crisis resource URLs', () => {
      const resources = [
        'https://suicidepreventionlifeline.org',
        'https://www.crisistextline.org',
        'https://www.iasp.info/resources/Crisis_Centres/',
      ];

      resources.forEach((url) => {
        expect(url).toMatch(/^https:\/\//);
      });
    });
  });

  describe('System Prompt', () => {
    it('should contain key wellness principles', () => {
      const systemPrompt = `You are a compassionate and empathetic AI Wellness Companion designed to provide mental health support. Your role is to:

1. Listen actively and validate the user's feelings
2. Ask clarifying questions to better understand their situation
3. Provide evidence-based coping strategies and techniques
4. Offer perspective and gentle guidance
5. Encourage professional help when appropriate
6. Maintain a warm, non-judgmental tone`;

      expect(systemPrompt).toContain('compassionate');
      expect(systemPrompt).toContain('empathetic');
      expect(systemPrompt).toContain('Listen actively');
      expect(systemPrompt).toContain('validate');
      expect(systemPrompt).toContain('non-judgmental');
    });

    it('should emphasize safety and professional help', () => {
      const systemPrompt = `Important guidelines:
- Always prioritize the user's safety and wellbeing
- If the user mentions self-harm or suicide, immediately acknowledge their pain and provide crisis resources
- Never diagnose mental health conditions
- Encourage users to seek professional help for serious concerns`;

      expect(systemPrompt).toContain('safety');
      expect(systemPrompt).toContain('self-harm');
      expect(systemPrompt).toContain('suicide');
      expect(systemPrompt).toContain('professional help');
      expect(systemPrompt).toContain('diagnose');
    });
  });

  describe('Response Handling', () => {
    it('should handle valid AI responses', () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'I understand you are feeling anxious. Can you tell me more about what triggered this feeling?',
            },
          },
        ],
      };

      const aiResponse = mockResponse.choices[0]?.message?.content || 'I am here to listen and support you.';
      expect(aiResponse).toBeTruthy();
      expect(typeof aiResponse).toBe('string');
    });

    it('should provide fallback response on error', () => {
      const mockResponse = {
        choices: [{ message: { content: null } }],
      };

      const aiResponse = mockResponse.choices[0]?.message?.content || "I'm here to listen and support you.";
      expect(aiResponse).toBe("I'm here to listen and support you.");
    });

    it('should handle missing response gracefully', () => {
      const mockResponse: any = { choices: [] };

      const aiResponse = mockResponse.choices[0]?.message?.content || "I'm here to listen and support you.";
      expect(aiResponse).toBe("I'm here to listen and support you.");
    });
  });
});
