
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../repository/sequelize';
import { CreateUseCaseDTO, UpdateUseCaseDTO, UseCaseAttributes, UseCaseCreationAttributes } from '../types/UseCaseTypes';

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
  public created_at!: Date;
  public updated_at!: Date;
  public application_url?: string;
}

UseCase.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    short_description: { type: DataTypes.STRING, allowNull: false },
    full_description: { type: DataTypes.TEXT, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    owner_name: { type: DataTypes.STRING, allowNull: false },
    owner_email: { type: DataTypes.STRING, allowNull: false },
    image_url: { type: DataTypes.STRING },
    business_impact: { type: DataTypes.STRING },
    technology_stack: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    internal_links: { type: DataTypes.JSONB, allowNull: false },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    related_use_case_ids: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    application_url: { type: DataTypes.STRING },
  },
  {
    sequelize,
    tableName: 'use_cases',
    timestamps: false,
  }
);
