import { IEntity } from 'src/shared-kernel/ddd/IEntity';

export interface IBuilder<TEntity extends IEntity> {
  build(): TEntity;
}
