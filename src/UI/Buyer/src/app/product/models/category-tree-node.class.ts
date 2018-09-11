import { Category } from '@ordercloud/angular-sdk';

// CategoryTreeNode structures category data to be consumed by the 3rd party lib TreeComponent
export class CategoryTreeNode {
  parent: CategoryTreeNode;
  category: Category;
  // id, name, and children are required by TreeComponent
  id: string;
  name: string;
  children: CategoryTreeNode[];
}
