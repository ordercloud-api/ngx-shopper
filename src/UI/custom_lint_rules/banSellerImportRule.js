"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
/**
 * If you make changes to this file run `tsc banImportsRule.ts` to compile to js.
 *
 */
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoBuyerImportWalker(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'seller import statement forbidden in this directory';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
// The walker takes care of all the work.
var NoBuyerImportWalker = /** @class */ (function (_super) {
    __extends(NoBuyerImportWalker, _super);
    function NoBuyerImportWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoBuyerImportWalker.prototype.visitImportDeclaration = function (node) {
        if (node.getText().indexOf('@app-seller') > -1) {
            // create a failure at the current position
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitImportDeclaration.call(this, node);
    };
    return NoBuyerImportWalker;
}(Lint.RuleWalker));
