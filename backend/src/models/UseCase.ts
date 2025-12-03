import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { UseCaseAttributes } from '../types/UseCaseTypes';

export interface UseCaseCreationAttributes extends Optional<UseCaseAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class UseCase extends Model<UseCaseAttributes, UseCaseCreationAttributes> implements UseCaseAttributes {
  public id!: string;
  public title!: string;
  public short_description!: string;
  public full_description!: string;
  public department!: string;
  public status!: string;
  public owner_name!: string;
  public owner_email!: string;
  public image_url?: string;
  public business_impact?: string;
  public technology_stack!: string[];
  public internal_links!: object;
  public tags!: string[];
  public related_use_case_ids!: string[];
  public application_url?: string;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
}

UseCase.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    short_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    full_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['Marketing', 'R&D', 'Procurement', 'IT', 'HR', 'Operations']],
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['Ideation', 'Pre-Evaluation', 'Evaluation', 'PoC', 'MVP', 'Live', 'Archived']],
      },
    },
    owner_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    owner_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    business_impact: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    technology_stack: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    internal_links: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    related_use_case_ids: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    application_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'use_cases',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default UseCase;
