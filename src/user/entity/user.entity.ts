import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { AuthProvider, AuthProviders, Role, Roles } from '../types';

@Entity()
export class User {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  role: string;

  @Property()
  email: string;

  @Property({ nullable: true })
  password?: string;

  @Property()
  authProvider: AuthProvider = AuthProviders.Local;

  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ nullable: true })
  picture?: string;

  @Property({ nullable: true })
  bio?: string;

  @Property({ nullable: true })
  location?: string;

  @Property({ nullable: true })
  website?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date;
}
