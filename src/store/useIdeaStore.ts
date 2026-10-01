import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Idea, IdeaStatus } from '../types';

interface IdeaStore {
  ideas: Idea[];
  
  // Actions
  addIdea: (title: string, description: string, tags: string[]) => string;
  updateIdea: (id: string, updates: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  updateIdeaStatus: (id: string, status: IdeaStatus) => void;
  
  // Tasks
  addTask: (ideaId: string, title: string) => void;
  toggleTask: (ideaId: string, taskId: string) => void;
  deleteTask: (ideaId: string, taskId: string) => void;
  
  // Research
  updateResearch: (ideaId: string, research: Partial<Idea['research']>) => void;
  
  // Seed
  seedData: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useIdeaStore = create<IdeaStore>()(
  persist(
    (set, get) => ({
      ideas: [],

      addIdea: (title, description, tags) => {
        const id = generateId();
        set((state) => ({
          ideas: [
            {
              id,
              title,
              description,
              status: 'Draft',
              tags,
              research: {
                problem: '',
                targetAudience: '',
                existingSolutions: '',
                techStack: '',
                notes: '',
              },
              tasks: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
            ...state.ideas
          ]
        }));
        return id;
      },

      updateIdea: (id, updates) => set((state) => ({
        ideas: state.ideas.map((idea) =>
          idea.id === id ? { ...idea, ...updates, updatedAt: Date.now() } : idea
        )
      })),

      deleteIdea: (id) => set((state) => ({
        ideas: state.ideas.filter((idea) => idea.id !== id)
      })),

      updateIdeaStatus: (id, status) => set((state) => ({
        ideas: state.ideas.map((idea) =>
          idea.id === id ? { ...idea, status, updatedAt: Date.now() } : idea
        )
      })),

      addTask: (ideaId, title) => set((state) => ({
        ideas: state.ideas.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                tasks: [...idea.tasks, { id: generateId(), title, completed: false }],
                updatedAt: Date.now()
              }
            : idea
        )
      })),

      toggleTask: (ideaId, taskId) => set((state) => ({
        ideas: state.ideas.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                tasks: idea.tasks.map((task) =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                ),
                updatedAt: Date.now()
              }
            : idea
        )
      })),

      deleteTask: (ideaId, taskId) => set((state) => ({
        ideas: state.ideas.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                tasks: idea.tasks.filter((task) => task.id !== taskId),
                updatedAt: Date.now()
              }
            : idea
        )
      })),

      updateResearch: (ideaId, researchUpdates) => set((state) => ({
        ideas: state.ideas.map((idea) =>
          idea.id === ideaId
            ? {
                ...idea,
                research: { ...idea.research, ...researchUpdates },
                updatedAt: Date.now()
              }
            : idea
        )
      })),

      seedData: () => {
        if (get().ideas.length > 0) return;
        
        const seedIdeas: Idea[] = [
          {
            id: generateId(),
            title: 'ApplyReady',
            description: 'Resume gap analysis & rewriting tool based on a job description.',
            status: 'Building',
            tags: ['AI', 'Career', 'Product'],
            research: {
              problem: 'Tailoring resumes takes too much time.',
              targetAudience: 'Job seekers.',
              existingSolutions: 'Manual editing, ChatGPT.',
              techStack: 'React, OpenAI API.',
              notes: 'Needs a clean diff view.',
            },
            tasks: [
              { id: generateId(), title: 'Design UI', completed: true },
              { id: generateId(), title: 'Build input form', completed: true },
              { id: generateId(), title: 'Implement AI integration', completed: false },
            ],
            createdAt: Date.now() - 100000,
            updatedAt: Date.now(),
          },
          {
            id: generateId(),
            title: 'Tiny Product Lab',
            description: 'A collection of tiny experiments for learning product thinking through building.',
            status: 'Exploring',
            tags: ['Experiments', 'Learning'],
            research: {
              problem: 'People learn best by doing.',
              targetAudience: 'Beginner PMs and Developers.',
              existingSolutions: 'Bootcamps, tutorials.',
              techStack: 'Vanilla JS or React.',
              notes: '',
            },
            tasks: [],
            createdAt: Date.now() - 500000,
            updatedAt: Date.now() - 20000,
          }
        ];
        
        set({ ideas: seedIdeas });
      }
    }),
    {
      name: 'ideabox-storage',
    }
  )
);
