import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../repository/sequelize';

export interface RoleAttributes {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
}

export interface RoleCreationAttributes {
  id?: string;
  name: string;
  description?: string;
  created_at?: Date;
}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public created_at!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false,
  }
);
