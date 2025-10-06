export const TaskStatuses = ['pending', 'in-progress', 'done'] as const;
export type TaskStatus = (typeof TaskStatuses)[number];
