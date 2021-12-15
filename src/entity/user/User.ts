import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @DeleteDateColumn()
  deletedAt: Date;

  setPassword = (password: string) => {
    return (this.password = bcrypt.hashSync(password, 8));
  };

  generateJWT = () => {
    return jwt.sign(
      {
        email: this.email,
      },
      "SECRET",
      { expiresIn: "1h" }
    );
  };

  isValidPassword = (password: string) => {
    return bcrypt.compareSync(password, this.password);
  };
}
