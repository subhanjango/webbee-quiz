import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column()
  url: string;
  
  @Column({ type: 'integer', default: null })
  parentId: number;
  
  @Column({ type: 'datetime' })
  createdAt: string;
  
  @OneToMany(() => MenuItem , (item) => item.parent)
  children? : MenuItem[]
  
  @ManyToOne(() => MenuItem , (item) => item.children)
  parent? : MenuItem[]
}
