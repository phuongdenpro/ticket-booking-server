import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'configs' })
export class Config {
  @PrimaryColumn({
    name: 'key',
    type: 'varchar',
    length: 50,
  })
  key: string;

  @Column({
    name: 'value',
    type: 'json',
  })
  value: any;
}
