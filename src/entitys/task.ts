import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: false })
  status!: boolean;

  @Column()
  userId!: string;

  @ManyToOne(() => User, user => user.tasks)
  user!: User;

  @ManyToOne(() => Task, task => task.subtasks, { nullable: true })
  @JoinColumn({ name: 'parentTaskId' })
  parentTask!: Task;

  @OneToMany(() => Task, task => task.parentTask, { onDelete: 'CASCADE' })
  subtasks!: Task[];
}