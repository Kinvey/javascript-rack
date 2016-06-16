import { AsciiTree } from './asciiTree';

export class Middleware {
  constructor(name = 'Middleware') {
    this.name = name;
  }

  async handle(request) {
    if (!request) {
      throw new Error('Request is null. Please provide a valid request.');
    }

    return request;
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
