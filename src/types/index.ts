export type IdeaStatus = 'Draft' | 'Exploring' | 'Building' | 'Shipped' | 'Parked' | 'Archived';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  tags: string[];
  research: {
    problem: string;
    targetAudience: string;
    existingSolutions: string;
    techStack: string;
    notes: string;
  };
  tasks: Task[];
  createdAt: number;
  updatedAt: number;
}
