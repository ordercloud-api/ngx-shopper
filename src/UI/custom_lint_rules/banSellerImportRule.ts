import * as ts from 'typescript';
import * as Lint from 'tslint';

/**
 * If you make changes to this file run `tsc banSellerImportRule.ts` to compile to js.
 *
 */
export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING =
    'seller import statement forbidden in this directory';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new NoBuyerImportWalker(sourceFile, this.getOptions())
    );
  }
}
// The walker takes care of all the work.
class NoBuyerImportWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    if (node.getText().indexOf('@app-seller') > -1) {
      // create a failure at the current position
      this.addFailure(
        this.createFailure(
          node.getStart(),
          node.getWidth(),
          Rule.FAILURE_STRING
        )
      );
    }

    // call the base version of this visitor to actually parse this node
    super.visitImportDeclaration(node);
  }
}
