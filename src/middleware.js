import { AsciiTree } from './asciitree';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars

export class Middleware {
  constructor(name = 'Middleware') {
    this.name = name;
  }

  async handle() {
    throw new Error('A subclass middleware must override the handle function.');
  }

  generateTree(level = 0) {
    const root = {
      value: this.name,
      level: level,
      nodes: []
    };
    return root;
  }

  toString() {
    const root = this.generateTree();
    return AsciiTree.generate(root);
  }
}
